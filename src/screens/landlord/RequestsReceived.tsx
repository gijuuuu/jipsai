import { useState } from "react";
import { NAVY, IVORY } from "../../theme";
import { NavHeader, Card, StatusBadge, Pagination } from "../../ui";
import { IconTool } from "../../icons";
import { useAppData } from "../../store";
import { getBuilding } from "../../data";
import type { LandlordNavigate, LandlordScreen } from "./types";

const PAGE_SIZE = 5;

export default function RequestsReceived({
  unitNumber,
  buildingId,
  backTo,
  navigate,
}: {
  unitNumber: string;
  buildingId: number;
  backTo: LandlordScreen;
  navigate: LandlordNavigate;
}) {
  const { complaints } = useAppData();
  const building = getBuilding(buildingId);
  const tenant = building.units.find((u) => u.number === unitNumber)?.tenantName ?? "-";
  const requests = complaints.filter((c) => c.unitNumber === unitNumber);
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(requests.length / PAGE_SIZE));
  const pageItems = requests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goBack = () => (backTo === "home" ? navigate("home") : navigate("building-detail", { buildingId }));

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader
        title={`${unitNumber}호 요청함`}
        onBack={goBack}
        rightEl={
          <button onClick={() => navigate("request-log", { unitNumber })} className="ml-auto text-xs font-extrabold px-3 py-1.5 rounded-full active:scale-95 flex-shrink-0" style={{ background: "rgba(255,255,255,0.15)", color: "#ffa319" }}>
            접수 내역
          </button>
        }
      />
      <div className="px-5 py-2.5" style={{ background: "#f3ede3" }}>
        <p className="text-xs" style={{ color: NAVY, opacity: 0.55 }}>
          {building.name} {unitNumber}호 · {tenant} · 하자신청 {requests.length}건
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
          pageItems.map((req) => {
            const accepted = req.status !== "접수됨";
            return (
              <button
                key={req.id}
                onClick={() => navigate(accepted ? "request-log-detail" : "meeting-scheduler", { unitNumber, buildingId, complaintId: req.id })}
                className="w-full text-left active:scale-[0.98] transition-transform"
              >
                <Card className="overflow-hidden">
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
                  <div className="mx-4 mb-4 h-24 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: "#f5f2ee" }}>
                    {req.photos.length > 0 ? (
                      <img src={req.photos[0]} alt="첨부 사진" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center" style={{ color: NAVY, opacity: 0.3 }}>
                        <IconTool size={22} />
                        <p className="text-[10px] mt-1">첨부 이미지 없음</p>
                      </div>
                    )}
                  </div>
                  <div className="px-4 pb-4">
                    <div
                      className="w-full py-3 rounded-xl text-sm font-extrabold text-center"
                      style={{ background: accepted ? "#ede8df" : NAVY, color: accepted ? "#a8a29a" : "#fff" }}
                    >
                      {accepted ? "접수 완료 — 눌러서 일정 확인" : "눌러서 접수 일정 확인하기"}
                    </div>
                  </div>
                </Card>
              </button>
            );
          })
        )}
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
