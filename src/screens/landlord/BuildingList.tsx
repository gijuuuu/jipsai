import { NAVY, IVORY } from "../../theme";
import { NavHeader } from "../../ui";
import { IconBuilding, IconChevronRight } from "../../icons";
import { useAppData } from "../../store";
import { BUILDING } from "../../data";
import type { LandlordNavigate } from "./types";

export default function BuildingList({ navigate }: { navigate: LandlordNavigate }) {
  const { complaints } = useAppData();
  const pending = complaints.filter((c) => c.status !== "완료").length;

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title="내 건물 관리" onBack={() => navigate("home")} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2.5">
        <button
          onClick={() => navigate("building-detail")}
          className="w-full flex items-center gap-4 rounded-2xl border-2 bg-white p-4 active:scale-[0.98] transition-transform text-left"
          style={{ borderColor: NAVY }}
        >
          <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#eef0fa", width: 48, height: 48 }}>
            <IconBuilding size={26} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-extrabold" style={{ color: NAVY }}>
              {BUILDING.name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: NAVY, opacity: 0.45 }}>
              총 {BUILDING.units.length}세대 · {BUILDING.address}
            </p>
          </div>
          {pending > 0 && (
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full mr-1" style={{ background: "#ffeae0", color: "#d04a0a" }}>
              요청 {pending}
            </span>
          )}
          <IconChevronRight />
        </button>
      </div>
    </div>
  );
}
