import { Prisma } from "@prisma/client";

export type ActionErrorCode =
  | "VALIDATION_ERROR"
  | "DUPLICATE"
  | "RATE_LIMITED"
  | "NOT_FOUND"
  | "CONCURRENCY_ERROR"
  | "SERVER_ERROR";

export type ActionFailure = {
  success: false;
  error: string;
  code: ActionErrorCode;
  field?: string;
};

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | ActionFailure;

/**
 * Maps known Prisma database exceptions into sanitized, localized Danish feedback
 * without exposing internal database structures or SQL details.
 */
export function handleDatabaseError(
  error: unknown,
  fallbackMessage: string = "Der opstod en uventet databasefejl."
): ActionFailure {
  console.error("Database Action Error:", error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        const target = (error.meta?.target as string[] | string) || "";
        const targetStr = Array.isArray(target) ? target.join(", ") : String(target);

        if (targetStr.includes("studentId")) {
          return {
            success: false,
            error: "Der findes allerede en studerende med dette studienummer i systemet.",
            code: "DUPLICATE",
            field: "studentId",
          };
        }
        if (targetStr.includes("email")) {
          return {
            success: false,
            error: "Der findes allerede en studerende med denne e-mailadresse.",
            code: "DUPLICATE",
            field: "email",
          };
        }
        if (targetStr.includes("assetTag")) {
          return {
            success: false,
            error: "Dette stregkodenummer (asset tag) er allerede i brug på et andet stykke udstyr.",
            code: "DUPLICATE",
            field: "assetTag",
          };
        }
        if (targetStr.includes("name") || targetStr.includes("slug")) {
          return {
            success: false,
            error: "Der findes allerede en registrering med dette navn eller id.",
            code: "DUPLICATE",
          };
        }

        return {
          success: false,
          error: "Handlingen kunne ikke gennemføres, da en lignende registrering allerede findes.",
          code: "DUPLICATE",
        };
      }

      case "P2025":
        return {
          success: false,
          error: "Den efterspurgte registrering findes ikke i systemet (kan være slettet).",
          code: "NOT_FOUND",
        };

      case "P2003":
        return {
          success: false,
          error: "Handlingen kan ikke udføres på grund af afhængige data (f.eks. aktive udlån).",
          code: "SERVER_ERROR",
        };

      default:
        break;
    }
  }

  if (error instanceof Error) {
    // If the error message already has a clean domain-level description
    if (
      error.message.includes("allerede udlånt") ||
      error.message.includes("ikke tilgængelig") ||
      error.message.includes("Valideringsfejl")
    ) {
      return {
        success: false,
        error: error.message,
        code: error.message.includes("Valideringsfejl") ? "VALIDATION_ERROR" : "CONCURRENCY_ERROR",
      };
    }
  }

  return {
    success: false,
    error: fallbackMessage,
    code: "SERVER_ERROR",
  };
}
