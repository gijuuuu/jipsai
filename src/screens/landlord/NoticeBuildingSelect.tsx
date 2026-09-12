import { NAVY, IVORY } from "../../theme";
import { NavHeader } from "../../ui";
import { IconBuilding, IconChevronRight } from "../../icons";
import { BUILDINGS } from "../../data";
import type { LandlordNavigate } from "./types";

// 공지 관리 / 게시판 보기를 눌렀을 때 먼저 뜨는 건물 선택 화면.
// 여기서 건물을 고르면 그 건물의 공지 관리 화면으로 이동합니다.
export default function NoticeBuildingSelect({ navigate }: { navigate: LandlordNavigate }) {
  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title="공지 관리" subtitle="건물을 선택하세요" onBack={() => navigate("home")} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2.5">
        {BUILDINGS.map((b) => (
          <button
            key={b.id}
            onClick={() => navigate("notice-manage", { buildingId: b.id })}
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
            <IconChevronRight />
          </button>
        ))}
      </div>
    </div>
  );
}
