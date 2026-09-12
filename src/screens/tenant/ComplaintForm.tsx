import { useState } from "react";
import { NAVY, ORANGE, IVORY } from "../../theme";
import { NavHeader, Toast } from "../../ui";
import { IconCamera } from "../../icons";
import { useAppData } from "../../store";
import { CATEGORIES, CURRENT_TENANT, type ComplaintCategory } from "../../data";
import type { TenantNavigate } from "./types";

export default function ComplaintFormScreen({ category, subcategory, navigate }: { category: ComplaintCategory; subcategory: string; navigate: TenantNavigate }) {
  const { addComplaint } = useAppData();
  const [content, setContent] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const yr = 2026,
    mo = 8; // 2026년 9월 (0-indexed)
  const firstDay = new Date(yr, mo, 1).getDay();
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  const toggle = (d: number) => setSelected((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d].sort((a, b) => a - b)));

  const emoji = CATEGORIES.find((c) => c.label === category)?.emoji ?? "📝";

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await addComplaint({
        unitNumber: CURRENT_TENANT.unitNumber,
        tenantName: CURRENT_TENANT.name,
        category,
        subcategory,
        emoji,
        description: content.trim() || "(상세 내용 없음)",
        visitDays: selected,
      });
      setShowToast(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "접수에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative" style={{ background: IVORY }}>
      {showToast && <Toast message="불편사항이 접수되었습니다." onClose={() => navigate("home")} />}
      <NavHeader title="불편 사항 접수" subtitle={`${category} > ${subcategory}`} onBack={() => navigate("complaint-subcategory", { category })} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Content */}
        <div className="rounded-2xl overflow-hidden border-2" style={{ borderColor: NAVY }}>
          <div className="px-4 pt-3 pb-2" style={{ background: NAVY }}>
            <span className="text-xs font-extrabold text-white opacity-70">하자 내용</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="하자 내용을 구체적으로 작성해주세요."
            rows={4}
            className="w-full px-4 pt-3 pb-4 text-sm font-medium resize-none outline-none bg-white"
            style={{ color: NAVY }}
          />
        </div>
        {/* Photo */}
        <div className="rounded-2xl border-2 bg-white px-4 py-4" style={{ borderColor: NAVY }}>
          <div className="text-xs font-extrabold mb-3 opacity-60" style={{ color: NAVY }}>
            사진 첨부
          </div>
          <div className="flex gap-3">
            <button
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed active:scale-95 transition-transform"
              style={{ width: 72, height: 72, borderColor: NAVY, opacity: 0.5 }}
            >
              <IconCamera size={26} />
              <span style={{ fontSize: 10, fontWeight: 600, color: NAVY }}>사진 추가</span>
            </button>
            <button className="rounded-xl border-2 border-dashed flex items-center justify-center" style={{ width: 72, height: 72, borderColor: "#ddd", color: "#ccc", fontSize: 22 }}>
              ＋
            </button>
          </div>
        </div>
        {/* Calendar */}
        <div className="rounded-2xl border-2 bg-white px-4 py-4" style={{ borderColor: NAVY }}>
          <div className="text-xs font-extrabold mb-3 opacity-60" style={{ color: NAVY }}>
            가능한 방문 날짜 (복수 선택)
          </div>
          <div className="font-extrabold text-sm text-center mb-3" style={{ color: NAVY }}>
            2026년 9월
          </div>
          <div className="grid grid-cols-7 mb-1">
            {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
              <div key={d} className="text-center text-xs font-bold py-1" style={{ color: i === 0 ? "#e74c3c" : i === 6 ? "#2980b9" : NAVY, opacity: 0.5 }}>
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((d, i) => {
              const sel = d !== null && selected.includes(d);
              const past = d !== null && d < 12;
              return (
                <button
                  key={i}
                  disabled={d === null || past}
                  onClick={() => d && !past && toggle(d)}
                  className="aspect-square flex items-center justify-center rounded-full text-xs font-bold transition-all mx-auto active:scale-90"
                  style={{
                    width: 32,
                    height: 32,
                    background: sel ? ORANGE : "transparent",
                    color: sel ? NAVY : d === null ? "transparent" : past ? "#ccc" : NAVY,
                    fontWeight: sel ? 800 : 500,
                  }}
                >
                  {d ?? ""}
                </button>
              );
            })}
          </div>
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t" style={{ borderColor: "#eee" }}>
              {selected.map((d) => (
                <button key={d} onClick={() => toggle(d)} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold active:scale-95" style={{ background: ORANGE, color: NAVY }}>
                  9/{d} <span style={{ opacity: 0.6 }}>✕</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="px-4 py-4 flex-shrink-0 border-t" style={{ background: IVORY, borderColor: "#eee" }}>
        <button
          onClick={submit}
          disabled={submitting}
          className="w-full py-4 rounded-2xl font-extrabold text-base active:scale-95 transition-transform"
          style={{ background: ORANGE, color: NAVY, opacity: submitting ? 0.6 : 1 }}
        >
          {submitting ? "접수 중..." : "접수하기"}
        </button>
      </div>
    </div>
  );
}
