import { NAVY, ORANGE, IVORY } from "../../theme";
import { NavHeader, Card, PaidStatusBadge } from "../../ui";
import { useAppData } from "../../store";
import { findBuildingByUnit, feeTotal } from "../../data";
import type { LandlordNavigate } from "./types";

export default function Settlement({ navigate }: { navigate: LandlordNavigate }) {
  const { fees } = useAppData();
  const septFees = fees.filter((f) => f.yearMonth === "2026-09");
  const paidTotal = septFees.filter((f) => f.status === "paid").reduce((s, f) => s + feeTotal(f), 0);
  const total = septFees.reduce((s, f) => s + feeTotal(f), 0);
  const pct = total > 0 ? Math.round((paidTotal / total) * 100) : 0;

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title="청구 · 정산" onBack={() => navigate("home")} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        <Card className="p-5">
          <p className="text-xs" style={{ color: NAVY, opacity: 0.5 }}>
            2026년 9월 정산 현황
          </p>
          <div className="flex items-end gap-2 mt-1 mb-4">
            <span className="font-black text-2xl" style={{ color: NAVY }}>
              {paidTotal.toLocaleString()}원
            </span>
            <span className="text-sm mb-0.5" style={{ color: NAVY, opacity: 0.45 }}>
              / {total.toLocaleString()}원
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#eef0fa" }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: ORANGE }} />
          </div>
          <p className="text-xs mt-2" style={{ color: NAVY, opacity: 0.5 }}>
            {pct}% 완납
          </p>
        </Card>

        <p className="text-xs font-bold tracking-widest uppercase px-1" style={{ color: NAVY, opacity: 0.4 }}>
          호실별 납입 현황
        </p>
        <div className="flex flex-col gap-2">
          {septFees.map((f) => {
            const building = findBuildingByUnit(f.unitNumber);
            const tenant = building.units.find((u) => u.number === f.unitNumber)?.tenantName ?? "-";
            return (
              <button
                key={f.unitNumber}
                onClick={() => navigate("invoice-detail", { unitNumber: f.unitNumber, buildingId: building.id, backTo: "settlement" })}
                className="w-full text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center rounded-2xl border-2 bg-white px-4 py-3" style={{ borderColor: "#e8e2d8" }}>
                  <div className="flex-1">
                    <p className="text-sm font-extrabold" style={{ color: NAVY }}>
                      {building.name} {f.unitNumber}호 · {tenant}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: NAVY, opacity: 0.5 }}>
                      {feeTotal(f).toLocaleString()}원
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {f.paidDate && (
                      <p className="text-xs" style={{ color: NAVY, opacity: 0.3 }}>
                        {f.paidDate}
                      </p>
                    )}
                    <PaidStatusBadge status={f.status} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
