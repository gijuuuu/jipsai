import { NAVY, IVORY } from "../../theme";
import { NavHeader } from "../../ui";
import { IconBuilding, IconChevronRight } from "../../icons";
import { useAppData } from "../../store";
import { BUILDINGS } from "../../data";
import type { LandlordNavigate } from "./types";

export default function BuildingList({ navigate }: { navigate: LandlordNavigate }) {
  const { complaints } = useAppData();

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title="내 건물 관리" onBack={() => navigate("home")} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2.5">
        {BUILDINGS.map((b) => {
          const unitNumbers = new Set(b.units.map((u) => u.number));
          const pending = complaints.filter((c) => c.status !== "완료" && unitNumbers.has(c.unitNumber)).length;
          return (
            <button
              key={b.id}
              onClick={() => navigate("building-detail", { buildingId: b.id })}
              className="w-full flex items-center gap-4 rounded-2xl border-2 bg-white p-4 active:scale-[0.98] transition-transform text-left"
              style={{ borderColor: NAVY }}
            >
              <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#eef0fa", width: 48, height: 48 }}>
                <IconBuilding size={26} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-extrabold" style={{ color: NAVY }}>
                  {b.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: NAVY, opacity: 0.45 }}>
                  총 {b.units.length}세대 · {b.address}
                </p>
              </div>
              {pending > 0 && (
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full mr-1" style={{ background: "#ffeae0", color: "#d04a0a" }}>
                  요청 {pending}
                </span>
              )}
              <IconChevronRight />
            </button>
          );
        })}
      </div>
    </div>
  );
}
