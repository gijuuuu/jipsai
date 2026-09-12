import { useState } from "react";
import { NAVY, IVORY } from "../../theme";
import { NavHeader, Card, PaidStatusBadge } from "../../ui";
import { useAppData } from "../../store";
import { BUILDING, feeTotal } from "../../data";
import type { LandlordNavigate } from "./types";

export default function InvoiceDetail({ unitNumber, navigate }: { unitNumber: string; navigate: LandlordNavigate }) {
  const { fees, markFeePaid } = useAppData();
  const [urged, setUrged] = useState(false);
  const [paying, setPaying] = useState(false);
  const unitFees = fees.filter((f) => f.unitNumber === unitNumber).sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
  const [idx, setIdx] = useState(unitFees.length - 1);
  const fee = unitFees[idx];
  const tenant = BUILDING.units.find((u) => u.number === unitNumber)?.tenantName ?? "-";
  const [y, m] = fee.yearMonth.split("-");

  const handlePay = async () => {
    if (paying) return;
    setPaying(true);
    try {
      await markFeePaid(unitNumber, fee.yearMonth);
    } catch (err) {
      alert(err instanceof Error ? err.message : "처리에 실패했습니다.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title="청구서 상세" onBack={() => navigate("building-detail")} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all"
            style={{ background: NAVY, opacity: idx === 0 ? 0.25 : 1 }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M11 4L6 9L11 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
          <span className="font-extrabold text-base" style={{ color: NAVY }}>
            {y}년 {m}월
          </span>
          <button
            onClick={() => setIdx((i) => Math.min(unitFees.length - 1, i + 1))}
            disabled={idx === unitFees.length - 1}
            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all"
            style={{ background: NAVY, opacity: idx === unitFees.length - 1 ? 0.25 : 1 }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M7 4L12 9L7 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <Card className="px-5 py-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs" style={{ color: NAVY, opacity: 0.5 }}>
                {BUILDING.name} · {unitNumber}호 · {tenant}
              </p>
              <p className="text-sm font-bold mt-0.5" style={{ color: NAVY }}>
                {y}년 {m}월 청구서
              </p>
            </div>
            <PaidStatusBadge status={fee.status} />
          </div>
          <p className="font-black mb-4" style={{ fontSize: 32, color: NAVY, letterSpacing: -1 }}>
            {feeTotal(fee).toLocaleString()}원
          </p>
          <div className="rounded-xl px-4 py-3 mb-4 inline-block" style={{ background: "#eef0fa" }}>
            <p className="text-xs" style={{ color: NAVY, opacity: 0.5 }}>
              월세 + 관리비
            </p>
            <p className="text-sm font-bold" style={{ color: NAVY }}>
              {fee.rent.toLocaleString()}원 + {fee.managementFee.toLocaleString()}원
            </p>
          </div>
          <div className="pt-3 flex flex-col gap-1.5" style={{ borderTop: "1px solid #f0ebe3" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: NAVY, opacity: 0.5 }}>
                납부 기한
              </span>
              <span className="text-sm font-medium" style={{ color: NAVY }}>
                {fee.dueDate}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: NAVY, opacity: 0.5 }}>
                상태
              </span>
              <span className="text-sm font-bold" style={{ color: fee.status === "paid" ? "#1f9e52" : fee.status === "overdue" ? "#d04a0a" : NAVY }}>
                {fee.status === "paid" ? `납부 완료 (${fee.paidDate})` : fee.status === "overdue" ? "기한 초과" : "납부 예정"}
              </span>
            </div>
          </div>
        </Card>

        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-2 px-1" style={{ color: NAVY, opacity: 0.4 }}>
            납부 이력
          </p>
          <div className="flex flex-col gap-2">
            {unitFees
              .filter((f) => f.yearMonth !== fee.yearMonth)
              .map((f) => (
                <div key={f.yearMonth} className="flex items-center rounded-xl border-2 bg-white px-4 py-3" style={{ borderColor: "#e8e2d8" }}>
                  <p className="flex-1 text-sm font-medium" style={{ color: NAVY }}>
                    {f.yearMonth.split("-")[1]}월 청구
                  </p>
                  {f.paidDate && (
                    <p className="text-xs mr-3" style={{ color: NAVY, opacity: 0.4 }}>
                      {f.paidDate}
                    </p>
                  )}
                  <PaidStatusBadge status={f.status} />
                </div>
              ))}
          </div>
        </div>
      </div>

      {fee.status !== "paid" && (
        <div className="px-4 pb-8 pt-3 bg-white flex flex-col gap-2" style={{ borderTop: "1px solid #e8e2d8" }}>
          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full font-extrabold rounded-2xl py-4 text-sm active:scale-95 transition-transform"
            style={{ background: NAVY, color: "#fff", opacity: paying ? 0.6 : 1 }}
          >
            {paying ? "처리 중..." : "납부 완료 처리"}
          </button>
          {urged ? (
            <div className="rounded-xl py-3.5 text-center" style={{ background: "#fff0d4" }}>
              <p className="text-sm font-bold" style={{ color: "#8a6a30" }}>독촉 알림이 발송되었습니다 ✓</p>
            </div>
          ) : (
            <button onClick={() => setUrged(true)} className="w-full font-extrabold rounded-2xl py-4 text-sm active:scale-95 transition-transform" style={{ background: "#ffa319", color: NAVY }}>
              납부 독촉하기
            </button>
          )}
        </div>
      )}
    </div>
  );
}
