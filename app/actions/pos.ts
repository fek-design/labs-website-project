"use server";

import { prisma } from "@/lib/prisma";
import { LoanStatus, OperationalStatus, HardwareType } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Helper to retrieve a fallback system admin ID if an action is performed
 * without an explicit authenticated admin session.
 */
async function getActorAdminId(providedAdminId?: string): Promise<string> {
  if (providedAdminId) {
    const admin = await prisma.admin.findUnique({ where: { id: providedAdminId } });
    if (admin) return admin.id;
  }

  // Fallback to technician or super admin
  const defaultAdmin =
    (await prisma.admin.findFirst({ where: { isActive: true, role: "TECHNICIAN" } })) ||
    (await prisma.admin.findFirst({ where: { isActive: true } }));

  if (!defaultAdmin) {
    // Create default fallback technician admin if database is unseeded
    const newAdmin = await prisma.admin.create({
      data: {
        username: "system_technician",
        passwordHash: "local_system_unauthenticated",
        role: "TECHNICIAN",
        isActive: true,
      },
    });
    return newAdmin.id;
  }

  return defaultAdmin.id;
}

/**
 * 1. Search Patron (by student ID or email) OR Inventory Asset (by assetTag, name, or location)
 */
export async function searchPatronOrAsset(query: string, labSlug: string = "medialab") {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return { patrons: [], assets: [], exactMatch: null };
  }

  const [patrons, assets] = await Promise.all([
    prisma.patron.findMany({
      where: {
        OR: [
          { studentId: { contains: cleanQuery } },
          { email: { contains: cleanQuery } },
        ],
      },
      include: {
        loans: {
          where: { status: LoanStatus.ACTIVE },
          include: {
            inventory: true,
          },
        },
      },
      take: 5,
    }),
    prisma.inventory.findMany({
      where: {
        lab: labSlug ? { slug: labSlug } : undefined,
        OR: [
          { assetTag: { contains: cleanQuery } },
          { name: { contains: cleanQuery } },
          { location: { contains: cleanQuery } },
        ],
      },
      include: {
        lab: true,
        tags: { include: { tag: true } },
        loans: {
          where: { status: LoanStatus.ACTIVE },
          include: {
            patron: true,
          },
        },
      },
      take: 6,
    }),
  ]);

  // Determine if there's an exact barcode match
  const exactPatron = patrons.find(
    (p) => p.studentId.toLowerCase() === cleanQuery.toLowerCase() || p.email.toLowerCase() === cleanQuery.toLowerCase()
  );
  const exactAsset = assets.find((a) => a.assetTag.toLowerCase() === cleanQuery.toLowerCase());

  return {
    patrons,
    assets,
    exactMatch: exactPatron
      ? { type: "PATRON" as const, data: exactPatron }
      : exactAsset
      ? { type: "ASSET" as const, data: exactAsset }
      : null,
  };
}

/**
 * 2. Get Patron full details including active and historical loans
 */
export async function getPatronDetails(patronIdOrStudentId: string) {
  const patron = await prisma.patron.findFirst({
    where: {
      OR: [
        { id: patronIdOrStudentId },
        { studentId: patronIdOrStudentId },
        { email: patronIdOrStudentId },
      ],
    },
    include: {
      loans: {
        include: {
          inventory: {
            include: { lab: true },
          },
          adminOut: { select: { username: true } },
          adminIn: { select: { username: true } },
        },
        orderBy: { checkoutDate: "desc" },
      },
    },
  });

  return patron;
}

/**
 * 3. Create or update Patron (No arbitrary blocking rules)
 */
export async function createOrUpdatePatron(data: {
  studentId: string;
  email?: string;
  adminId?: string;
}) {
  const adminId = await getActorAdminId(data.adminId);
  const normalizedStudentId = data.studentId.trim();
  const normalizedEmail = data.email?.trim() || `${normalizedStudentId.toLowerCase()}@edu.zealand.dk`;

  const existingPatron = await prisma.patron.findFirst({
    where: {
      OR: [{ studentId: normalizedStudentId }, { email: normalizedEmail }],
    },
  });

  if (existingPatron) {
    const updated = await prisma.patron.update({
      where: { id: existingPatron.id },
      data: {
        email: normalizedEmail,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorAdminId: adminId,
        actionType: "UPDATE_PATRON",
        targetTable: "Patron",
        targetId: updated.id,
        payloadDelta: { studentId: normalizedStudentId, email: normalizedEmail },
      },
    });

    return { success: true, patron: updated, created: false };
  }

  const created = await prisma.patron.create({
    data: {
      studentId: normalizedStudentId,
      email: normalizedEmail,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorAdminId: adminId,
      actionType: "CREATE_PATRON",
      targetTable: "Patron",
      targetId: created.id,
      payloadDelta: { studentId: normalizedStudentId, email: normalizedEmail },
    },
  });

  return { success: true, patron: created, created: true };
}

/**
 * 4. List all patrons
 */
export async function getPatronList() {
  return await prisma.patron.findMany({
    include: {
      loans: {
        where: { status: LoanStatus.ACTIVE },
        include: { inventory: true },
      },
    },
    orderBy: { studentId: "asc" },
  });
}

/**
 * 5. Checkout Equipment (Default 1 month / 30 days)
 */
export async function checkoutEquipment(data: {
  patronId: string;
  inventoryIds: string[];
  expectedReturn?: string | Date;
  adminId?: string;
  notes?: string;
}) {
  const actorId = await getActorAdminId(data.adminId);

  // Default to 30 days if not provided
  let expectedReturnDate: Date;
  if (data.expectedReturn) {
    expectedReturnDate = new Date(data.expectedReturn);
  } else {
    expectedReturnDate = new Date();
    expectedReturnDate.setDate(expectedReturnDate.getDate() + 30);
    expectedReturnDate.setHours(16, 0, 0, 0);
  }

  if (isNaN(expectedReturnDate.getTime())) {
    throw new Error("Invalid expected return date provided.");
  }

  if (!data.inventoryIds || data.inventoryIds.length === 0) {
    throw new Error("No equipment items selected for checkout.");
  }

  const patron = await prisma.patron.findUnique({
    where: { id: data.patronId },
  });

  if (!patron) {
    throw new Error("Patron record not found.");
  }

  return await prisma.$transaction(async (tx) => {
    // Validate availability of all items
    const items = await tx.inventory.findMany({
      where: { id: { in: data.inventoryIds } },
      include: {
        loans: {
          where: { status: LoanStatus.ACTIVE },
        },
      },
    });

    if (items.length !== data.inventoryIds.length) {
      throw new Error("One or more selected inventory items could not be found.");
    }

    for (const item of items) {
      if (item.operationalStatus === OperationalStatus.BROKEN) {
        throw new Error(`Item ${item.name} (${item.assetTag}) is marked as BROKEN and cannot be loaned.`);
      }
      if (item.loans.length > 0) {
        throw new Error(`Item ${item.name} (${item.assetTag}) currently has an ACTIVE loan.`);
      }
    }

    const createdLoans = [];

    for (const item of items) {
      const loan = await tx.loan.create({
        data: {
          inventoryId: item.id,
          patronId: patron.id,
          adminIdCheckout: actorId,
          status: LoanStatus.ACTIVE,
          checkoutDate: new Date(),
          expectedReturn: expectedReturnDate,
          notes: data.notes || null,
        },
        include: {
          inventory: true,
          patron: true,
        },
      });

      await tx.auditLog.create({
        data: {
          actorAdminId: actorId,
          actionType: "CHECKOUT_LOAN",
          targetTable: "Loan",
          targetId: loan.id,
          payloadDelta: {
            assetTag: item.assetTag,
            patronStudentId: patron.studentId,
            expectedReturn: expectedReturnDate.toISOString(),
          },
        },
      });

      createdLoans.push(loan);
    }

    revalidatePath("/admin/pos");
    return { success: true, loans: createdLoans };
  });
}

/**
 * 6. Return Equipment Check-in
 */
export async function returnEquipment(data: {
  loanId: string;
  adminId?: string;
  status?: "RETURNED" | "DAMAGED" | "LOST";
  damageNotes?: string;
  sendToRepair?: boolean;
}) {
  const actorId = await getActorAdminId(data.adminId);
  const finalStatus =
    data.status === "DAMAGED"
      ? LoanStatus.DAMAGED
      : data.status === "LOST"
      ? LoanStatus.LOST
      : LoanStatus.RETURNED;

  return await prisma.$transaction(async (tx) => {
    const loan = await tx.loan.findUnique({
      where: { id: data.loanId },
      include: { inventory: true, patron: true },
    });

    if (!loan) {
      throw new Error("Loan transaction record not found.");
    }

    if (loan.status !== LoanStatus.ACTIVE && loan.status !== LoanStatus.OVERDUE) {
      throw new Error(`Loan is already marked as ${loan.status}.`);
    }

    const updatedLoan = await tx.loan.update({
      where: { id: loan.id },
      data: {
        status: finalStatus,
        actualReturn: new Date(),
        adminIdCheckin: actorId,
        notes: data.damageNotes ? `${loan.notes ? loan.notes + " | " : ""}Return note: ${data.damageNotes}` : loan.notes,
      },
    });

    // If damaged or sent to repair, update inventory state and create repair record
    if (finalStatus === LoanStatus.DAMAGED || data.sendToRepair) {
      await tx.inventory.update({
        where: { id: loan.inventoryId },
        data: { operationalStatus: OperationalStatus.MAINTENANCE },
      });

      await tx.repairLog.create({
        data: {
          inventoryId: loan.inventoryId,
          description: data.damageNotes || "Damaged upon return check-in.",
          sentTo: "In-house Repair / Technician Inspection",
          isResolved: false,
        },
      });
    }

    await tx.auditLog.create({
      data: {
        actorAdminId: actorId,
        actionType: "RETURN_LOAN",
        targetTable: "Loan",
        targetId: loan.id,
        payloadDelta: {
          status: finalStatus,
          assetTag: loan.inventory.assetTag,
          patronStudentId: loan.patron.studentId,
          damageNotes: data.damageNotes,
          sendToRepair: data.sendToRepair,
        },
      },
    });

    revalidatePath("/admin/pos");
    return { success: true, loan: updatedLoan };
  });
}

/**
 * 7. Modify Active Loan (e.g. Extend Return Date, Edit Notes)
 */
export async function modifyLoan(data: {
  loanId: string;
  expectedReturn?: string | Date;
  notes?: string;
  adminId?: string;
}) {
  const actorId = await getActorAdminId(data.adminId);

  const existingLoan = await prisma.loan.findUnique({
    where: { id: data.loanId },
    include: { inventory: true, patron: true },
  });

  if (!existingLoan) {
    throw new Error("Loan not found.");
  }

  const updatePayload: any = {};
  if (data.expectedReturn) {
    const newDate = new Date(data.expectedReturn);
    if (!isNaN(newDate.getTime())) {
      updatePayload.expectedReturn = newDate;
    }
  }
  if (data.notes !== undefined) {
    updatePayload.notes = data.notes;
  }

  const updated = await prisma.loan.update({
    where: { id: existingLoan.id },
    data: updatePayload,
  });

  await prisma.auditLog.create({
    data: {
      actorAdminId: actorId,
      actionType: "MODIFY_LOAN",
      targetTable: "Loan",
      targetId: updated.id,
      payloadDelta: {
        assetTag: existingLoan.inventory.assetTag,
        patronStudentId: existingLoan.patron.studentId,
        oldExpectedReturn: existingLoan.expectedReturn.toISOString(),
        newExpectedReturn: updated.expectedReturn.toISOString(),
        notes: updated.notes,
      },
    },
  });

  revalidatePath("/admin/pos");
  return { success: true, loan: updated };
}

/**
 * 8. Get Overdue Loans
 */
export async function getOverdueLoans(labSlug: string = "medialab") {
  const now = new Date();

  const loans = await prisma.loan.findMany({
    where: {
      status: LoanStatus.ACTIVE,
      expectedReturn: { lt: now },
      inventory: labSlug ? { lab: { slug: labSlug } } : undefined,
    },
    include: {
      inventory: { include: { lab: true } },
      patron: true,
      adminOut: { select: { username: true } },
    },
    orderBy: { expectedReturn: "asc" },
  });

  return loans.map((loan) => {
    const overdueMs = now.getTime() - new Date(loan.expectedReturn).getTime();
    const overdueDays = Math.floor(overdueMs / (1000 * 60 * 60 * 24));
    const overdueHours = Math.floor((overdueMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return {
      ...loan,
      overdueDays,
      overdueHours,
      overdueFormatted: overdueDays > 0 ? `${overdueDays}d ${overdueHours}h overdue` : `${overdueHours}h overdue`,
    };
  });
}

/**
 * 9. Get Calendar Loans
 */
export async function getCalendarLoans(params: {
  startDate: string | Date;
  endDate: string | Date;
  labSlug?: string;
}) {
  const start = new Date(params.startDate);
  const end = new Date(params.endDate);
  const now = new Date();

  const loans = await prisma.loan.findMany({
    where: {
      inventory: params.labSlug ? { lab: { slug: params.labSlug } } : undefined,
      OR: [
        { expectedReturn: { gte: start, lte: end } },
        { checkoutDate: { gte: start, lte: end } },
        {
          checkoutDate: { lte: end },
          actualReturn: null,
          status: LoanStatus.ACTIVE,
        },
      ],
    },
    include: {
      inventory: { include: { lab: true } },
      patron: true,
      adminOut: { select: { username: true } },
      adminIn: { select: { username: true } },
    },
    orderBy: { expectedReturn: "asc" },
  });

  return loans.map((loan) => {
    const isOverdue = loan.status === LoanStatus.ACTIVE && new Date(loan.expectedReturn) < now;
    return {
      ...loan,
      isOverdue,
      displayStatus: isOverdue ? "OVERDUE" : loan.status,
    };
  });
}

/**
 * 10. Get Lab Inventory for POS checkout listing
 */
export async function getLabInventory(labSlug: string = "medialab") {
  return await prisma.inventory.findMany({
    where: {
      lab: { slug: labSlug },
      hardwareType: HardwareType.BORROWABLE_GEAR,
    },
    include: {
      tags: { include: { tag: true } },
      loans: {
        where: { status: LoanStatus.ACTIVE },
        include: { patron: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

/**
 * 11. Get Active Loans
 */
export async function getActiveLoans(labSlug: string = "medialab") {
  const now = new Date();
  const loans = await prisma.loan.findMany({
    where: {
      status: LoanStatus.ACTIVE,
      inventory: labSlug ? { lab: { slug: labSlug } } : undefined,
    },
    include: {
      inventory: { include: { lab: true } },
      patron: true,
      adminOut: { select: { username: true } },
    },
    orderBy: { expectedReturn: "asc" },
  });

  return loans.map((loan) => {
    const isOverdue = new Date(loan.expectedReturn) < now;
    return {
      ...loan,
      isOverdue,
    };
  });
}

/**
 * 12. POS Dashboard Telemetry Summary
 */
export async function getPosStats(labSlug: string = "medialab") {
  const now = new Date();

  const [activeLoansCount, overdueLoansCount, availableGearCount, totalGearCount] = await Promise.all([
    prisma.loan.count({
      where: {
        status: LoanStatus.ACTIVE,
        inventory: { lab: { slug: labSlug } },
      },
    }),
    prisma.loan.count({
      where: {
        status: LoanStatus.ACTIVE,
        expectedReturn: { lt: now },
        inventory: { lab: { slug: labSlug } },
      },
    }),
    prisma.inventory.count({
      where: {
        lab: { slug: labSlug },
        hardwareType: HardwareType.BORROWABLE_GEAR,
        operationalStatus: OperationalStatus.AVAILABLE,
        loans: { none: { status: LoanStatus.ACTIVE } },
      },
    }),
    prisma.inventory.count({
      where: {
        lab: { slug: labSlug },
        hardwareType: HardwareType.BORROWABLE_GEAR,
      },
    }),
  ]);

  return {
    activeLoansCount,
    overdueLoansCount,
    availableGearCount,
    totalGearCount,
  };
}
