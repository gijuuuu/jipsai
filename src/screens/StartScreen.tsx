import { NAVY, ORANGE } from "../theme";
import { HouseIllustration } from "../ui";
import { IconChevronRight } from "../icons";

export default function StartScreen({ onSelect }: { onSelect: (role: "landlord" | "tenant") => void }) {
  return (
    <div className="flex flex-col flex-1 h-full" style={{ background: "#f5f0e8" }}>
      {/* Illustration hero */}
      <div className="flex flex-col items-center justify-end pt-8 flex-shrink-0" style={{ background: "#f5f0e8", minHeight: 200 }}>
        <div style={{ width: 220, height: 165 }}>
          <HouseIllustration />
        </div>
      </div>

      {/* App name */}
      <div className="px-6 pt-5 pb-6 text-center flex-shrink-0" style={{ background: "#f5f0e8" }}>
        <h1 className="text-[26px] font-black tracking-tight" style={{ color: NAVY }}>
          집사이
        </h1>
        <p className="text-sm mt-1.5" style={{ color: NAVY, opacity: 0.45 }}>
          청구 · 독촉 · 유지보수를 감정 소모 없이
        </p>
      </div>

      <div style={{ height: 1, background: "#e8e2d8" }} />

      {/* Role selection */}
      <div className="flex-1 flex flex-col justify-center px-5 gap-3 py-7 bg-white">
        <p className="text-xs font-extrabold tracking-widest text-center mb-1" style={{ color: NAVY, opacity: 0.3 }}>
          역할을 선택하세요
        </p>

        <button onClick={() => onSelect("landlord")} className="flex items-center gap-4 rounded-2xl p-5 active:scale-[0.98] transition-transform text-left w-full" style={{ background: NAVY }}>
          <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: ORANGE, width: 52, height: 52 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-base text-white">집주인</p>
            <p className="text-xs mt-0.5" style={{ color: "#9fb0d8" }}>
              건물 관리 · 청구 · 공지
            </p>
          </div>
          <IconChevronRight color={ORANGE} />
        </button>

        <button onClick={() => onSelect("tenant")} className="flex items-center gap-4 rounded-2xl p-5 active:scale-[0.98] transition-transform text-left w-full bg-white" style={{ border: `1.5px solid #e8e2d8` }}>
          <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#f3ede3", width: 52, height: 52 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-base" style={{ color: NAVY }}>
              세입자
            </p>
            <p className="text-xs mt-0.5" style={{ color: NAVY, opacity: 0.45 }}>
              하자신청 · 게시판 · 관리비 확인
            </p>
          </div>
          <IconChevronRight color="#c5bfb5" />
        </button>
      </div>

      <div className="py-6 text-center bg-white flex-shrink-0">
        <p className="text-xs" style={{ color: NAVY, opacity: 0.25 }}>
          집사이 v1.0 · 2026
        </p>
      </div>
    </div>
  );
}
