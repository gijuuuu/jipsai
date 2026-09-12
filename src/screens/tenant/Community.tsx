import { NAVY, ORANGE, IVORY } from "../../theme";
import { NavHeader } from "../../ui";
import { useAppData } from "../../store";
import { BUILDING } from "../../data";
import type { TenantNavigate } from "./types";

export default function CommunityScreen({ navigate }: { navigate: TenantNavigate }) {
  const { notices: allNotices, freePosts } = useAppData();
  const notices = allNotices.filter((n) => n.buildingId === BUILDING.id);

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader
        title="게시판"
        onBack={() => navigate("home")}
        rightEl={
          <button onClick={() => navigate("community-write")} className="ml-auto px-3 py-1.5 rounded-xl text-xs font-extrabold flex-shrink-0 active:scale-95" style={{ background: ORANGE, color: NAVY }}>
            + 글쓰기
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Notice */}
        <div className="px-4 pt-4">
          <div className="mb-2">
            <div className="font-extrabold text-base" style={{ color: NAVY }}>
              공지 게시판
            </div>
            <div className="text-xs font-medium mt-0.5" style={{ color: NAVY, opacity: 0.38 }}>
              집주인만 작성할 수 있습니다
            </div>
          </div>
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
        {/* Free */}
        <div className="px-4 pt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="font-extrabold text-base" style={{ color: NAVY }}>
              자유 게시판
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {freePosts.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate("community-detail", { postId: p.id })}
                className="w-full text-left rounded-2xl border-2 bg-white px-4 py-3.5 active:scale-[0.98] transition-transform"
                style={{ borderColor: NAVY }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded" style={{ background: "#eef0fa", color: NAVY }}>
                    {p.author}
                  </span>
                  <span className="text-xs" style={{ color: NAVY, opacity: 0.32 }}>
                    {p.date}
                  </span>
                </div>
                <div className="font-bold text-sm leading-snug mb-2" style={{ color: NAVY }}>
                  {p.title}
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: NAVY, opacity: 0.42 }}>
                  <span>💬 {p.comments.length}</span>
                  <span>❤️ {p.likes}</span>
                  {p.photos.length > 0 && <span>📷 {p.photos.length}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
