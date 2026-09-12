import { useState } from "react";
import { NAVY, ORANGE, IVORY } from "../../theme";
import { NavHeader, HouseIllustration } from "../../ui";
import { IconBuilding, IconMegaphone, IconReceipt, IconChat, IconChevronRight, IconArrowLeft } from "../../icons";
import { useAppData } from "../../store";
import { BUILDING, LANDLORD, findBuildingByUnit } from "../../data";
import type { LandlordNavigate } from "./types";

const NOTICE_COLLAPSED_COUNT = 5;

export default function LandlordHome({ navigate, onExit }: { navigate: LandlordNavigate; onExit: () => void }) {
  const { complaints, fees } = useAppData();
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  const septFees = fees.filter((f) => f.yearMonth === "2026-09");
  const unpaidCount = septFees.filter((f) => f.status !== "paid").length;
  const pendingComplaints = complaints.filter((c) => c.status !== "완료").length;
  // 아직 확인하지 않은(=방금 접수된) 하자신청 — 홈 화면 알림으로 노출
  const newComplaints = complaints.filter((c) => c.status === "접수됨");
  const visibleNotifications = showAllNotifications ? newComplaints : newComplaints.slice(0, NOTICE_COLLAPSED_COUNT);

  const menus = [
    { icon: <IconMegaphone size={28} />, label: "공지 관리", sub: "세입자 전체에게 공지 작성", s: "notice-building-select" as const },
    { icon: <IconBuilding size={28} />, label: "내 건물 관리", sub: "호실별 현황 확인", s: "building-list" as const },
    { icon: <IconReceipt size={28} />, label: "청구 · 정산", sub: "납입 현황 및 정산 요약", s: "settlement" as const },
    { icon: <IconChat size={28} />, label: "게시판 보기", sub: "공지 · 자유 게시판", s: "notice-building-select" as const },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto relative" style={{ background: IVORY }}>
      {/* Hero */}
      <div className="relative flex-shrink-0" style={{ background: "linear-gradient(160deg,#f5efe6 55%,#e8e0d4 100%)", paddingTop: 36 }}>
        <button
          onClick={onExit}
          className="absolute left-4 top-4 flex items-center justify-center rounded-xl active:scale-95 transition-transform z-10"
          style={{ width: 36, height: 36, background: "rgba(255,255,255,0.6)" }}
          aria-label="역할 선택으로"
        >
          <IconArrowLeft color={NAVY} size={20} />
        </button>
        <div style={{ height: 120 }}>
          <HouseIllustration />
        </div>
        <div className="px-5 pt-2 pb-1">
          <div className="text-xs font-medium" style={{ color: NAVY, opacity: 0.6 }}>
            안녕하세요
          </div>
          <div className="text-xl font-black" style={{ color: NAVY }}>
            {LANDLORD.name} 님 👋
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 pt-4 pb-8">
        {/* 새 불편사항 알림 */}
        {newComplaints.length > 0 && (
          <div className="rounded-2xl overflow-hidden border-2" style={{ borderColor: ORANGE }}>
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#fff0d4" }}>
              <span style={{ fontSize: 15 }}>🔔</span>
              <span className="text-xs font-extrabold" style={{ color: "#8a6a30" }}>
                새 불편사항 접수 {newComplaints.length}건
              </span>
            </div>
            <div className="bg-white divide-y" style={{ borderColor: "#f0ebe3" }}>
              {visibleNotifications.map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigate("requests-received", { unitNumber: c.unitNumber, buildingId: findBuildingByUnit(c.unitNumber).id, backTo: "home" })}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-left active:scale-[0.98] transition-transform"
                >
                  <span style={{ fontSize: 18 }}>{c.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: NAVY }}>
                      {c.unitNumber}호 {c.tenantName} · {c.category} &gt; {c.subcategory}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: NAVY, opacity: 0.4 }}>
                      {c.createdAt}
                    </p>
                  </div>
                  <IconChevronRight />
                </button>
              ))}
            </div>
            {newComplaints.length > NOTICE_COLLAPSED_COUNT && (
              <button
                onClick={() => setShowAllNotifications((v) => !v)}
                className="w-full text-center py-2.5 text-xs font-extrabold active:opacity-70"
                style={{ background: "#fdf6e8", color: "#8a6a30" }}
              >
                {showAllNotifications ? "접기 ▲" : `더보기 (${newComplaints.length - NOTICE_COLLAPSED_COUNT}건 더) ▼`}
              </button>
            )}
          </div>
        )}

        {/* Stat row */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { l: "관리 세대", v: `${BUILDING.units.length}세대` },
            { l: "미납", v: `${unpaidCount}건`, danger: unpaidCount > 0 },
            { l: "처리 대기", v: `${pendingComplaints}건`, danger: pendingComplaints > 0 },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border-2 bg-white py-3 text-center" style={{ borderColor: NAVY }}>
              <div className="text-xs font-medium" style={{ color: NAVY, opacity: 0.5 }}>
                {s.l}
              </div>
              <div className="font-black text-base mt-0.5" style={{ color: s.danger ? "#d04a0a" : NAVY }}>
                {s.v}
              </div>
            </div>
          ))}
        </div>

        {/* Menu list */}
        <div className="flex flex-col gap-2.5">
          {menus.map((m) => (
            <button
              key={m.label}
              onClick={() => navigate(m.s)}
              className="w-full flex items-center gap-4 rounded-2xl border-2 bg-white p-4 active:scale-[0.98] transition-transform text-left"
              style={{ borderColor: NAVY }}
            >
              <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#eef0fa", width: 48, height: 48 }}>
                {m.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-extrabold" style={{ color: NAVY }}>
                  {m.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: NAVY, opacity: 0.45 }}>
                  {m.sub}
                </p>
              </div>
              <IconChevronRight />
            </button>
          ))}
        </div>

        {pendingComplaints > 0 && (
          <button onClick={() => navigate("building-list")} className="w-full rounded-2xl p-4 text-left active:scale-[0.98] transition-transform" style={{ background: "#fff0d4", border: `2px solid ${ORANGE}` }}>
            <div className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">🔔</span>
              <div>
                <p className="text-sm font-extrabold" style={{ color: NAVY }}>
                  세입자 요청 {pendingComplaints}건 처리 대기 중
                </p>
                <p className="text-xs mt-0.5" style={{ color: NAVY, opacity: 0.6 }}>
                  건물 관리에서 호실별 하자신청을 확인하세요
                </p>
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
