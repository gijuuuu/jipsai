import { NAVY, IVORY } from "../../theme";
import { NavHeader, Card, StatusBadge } from "../../ui";
import { IconTool } from "../../icons";
import { useAppData } from "../../store";
import { BUILDING } from "../../data";
import type { LandlordNavigate } from "./types";

export default function RequestsReceived({ unitNumber, navigate }: { unitNumber: string; navigate: LandlordNavigate }) {
  const { complaints } = useAppData();
  const tenant = BUILDING.units.find((u) => u.number === unitNumber)?.tenantName ?? "-";
  const requests = complaints.filter((c) => c.unitNumber === unitNumber);

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader
        title={`${unitNumber}호 요청함`}
        onBack={() => navigate("building-detail")}
        rightEl={
          <button onClick={() => navigate("request-log", { unitNumber })} className="ml-auto text-xs font-extrabold px-3 py-1.5 rounded-full active:scale-95 flex-shrink-0" style={{ background: "rgba(255,255,255,0.15)", color: "#ffa319" }}>
            접수 내역
          </button>
        }
      />
      <div className="px-5 py-2.5" style={{ background: "#f3ede3" }}>
        <p className="text-xs" style={{ color: NAVY, opacity: 0.55 }}>
          {tenant} · 하자신청 {requests.length}건
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <p className="text-sm font-bold" style={{ color: NAVY, opacity: 0.5 }}>
              접수된 요청이 없습니다
            </p>
          </div>
        ) : (
          requests.map((req) => {
            const accepted = req.status !== "접수됨";
            return (
              <Card key={req.id} className="overflow-hidden">
                <div className="px-4 py-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-extrabold" style={{ color: NAVY }}>
                      {req.category} &gt; {req.subcategory}
                    </p>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: NAVY, opacity: 0.65 }}>
                    {req.description}
                  </p>
                  <p className="text-xs mt-2" style={{ color: NAVY, opacity: 0.35 }}>
                    {req.createdAt}
                  </p>
                </div>
                <div className="mx-4 mb-4 h-24 rounded-xl flex items-center justify-center" style={{ background: "#f5f2ee" }}>
                  <div className="text-center" style={{ color: NAVY, opacity: 0.3 }}>
                    <IconTool size={22} />
                    <p className="text-[10px] mt-1">첨부 이미지</p>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <button
                    onClick={() => !accepted && navigate("meeting-scheduler", { unitNumber, complaintId: req.id })}
                    disabled={accepted}
                    className="w-full py-3 rounded-xl text-sm font-extrabold active:scale-95 transition-transform"
                    style={{ background: accepted ? "#ede8df" : NAVY, color: accepted ? "#a8a29a" : "#fff" }}
                  >
                    {accepted ? "접수 완료 — 일정 확정됨" : "접수하기"}
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
