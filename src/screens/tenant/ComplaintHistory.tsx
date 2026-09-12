import { useState } from "react";
import { NAVY, IVORY } from "../../theme";
import { NavHeader, StatusBadge, Pagination } from "../../ui";
import { useAppData } from "../../store";
import { CURRENT_TENANT } from "../../data";
import type { TenantNavigate } from "./types";

const PAGE_SIZE = 5;

export default function ComplaintHistoryScreen({ navigate }: { navigate: TenantNavigate }) {
  const { complaints } = useAppData();
  const mine = complaints.filter((c) => c.unitNumber === CURRENT_TENANT.unitNumber);
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(mine.length / PAGE_SIZE));
  const pageItems = mine.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title="접수 내역" onBack={() => navigate("home")} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {mine.length === 0 && (
          <p className="text-sm font-medium text-center mt-10" style={{ color: NAVY, opacity: 0.4 }}>
            접수한 불편사항이 없습니다.
          </p>
        )}
        {pageItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate("complaint-history-detail", { itemId: item.id })}
            className="w-full text-left rounded-2xl border-2 bg-white overflow-hidden active:scale-[0.98] transition-transform"
            style={{ borderColor: NAVY }}
          >
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span style={{ fontSize: 22 }}>{item.emoji}</span>
                  <div>
                    <div className="font-extrabold text-sm" style={{ color: NAVY }}>
                      {item.category} &gt; {item.subcategory}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: NAVY, opacity: 0.4 }}>
                      {item.createdAt}
                    </div>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>
            </div>
            <div className="mx-4 mb-4 rounded-xl px-3 py-2.5" style={{ background: item.memo ? "#f0f2fa" : "#fafafa", border: `1px solid ${item.memo ? "#d8dcf0" : "#eee"}` }}>
              {item.memo ? (
                <div className="flex gap-2 items-start">
                  <span className="text-xs font-extrabold flex-shrink-0 mt-0.5" style={{ color: NAVY }}>
                    🏠 집주인
                  </span>
                  <span className="text-xs font-medium leading-snug line-clamp-2" style={{ color: NAVY, opacity: 0.8 }}>
                    {item.memo}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-medium" style={{ color: NAVY, opacity: 0.35 }}>
                  💬 답변 대기중
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
