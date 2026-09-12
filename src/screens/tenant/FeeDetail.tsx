import { useState } from "react";
import { NAVY, ORANGE, IVORY } from "../../theme";
import { NavHeader } from "../../ui";
import { useAppData } from "../../store";
import { CURRENT_TENANT, feeTotal } from "../../data";
import type { TenantNavigate } from "./types";

const FEE_BREAKDOWN = [
  { label: "일반관리비", amount: 15000 },
  { label: "청소비", amount: 8000 },
  { label: "수도료", amount: 12000 },
  { label: "전기료(공용)", amount: 6000 },
  { label: "승강기유지비", amount: 4000 },
];

export default function FeeDetailScreen({ navigate }: { navigate: TenantNavigate }) {
  const { fees } = useAppData();
  const myFees = fees.filter((f) => f.unitNumber === CURRENT_TENANT.unitNumber).sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
  const [idx, setIdx] = useState(myFees.length - 1);
  const fee = myFees[idx];
  const [y, m] = fee.yearMonth.split("-");

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title="관리비 및 월세" onBack={() => navigate("home")} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Month nav */}
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
            onClick={() => setIdx((i) => Math.min(myFees.length - 1, i + 1))}
            disabled={idx === myFees.length - 1}
            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all"
            style={{ background: NAVY, opacity: idx === myFees.length - 1 ? 0.25 : 1 }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M7 4L12 9L7 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Fee card */}
        <div className="rounded-2xl border-2 bg-white px-5 py-5" style={{ borderColor: NAVY }}>
          <div className="flex items-start justify-between mb-3">
            <span className="font-extrabold text-sm" style={{ color: NAVY }}>
              {y}년 {m}월 청구서
            </span>
            {fee.status === "paid" ? (
              <span className="text-xs font-extrabold px-3 py-1 rounded-full" style={{ background: "#e8f8ee", color: "#1f9e52" }}>
                완납
              </span>
            ) : fee.status === "overdue" ? (
              <span className="text-xs font-extrabold px-3 py-1 rounded-full" style={{ background: "#ffeae0", color: "#d04a0a" }}>
                연체
              </span>
            ) : (
              <span className="text-xs font-extrabold px-3 py-1 rounded-full" style={{ background: "#fff4e0", color: "#c97c00" }}>
                미납
              </span>
            )}
          </div>
          <div className="font-black mb-4" style={{ fontSize: 36, color: NAVY, letterSpacing: -1 }}>
            {feeTotal(fee).toLocaleString()}원
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl px-3 py-2.5" style={{ background: "#eef0fa" }}>
              <div className="text-xs font-medium mb-0.5 opacity-50" style={{ color: NAVY }}>
                월세
              </div>
              <div className="font-bold text-sm" style={{ color: NAVY }}>
                {fee.rent.toLocaleString()}원
              </div>
            </div>
            <div className="rounded-xl px-3 py-2.5" style={{ background: "#eef0fa" }}>
              <div className="text-xs font-medium mb-0.5 opacity-50" style={{ color: NAVY }}>
                관리비
              </div>
              <div className="font-bold text-sm" style={{ color: NAVY }}>
                {fee.managementFee.toLocaleString()}원
              </div>
            </div>
          </div>
          <div className="border-t pt-3 flex flex-col gap-2" style={{ borderColor: "#eee" }}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium opacity-55" style={{ color: NAVY }}>
                납부 기한
              </span>
              <span className="font-bold text-xs" style={{ color: NAVY }}>
                {fee.dueDate}
              </span>
            </div>
            {fee.status === "paid" ? (
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium opacity-55" style={{ color: NAVY }}>
                  납부 완료일
                </span>
                <span className="font-bold text-xs" style={{ color: "#1f9e52" }}>
                  {fee.paidDate}
                </span>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium opacity-55" style={{ color: NAVY }}>
                  {fee.status === "overdue" ? "연체 기간" : "납부까지"}
                </span>
                <span className="font-bold text-base" style={{ color: fee.status === "overdue" ? "#d04a0a" : NAVY }}>
                  {fee.status === "overdue" ? "기한 초과" : `D-13`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Breakdown */}
        <div className="rounded-2xl border-2 bg-white px-4 py-4" style={{ borderColor: NAVY }}>
          <div className="text-xs font-extrabold mb-3 opacity-55" style={{ color: NAVY }}>
            관리비 상세
          </div>
          {FEE_BREAKDOWN.map((r) => (
            <div key={r.label} className="flex justify-between py-2 border-b last:border-b-0" style={{ borderColor: "#f2f2f2" }}>
              <span className="text-sm font-medium opacity-70" style={{ color: NAVY }}>
                {r.label}
              </span>
              <span className="text-sm font-bold" style={{ color: NAVY }}>
                {r.amount.toLocaleString()}원
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
