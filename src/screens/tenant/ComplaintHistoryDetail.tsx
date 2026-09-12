import { useState } from "react";
import { NAVY, ORANGE, IVORY } from "../../theme";
import { NavHeader, StatusBadge } from "../../ui";
import { useAppData } from "../../store";
import type { TenantNavigate } from "./types";

export default function ComplaintHistoryDetailScreen({ itemId, navigate }: { itemId: number; navigate: TenantNavigate }) {
  const { complaints, updateComplaintStatus } = useAppData();
  const item = complaints.find((c) => c.id === itemId);
  const [resolving, setResolving] = useState(false);
  const [justResolved, setJustResolved] = useState(false);

  if (!item) {
    return (
      <div className="flex flex-col h-full" style={{ background: IVORY }}>
        <NavHeader title="접수 내역" onBack={() => navigate("complaint-history")} />
        <div className="flex-1 flex items-center justify-center">
          <span className="text-sm font-medium" style={{ color: NAVY, opacity: 0.4 }}>
            해당 접수 내역을 찾을 수 없습니다.
          </span>
        </div>
      </div>
    );
  }

  const canResolve = item.status === "확인중" || item.status === "처리중";

  const handleResolve = async () => {
    if (resolving) return;
    setResolving(true);
    try {
      await updateComplaintStatus(item.id, "완료", undefined, "tenant");
      setJustResolved(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "처리에 실패했습니다.");
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title={`${item.category} > ${item.subcategory}`} subtitle="접수 내역 상세" onBack={() => navigate("complaint-history")} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white border-2" style={{ borderColor: NAVY }}>
          <span className="font-bold text-sm" style={{ color: NAVY }}>
            접수일: {item.createdAt}
          </span>
          <StatusBadge status={item.status} />
        </div>
        <div className="rounded-2xl border-2 bg-white px-4 py-4" style={{ borderColor: NAVY }}>
          <div className="text-xs font-extrabold mb-2 opacity-55" style={{ color: NAVY }}>
            신청 내용
          </div>
          <p className="text-sm font-medium leading-relaxed" style={{ color: NAVY }}>
            {item.description}
          </p>
        </div>
        <div className="rounded-2xl border-2 bg-white px-4 py-4" style={{ borderColor: NAVY }}>
          <div className="text-xs font-extrabold mb-2 opacity-55" style={{ color: NAVY }}>
            첨부 사진
          </div>
          <div className="flex gap-2">
            {[1, 2].map((n) => (
              <div key={n} className="w-20 h-20 rounded-xl flex items-center justify-center" style={{ background: "#eef0fa", border: `1.5px solid ${NAVY}25` }}>
                <span style={{ fontSize: 28 }}>🖼️</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border-2 bg-white px-4 py-4" style={{ borderColor: NAVY }}>
          <div className="text-xs font-extrabold mb-3 opacity-55" style={{ color: NAVY }}>
            처리 현황
          </div>
          {item.timeline.map((t, i) => (
            <div key={i} className="flex items-center gap-3 mb-2 last:mb-0">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: i === item.timeline.length - 1 ? ORANGE : NAVY, opacity: i === item.timeline.length - 1 ? 1 : 0.25 }}
              />
              <span className="text-xs" style={{ color: NAVY, fontWeight: i === item.timeline.length - 1 ? 700 : 500, opacity: i === item.timeline.length - 1 ? 1 : 0.5 }}>
                {t}
              </span>
            </div>
          ))}
        </div>
        {item.memo ? (
          <div className="rounded-2xl border-2 px-4 py-4" style={{ borderColor: NAVY, background: "#f0f2fa" }}>
            <div className="text-xs font-extrabold mb-2 opacity-55" style={{ color: NAVY }}>
              🏠 집주인 답변
            </div>
            <p className="text-sm font-medium leading-relaxed" style={{ color: NAVY }}>
              {item.memo}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border-2 px-4 py-4 flex items-center justify-center" style={{ borderColor: "#ddd", background: "#fafafa" }}>
            <span className="text-sm font-medium" style={{ color: NAVY, opacity: 0.35 }}>
              💬 아직 답변이 없습니다.
            </span>
          </div>
        )}
      </div>
      {(canResolve || justResolved) && (
        <div className="px-4 pb-8 pt-3 bg-white" style={{ borderTop: "1px solid #eee" }}>
          {item.status === "완료" || justResolved ? (
            <div className="rounded-xl py-3.5 text-center" style={{ background: "#e8f8ee" }}>
              <p className="text-sm font-bold" style={{ color: "#1f9e52" }}>처리 완료 처리되었습니다 ✓</p>
            </div>
          ) : (
            <button
              onClick={handleResolve}
              disabled={resolving}
              className="w-full font-extrabold rounded-2xl py-4 text-sm active:scale-95 transition-transform"
              style={{ background: NAVY, color: "#fff", opacity: resolving ? 0.6 : 1 }}
            >
              {resolving ? "처리 중..." : "처리 완료로 확인하기"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
