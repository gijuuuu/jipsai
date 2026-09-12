import { NAVY, IVORY } from "../../theme";
import { NavHeader, Card, StatusBadge } from "../../ui";
import { useAppData } from "../../store";
import type { LandlordNavigate } from "./types";

export default function RequestLog({ unitNumber, buildingId, navigate }: { unitNumber: string; buildingId: number; navigate: LandlordNavigate }) {
  const { complaints } = useAppData();
  const processed = complaints.filter((c) => c.unitNumber === unitNumber && c.status !== "접수됨");

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title="접수 내역" onBack={() => navigate("requests-received", { unitNumber, buildingId })} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {processed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 text-center">
            <p className="text-sm font-bold" style={{ color: NAVY, opacity: 0.5 }}>
              아직 처리된 내역이 없습니다
            </p>
            <p className="text-xs mt-1" style={{ color: NAVY, opacity: 0.3 }}>
              요청을 접수하면 여기에 표시됩니다
            </p>
          </div>
        ) : (
          processed.map((req) => (
            <button key={req.id} onClick={() => navigate("request-log-detail", { unitNumber, buildingId, complaintId: req.id })} className="w-full text-left active:scale-[0.98] transition-transform">
              <Card className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl flex-shrink-0">{req.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-extrabold" style={{ color: NAVY }}>
                        {req.category} &gt; {req.subcategory}
                      </p>
                      <StatusBadge status={req.status} />
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: NAVY, opacity: 0.4 }}>
                      {req.createdAt}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl px-3 py-2.5" style={{ background: "#f5f2ee" }}>
                  <p className="text-xs mb-1 font-bold" style={{ color: NAVY }}>
                    🏠 집주인
                  </p>
                  <p className="text-xs" style={{ color: NAVY, opacity: 0.65 }}>
                    {req.memo}
                  </p>
                </div>
              </Card>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
