import { NAVY, ORANGE, IVORY } from "../../theme";
import { NavHeader } from "../../ui";
import { useAppData } from "../../store";
import { getBuilding } from "../../data";
import type { LandlordNavigate } from "./types";

export default function NoticeManageScreen({ buildingId, navigate }: { buildingId: number; navigate: LandlordNavigate }) {
  const { notices: allNotices } = useAppData();
  const building = getBuilding(buildingId);
  const notices = allNotices.filter((n) => n.buildingId === buildingId);

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader
        title={`${building.name} 공지 관리`}
        subtitle="세입자 게시판에 노출됩니다"
        onBack={() => navigate("notice-building-select")}
        rightEl={
          <button onClick={() => navigate("notice-write", { buildingId })} className="ml-auto px-3 py-1.5 rounded-xl text-xs font-extrabold flex-shrink-0 active:scale-95" style={{ background: ORANGE, color: NAVY }}>
            + 공지 작성
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <p className="text-xs font-medium mb-3" style={{ color: NAVY, opacity: 0.45 }}>
          여기서 작성한 공지는 {building.name} 세입자 앱의 &lsquo;게시판 &gt; 공지 게시판&rsquo;에 그대로 표시됩니다.
        </p>
        {notices.length === 0 && (
          <p className="text-sm font-medium text-center mt-10" style={{ color: NAVY, opacity: 0.4 }}>
            등록된 공지가 없습니다.
          </p>
        )}
        <div className="flex flex-col gap-2.5">
          {notices.map((p) => (
            <div key={p.id} className="rounded-2xl border-2 bg-white px-4 py-3.5" style={{ borderColor: NAVY }}>
              <div className="flex items-start gap-2 mb-1">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded flex-shrink-0 mt-0.5" style={{ background: "#fff0d4", color: ORANGE }}>
                  공지
                </span>
                <span className="font-bold text-sm leading-snug" style={{ color: NAVY }}>
                  {p.title}
                </span>
              </div>
              <p className="text-xs font-medium leading-relaxed line-clamp-2 mb-1.5" style={{ color: NAVY, opacity: 0.5 }}>
                {p.content}
              </p>
              <span className="text-xs" style={{ color: NAVY, opacity: 0.32 }}>
                {p.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
