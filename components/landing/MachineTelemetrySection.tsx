import React from "react";
import Image from "next/image";

export interface MachineItem {
  id: string;
  name: string;
  location?: string | null;
  operationalStatus?: string | null;
}

interface MachineTelemetryProps {
  machineCount: number;
  machines?: MachineItem[];
}

export function MachineTelemetrySection({ machineCount, machines = [] }: MachineTelemetryProps) {
  // If no machines in database, use realistic defaults matching Zealand Labs equipment
  const baseMachines: MachineItem[] = machines.length > 0 ? machines : [
    { id: "m-1", name: "Prusa core one", location: "Makerspace - 3D Lab", operationalStatus: "AVAILABLE" },
    { id: "m-2", name: "Prusa core one", location: "Makerspace - 3D Lab", operationalStatus: "AVAILABLE" },
    { id: "m-3", name: "Prusa core one", location: "Makerspace - 3D Lab", operationalStatus: "AVAILABLE" },
    { id: "m-4", name: "Epilog Zing 24 Laser", location: "Makerspace - Laser Cut", operationalStatus: "AVAILABLE" },
    { id: "m-5", name: "Roland TrueVIS SG-300", location: "Medialab - Wide Print", operationalStatus: "AVAILABLE" },
    { id: "m-6", name: "Formlabs Form 4 Resin", location: "Makerspace - Precision Lab", operationalStatus: "MAINTENANCE" },
  ];

  // If fewer than 4 machines, duplicate to ensure enough height for continuous vertical autoscroll
  const workingSet = baseMachines.length < 4 ? [...baseMachines, ...baseMachines] : baseMachines;
  // Duplicate for seamless 0% -> -50% infinite translation loop
  const tickerMachines = [...workingSet, ...workingSet];

  const totalCount = machines.length > 0 ? `${machines.length}` : `${machineCount}+`;

  return (
    <section id="machines" className="w-full bg-black text-white py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 sm:space-y-10">
      {/* Headings */}
      <div className="space-y-3 sm:space-y-4 max-w-2xl">
        <h2 className="font-notch text-2xl sm:text-4xl md:text-5xl font-light text-white tracking-tight leading-tight">
          Vi har sikkert en maskine
          <br />
          til dit formål
        </h2>
        <p className="font-sans text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
          Få fri adgang til industrielt hardware til rapid prototyping. Tjek maskinens live-status og opsætning hjemmefra, mød op, scan QR-koden, og begynd at bygge.
        </p>
      </div>

      {/* Grid: Stat Counter on Top/Left, Clipped Autoscrolling Machine Cards on Bottom/Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Left Stat */}
        <div className="md:col-span-4 flex flex-col justify-center">
          <span className="font-sans text-xs sm:text-base font-semibold text-white/80">
            Maskiner
          </span>
          <span className="font-notch text-5xl sm:text-7xl md:text-8xl font-extrabold text-white tracking-tighter leading-none mt-1">
            {totalCount}
          </span>
          <span className="text-[11px] sm:text-xs text-zinc-500 font-mono mt-2 sm:mt-3">
            Realtidsstatus fra Zealand Labs database
          </span>
        </div>

        {/* Right Machine Status Viewport - Fixed 3 Cards Height (~270px), Clipped, Autoscrolling */}
        <div className="md:col-span-8 relative h-[270px] overflow-hidden rounded-xl border border-[#262626] bg-[#0c0c0e]/80 p-2 shadow-2xl">
          {/* Subtle top & bottom edge gradient fades */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#0c0c0e] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#0c0c0e] to-transparent z-10" />

          {/* Autoscrolling Track Container (pause on hover or touch hold, no scrollbars) */}
          <div className="animate-telemetry-vertical gap-2 sm:gap-2.5 active:[animation-play-state:paused] hover:[animation-play-state:paused]">
            {tickerMachines.map((m, idx) => {
              const isAvail = m.operationalStatus === "AVAILABLE" || !m.operationalStatus;
              const isMaint = m.operationalStatus === "MAINTENANCE";

              return (
                <div
                  key={`${m.id}-${idx}`}
                  className="w-full bg-[#141416] border border-[#262626] rounded-lg p-2.5 sm:p-3.5 flex items-center justify-between gap-3 sm:gap-4 hover:border-white/30 hover:shadow-lg transition-all flex-shrink-0 cursor-default"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                    <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-md bg-[#18181b] border border-[#262626] overflow-hidden flex-shrink-0">
                      <Image
                        src="/images/landing/machine-prusa.png"
                        alt={m.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-sans text-xs sm:text-base font-bold text-white tracking-tight truncate">
                        {m.name}
                      </h4>
                      <span className="block font-sans text-[11px] sm:text-xs text-zinc-400 truncate">
                        {m.location || "Makerspace Workstation"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 pr-1 sm:pr-2 flex-shrink-0">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isAvail
                          ? "bg-emerald-400 animate-pulse"
                          : isMaint
                          ? "bg-brand-yellow"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="font-sans text-[11px] sm:text-xs font-semibold text-zinc-300">
                      {isAvail ? "Klar" : isMaint ? "Service" : "Optaget"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
