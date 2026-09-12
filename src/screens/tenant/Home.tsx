import { useState } from "react";
import { NAVY, ORANGE, IVORY } from "../../theme";
import { IconPlane, IconChat, IconDoc, IconArrowLeft } from "../../icons";
import { HouseIllustration, BottomSheet, SheetButton } from "../../ui";
import { useAppData } from "../../store";
import { BUILDING, CURRENT_TENANT, feeTotal } from "../../data";
import type { TenantNavigate } from "./types";

export default function TenantHome({ navigate, onExit }: { navigate: TenantNavigate; onExit: () => void }) {
  const [sheet, setSheet] = useState(false);
  const { complaints, notices, freePosts, fees } = useAppData();

  const myComplaintsOpen = complaints.filter((c) => c.unitNumber === CURRENT_TENANT.unitNumber && c.status !== "완료").length;
  const myFee = fees.find((f) => f.unitNumber === CURRENT_TENANT.unitNumber && f.yearMonth === "2026-09");
  const latestNotice = notices[0];
  const latestPost = freePosts[0];

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
        <div style={{ height: 152 }}>
          <HouseIllustration />
        </div>
        <div className="absolute right-5" style={{ top: 44, textAlign: "right" }}>
          <div className="text-xs font-medium" style={{ color: NAVY, opacity: 0.6 }}>
            {BUILDING.address}
          </div>
          <div className="text-xl font-black" style={{ color: NAVY }}>
            {BUILDING.name}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pt-4 pb-8">
        {/* Fee Card */}
        {myFee && (
          <button onClick={() => navigate("fee-detail")} className="text-left rounded-2xl border-2 bg-white px-5 pt-4 pb-5 active:scale-[0.98] transition-transform" style={{ borderColor: NAVY }}>
            <div className="flex items-start justify-between mb-1">
              <span className="text-xs font-bold" style={{ color: NAVY }}>
                2026년 9월 청구서
              </span>
              <span
                className="text-xs font-extrabold px-3 py-1 rounded-full"
                style={
                  myFee.status === "paid"
                    ? { background: "#e8f8ee", color: "#1f9e52" }
                    : myFee.status === "overdue"
                      ? { background: "#ffeae0", color: "#d04a0a" }
                      : { background: "#fff4e0", color: "#c97c00" }
                }
              >
                {myFee.status === "paid" ? "납부 완료" : myFee.status === "overdue" ? "연체" : "납부 예정"}
              </span>
            </div>
            <div className="font-black mt-1" style={{ fontSize: 34, color: NAVY, letterSpacing: -1 }}>
              {feeTotal(myFee).toLocaleString()}원
            </div>
            <div className="flex gap-5 mt-2">
              <span className="text-xs font-medium" style={{ color: NAVY, opacity: 0.5 }}>
                월세 {myFee.rent.toLocaleString()}원
              </span>
              <span className="text-xs font-medium" style={{ color: NAVY, opacity: 0.5 }}>
                관리비 {myFee.managementFee.toLocaleString()}원
              </span>
            </div>
          </button>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3">
          <div className="relative">
            <button
              onClick={() => setSheet(true)}
              className="w-full flex flex-col items-center justify-center gap-3 rounded-2xl border-2 bg-white active:scale-95 transition-transform"
              style={{ borderColor: NAVY, paddingTop: 22, paddingBottom: 22 }}
            >
              <IconPlane size={32} />
              <span className="text-xs font-extrabold text-center leading-tight" style={{ color: NAVY }}>
                불편사항{"\n"}접수
              </span>
            </button>
            {myComplaintsOpen > 0 && (
              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black" style={{ background: ORANGE, color: NAVY }}>
                {myComplaintsOpen}
              </div>
            )}
          </div>
          <button
            onClick={() => navigate("community")}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 bg-white active:scale-95 transition-transform"
            style={{ borderColor: NAVY, paddingTop: 22, paddingBottom: 22 }}
          >
            <IconChat size={32} />
            <span className="text-xs font-extrabold text-center leading-tight whitespace-pre-line" style={{ color: NAVY }}>
              {"커뮤니티\n게시판"}
            </span>
          </button>
          <button
            onClick={() => navigate("fee-detail")}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 bg-white active:scale-95 transition-transform"
            style={{ borderColor: NAVY, paddingTop: 22, paddingBottom: 22 }}
          >
            <IconDoc size={32} />
            <span className="text-xs font-extrabold text-center leading-tight whitespace-pre-line" style={{ color: NAVY }}>
              {"관리비\n및 월세"}
            </span>
          </button>
        </div>

        {/* Board preview */}
        <div className="rounded-2xl overflow-hidden border-2" style={{ borderColor: NAVY }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ background: NAVY }}>
            <span className="font-extrabold text-base text-white">게시판</span>
            <button onClick={() => navigate("community")} className="text-xs font-bold" style={{ color: ORANGE }}>
              더보기 &gt;
            </button>
          </div>
          <div className="bg-white divide-y" style={{ borderColor: "#eee" }}>
            {latestNotice && (
              <div className="px-4 py-3 flex items-start gap-2">
                <span className="mt-0.5 text-xs font-extrabold px-2 py-0.5 rounded flex-shrink-0" style={{ background: "#fff0d4", color: ORANGE }}>
                  공지
                </span>
                <span className="text-sm font-medium leading-snug line-clamp-1" style={{ color: NAVY }}>
                  {latestNotice.title}
                </span>
              </div>
            )}
            {latestPost && (
              <div className="px-4 py-3 flex items-start gap-2">
                <span className="mt-0.5 text-xs font-extrabold px-2 py-0.5 rounded flex-shrink-0" style={{ background: "#eef0fa", color: NAVY }}>
                  자유
                </span>
                <span className="text-sm font-medium leading-snug line-clamp-1" style={{ color: NAVY }}>
                  {latestPost.author} {latestPost.title}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {sheet && (
        <BottomSheet onClose={() => setSheet(false)} title="불편사항 접수">
          <SheetButton onClick={() => { setSheet(false); navigate("complaint-category"); }}>✏️ &nbsp;새로 접수하기</SheetButton>
          <SheetButton variant="outline" onClick={() => { setSheet(false); navigate("complaint-history"); }}>📋 &nbsp;접수 내역 확인하기</SheetButton>
        </BottomSheet>
      )}
    </div>
  );
}
