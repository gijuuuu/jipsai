import { useState } from "react";
import { NAVY, ORANGE, IVORY } from "../../theme";
import { NavHeader, Card, StatusBadge } from "../../ui";
import { useAppData } from "../../store";
import type { LandlordNavigate } from "./types";

export default function RequestLogDetail({
  unitNumber,
  buildingId,
  complaintId,
  navigate,
}: {
  unitNumber: string;
  buildingId: number;
  complaintId: number;
  navigate: LandlordNavigate;
}) {
  const { complaints, updateComplaintStatus } = useAppData();
  const req = complaints.find((c) => c.id === complaintId);
  const [updating, setUpdating] = useState(false);

  const advanceToProcessing = async () => {
    if (updating) return;
    setUpdating(true);
    try {
      await updateComplaintStatus(complaintId, "처리중", req?.memo ?? undefined, "landlord");
    } catch (err) {
      alert(err instanceof Error ? err.message : "처리에 실패했습니다.");
    } finally {
      setUpdating(false);
    }
  };

  if (!req) {
    return (
      <div className="flex flex-col h-full" style={{ background: IVORY }}>
        <NavHeader title="접수 내역" onBack={() => navigate("request-log", { unitNumber, buildingId })} />
        <div className="flex-1 flex items-center justify-center">
          <span className="text-sm font-medium" style={{ color: NAVY, opacity: 0.4 }}>
            해당 요청을 찾을 수 없습니다.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title={`${req.category} > ${req.subcategory}`} onBack={() => navigate("request-log", { unitNumber, buildingId })} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        <Card className="px-4 py-3 flex items-center justify-between">
          <p className="text-sm font-bold" style={{ color: NAVY }}>
            접수일: {req.createdAt}
          </p>
          <StatusBadge status={req.status} />
        </Card>

        <Card className="p-4">
          <p className="text-xs font-extrabold mb-2 opacity-55" style={{ color: NAVY }}>
            신청 내용
          </p>
          <p className="text-sm leading-relaxed" style={{ color: NAVY }}>
            {req.description}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-extrabold mb-3 opacity-55" style={{ color: NAVY }}>
            첨부 사진
          </p>
          <div className="flex gap-2">
            {[0, 1].map((i) => (
              <div key={i} className="w-24 h-24 rounded-xl flex items-center justify-center" style={{ background: "#eef0fa" }}>
                <span className="text-2xl">🖼️</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-extrabold mb-3 opacity-55" style={{ color: NAVY }}>
            처리 현황
          </p>
          {req.timeline.map((t, i) => (
            <div key={i} className="flex items-center gap-3 mb-2 last:mb-0">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: i === req.timeline.length - 1 ? ORANGE : NAVY, opacity: i === req.timeline.length - 1 ? 1 : 0.25 }}
              />
              <span className="text-xs" style={{ color: NAVY, fontWeight: i === req.timeline.length - 1 ? 700 : 500, opacity: i === req.timeline.length - 1 ? 1 : 0.5 }}>
                {t}
              </span>
            </div>
          ))}
        </Card>

        {req.memo && (
          <Card className="p-4" style={{ background: "#f0f2fa" }}>
            <p className="text-sm font-extrabold mb-2" style={{ color: NAVY }}>
              🏠 집주인 답변
            </p>
            <p className="text-sm leading-relaxed" style={{ color: NAVY, opacity: 0.8 }}>
              {req.memo}
            </p>
          </Card>
        )}
      </div>
      {req.status === "확인중" && (
        <div className="px-4 pb-8 pt-3 bg-white" style={{ borderTop: "1px solid #e8e2d8" }}>
          <button
            onClick={advanceToProcessing}
            disabled={updating}
            className="w-full font-extrabold rounded-2xl py-4 text-sm active:scale-95 transition-transform"
            style={{ background: NAVY, color: "#fff", opacity: updating ? 0.6 : 1 }}
          >
            {updating ? "변경 중..." : "처리중으로 상태 변경"}
          </button>
        </div>
      )}
      {req.status === "처리중" && (
        <div className="px-4 pb-8 pt-3 bg-white" style={{ borderTop: "1px solid #e8e2d8" }}>
          <div className="rounded-xl py-3.5 text-center" style={{ background: "#fff0d4" }}>
            <p className="text-sm font-bold" style={{ color: "#8a6a30" }}>세입자의 처리 완료 확인을 기다리는 중입니다</p>
          </div>
        </div>
      )}
      {req.status === "완료" && (
        <div className="px-4 pb-8 pt-3 bg-white" style={{ borderTop: "1px solid #e8e2d8" }}>
          <div className="rounded-xl py-3.5 text-center" style={{ background: "#e8f8ee" }}>
            <p className="text-sm font-bold" style={{ color: "#1f9e52" }}>처리 완료 ✓</p>
          </div>
        </div>
      )}
    </div>
  );
}
