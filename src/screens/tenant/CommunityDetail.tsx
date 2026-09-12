import { useRef, useState } from "react";
import { NAVY, ORANGE, IVORY } from "../../theme";
import { NavHeader } from "../../ui";
import { IconHeart, IconComment, AvatarIcon } from "../../icons";
import { useAppData } from "../../store";
import { CURRENT_TENANT } from "../../data";
import type { TenantNavigate } from "./types";

export default function CommunityDetailScreen({ postId, navigate }: { postId: number; navigate: TenantNavigate }) {
  const { freePosts, addComment, toggleLike } = useAppData();
  const post = freePosts.find((p) => p.id === postId);
  const [liking, setLiking] = useState(false);
  const [comment, setComment] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (!post) {
    return (
      <div className="flex flex-col h-full" style={{ background: IVORY }}>
        <NavHeader title="게시글" onBack={() => navigate("community")} />
        <div className="flex-1 flex items-center justify-center">
          <span className="text-sm font-medium" style={{ color: NAVY, opacity: 0.4 }}>
            삭제되었거나 존재하지 않는 게시글입니다.
          </span>
        </div>
      </div>
    );
  }

  const liked = !!post.likedByMe;

  const submitComment = () => {
    if (!comment.trim()) return;
    addComment(post.id, `${CURRENT_TENANT.unitNumber}호`, comment.trim());
    setComment("");
  };

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    try {
      await toggleLike(post.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "처리에 실패했습니다.");
    } finally {
      setLiking(false);
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title="게시글" onBack={() => navigate("community")} />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-2">
        <div className="flex items-center gap-2.5 mb-3">
          <AvatarIcon label={post.author} size={36} />
          <div>
            <div className="font-extrabold text-sm" style={{ color: NAVY }}>
              {post.author}
            </div>
            <div className="text-xs" style={{ color: NAVY, opacity: 0.38 }}>
              {post.date}
            </div>
          </div>
        </div>
        <div className="font-extrabold text-lg leading-snug mb-3" style={{ color: NAVY }}>
          {post.title}
        </div>
        <p className="text-sm font-medium leading-relaxed whitespace-pre-line mb-4" style={{ color: NAVY, opacity: 0.8 }}>
          {post.body}
        </p>
        {post.hasPhoto && (
          <div className="rounded-2xl mb-4 flex items-center justify-center" style={{ height: 160, background: "#eef0fa", border: `1.5px solid ${NAVY}20` }}>
            <span style={{ fontSize: 40 }}>🖼️</span>
          </div>
        )}
        <div className="flex items-center gap-4 py-3 border-t border-b mb-4" style={{ borderColor: "#eee" }}>
          <button onClick={handleLike} disabled={liking} className="flex items-center gap-1.5 active:scale-95 transition-transform">
            <IconHeart filled={liked} size={22} />
            <span className="text-sm font-bold" style={{ color: liked ? ORANGE : NAVY, opacity: liked ? 1 : 0.55 }}>
              {post.likes}
            </span>
          </button>
          <button onClick={() => inputRef.current?.focus()} className="flex items-center gap-1.5 active:scale-95 transition-transform">
            <IconComment size={22} />
            <span className="text-sm font-bold" style={{ color: NAVY, opacity: 0.55 }}>
              {post.comments.length}
            </span>
          </button>
        </div>
        <div className="flex flex-col gap-3 pb-2">
          {post.comments.map((c) => (
            <div key={c.id} className="flex gap-2.5">
              <AvatarIcon label={c.author} size={30} />
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-extrabold" style={{ color: NAVY }}>
                    {c.author}
                  </span>
                  <span className="text-xs" style={{ color: NAVY, opacity: 0.32 }}>
                    {c.time}
                  </span>
                </div>
                <p className="text-sm font-medium leading-snug mt-0.5" style={{ color: NAVY, opacity: 0.8 }}>
                  {c.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 border-t" style={{ background: "white", borderColor: "#eee" }}>
        <input
          ref={inputRef}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글을 입력하세요..."
          className="flex-1 text-sm font-medium outline-none rounded-xl px-3 py-2.5"
          style={{ background: "#f4f4f8", color: NAVY }}
        />
        <button onClick={submitComment} className="px-4 py-2.5 rounded-xl text-xs font-extrabold active:scale-95 transition-transform flex-shrink-0" style={{ background: NAVY, color: "white" }}>
          등록
        </button>
      </div>
    </div>
  );
}
