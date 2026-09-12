import { NAVY, IVORY } from "../../theme";
import { NavHeader, PaidStatusBadge } from "../../ui";
import { IconReceipt, IconChat } from "../../icons";
import { useAppData } from "../../store";
import { getBuilding } from "../../data";
import type { LandlordNavigate } from "./types";

export default function BuildingDetail({ buildingId, navigate }: { buildingId: number; navigate: LandlordNavigate }) {
  const { complaints, fees } = useAppData();
  const building = getBuilding(buildingId);

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title={building.name} subtitle={building.address} onBack={() => navigate("building-list")} />
      <div className="flex items-center px-5 pt-3 pb-1">
        <div className="flex-1" />
        <div className="flex gap-2 pr-1">
          <span className="text-[10px] font-bold w-14 text-center" style={{ color: NAVY, opacity: 0.4 }}>
            청구서
          </span>
          <span className="text-[10px] font-bold w-14 text-center" style={{ color: NAVY, opacity: 0.4 }}>
            요청
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2.5">
        {building.units.map((u) => {
          const fee = fees.find((f) => f.unitNumber === u.number && f.yearMonth === "2026-09");
          const cnt = complaints.filter((c) => c.unitNumber === u.number && c.status !== "완료").length;
          return (
            <div key={u.number} className="flex items-center rounded-2xl border-2 bg-white px-4 py-3" style={{ borderColor: NAVY }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold" style={{ color: NAVY }}>
                    {u.number}호
                  </span>
                  {fee && <PaidStatusBadge status={fee.status} />}
                </div>
                <p className="text-xs mt-0.5 truncate" style={{ color: NAVY, opacity: 0.5 }}>
                  {u.tenantName}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => navigate("invoice-detail", { unitNumber: u.number, buildingId, backTo: "building-detail" })}
                  className="flex items-center justify-center rounded-xl active:opacity-70"
                  style={{ background: "#eef0fa", width: 52, height: 36 }}
                >
                  <IconReceipt size={18} />
                </button>
                <div className="relative">
                  <button
                    onClick={() => navigate("requests-received", { unitNumber: u.number, buildingId, backTo: "building-detail" })}
                    className="flex items-center justify-center rounded-xl active:opacity-70"
                    style={{ background: cnt > 0 ? "#fff0d4" : "#eef0fa", width: 52, height: 36 }}
                  >
                    <IconChat size={18} />
                  </button>
                  {cnt > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 text-[10px] font-black rounded-full flex items-center justify-center"
                      style={{ background: "#ffa319", color: NAVY, minWidth: 16, height: 16, padding: "0 3px" }}
                    >
                      {cnt}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
