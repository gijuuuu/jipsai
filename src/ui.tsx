import { useEffect } from "react";
import type { ReactNode, CSSProperties } from "react";
import { NAVY, ORANGE, IVORY, STATUS_COLORS, PAID_COLORS } from "./theme";
import { IconArrowLeft } from "./icons";

// ─── 공용 상단 네비게이션 (친구 파일의 NavHeader) ─────────────────────────────
export function NavHeader({
  title,
  subtitle,
  onBack,
  rightEl,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
  rightEl?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 px-3 flex-shrink-0" style={{ background: NAVY, minHeight: 60, paddingTop: 12, paddingBottom: 12 }}>
      <button
        onClick={onBack}
        className="flex items-center justify-center rounded-xl flex-shrink-0 active:scale-95 transition-transform"
        style={{ width: 44, height: 44, background: "rgba(255,255,255,0.15)" }}
      >
        <IconArrowLeft />
      </button>
      <div className="flex flex-col flex-1 min-w-0">
        {subtitle && <span className="text-xs font-medium opacity-55 text-white leading-tight">{subtitle}</span>}
        <span className="font-extrabold text-base text-white leading-tight truncate">{title}</span>
      </div>
      {rightEl}
    </div>
  );
}

// ─── 하단 시트 (친구 파일의 BottomSheet를 범용으로) ──────────────────────────
export function BottomSheet({ onClose, title, children }: { onClose: () => void; title: string; children: ReactNode }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(0,0,0,0.45)" }} onClick={onClose}>
      <div className="slide-up rounded-t-3xl px-5 pt-4 pb-8 flex flex-col gap-3 bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full mx-auto mb-2" style={{ background: "#ddd" }} />
        <div className="font-extrabold text-lg mb-1" style={{ color: NAVY }}>
          {title}
        </div>
        {children}
      </div>
    </div>
  );
}

export function SheetButton({
  children,
  onClick,
  variant = "solid",
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: "solid" | "outline";
}) {
  if (variant === "outline") {
    return (
      <button
        onClick={onClick}
        className="w-full py-4 rounded-2xl font-bold text-base border-2 active:scale-95 transition-transform bg-white"
        style={{ borderColor: NAVY, color: NAVY }}
      >
        {children}
      </button>
    );
  }
  return (
    <button onClick={onClick} className="w-full py-4 rounded-2xl font-extrabold text-base active:scale-95 transition-transform" style={{ background: ORANGE, color: NAVY }}>
      {children}
    </button>
  );
}

// ─── 하자신청 처리 상태 배지 (접수됨/확인중/처리중/완료) ─────────────────────
export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] ?? { bg: "#eee", color: "#555" };
  return (
    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

// ─── 납부 상태 배지 (완납/예정/연체) — 세입자·집주인 화면 공용 ───────────────
export function PaidStatusBadge({ status }: { status: "paid" | "scheduled" | "overdue" }) {
  const s = PAID_COLORS[status];
  return (
    <span className="text-xs font-extrabold px-3 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

// ─── 집 일러스트 (시작 화면·세입자 홈에서 공용으로 사용) ─────────────────────
export function HouseIllustration() {
  return (
    <svg viewBox="0 0 210 158" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="105" cy="148" rx="72" ry="9" fill="#c5b9aa" opacity="0.35" />
      <rect x="36" y="74" width="112" height="70" rx="4" fill="#f5f0e8" />
      <path d="M148 74 L170 62 L170 136 L148 144 Z" fill="#e2d9cc" />
      <path d="M26 78 L105 31 L184 66 L148 74 L105 55 L36 74 Z" fill="#c0392b" />
      <path d="M148 74 L184 66 L170 62 L148 70 Z" fill="#a93226" />
      <path d="M26 78 L105 31 L105 55 L36 74 Z" fill="#d44f43" />
      <rect x="122" y="37" width="11" height="25" rx="2" fill="#b5863a" />
      <rect x="119" y="34" width="17" height="6" rx="2" fill="#cca04e" />
      <rect x="50" y="86" width="25" height="22" rx="3" fill="#a8d8ea" stroke={NAVY} strokeWidth="1.2" />
      <line x1="62" y1="86" x2="62" y2="108" stroke={NAVY} strokeWidth="0.9" />
      <line x1="50" y1="97" x2="75" y2="97" stroke={NAVY} strokeWidth="0.9" />
      <rect x="103" y="86" width="25" height="22" rx="3" fill="#a8d8ea" stroke={NAVY} strokeWidth="1.2" />
      <line x1="115" y1="86" x2="115" y2="108" stroke={NAVY} strokeWidth="0.9" />
      <line x1="103" y1="97" x2="128" y2="97" stroke={NAVY} strokeWidth="0.9" />
      <rect x="156" y="81" width="11" height="16" rx="2" fill="#a8d8ea" stroke={NAVY} strokeWidth="1" opacity="0.8" />
      <rect x="78" y="106" width="28" height="38" rx="3" fill="#b5863a" />
      <rect x="82" y="110" width="9" height="16" rx="1.5" fill="#cca04e" />
      <rect x="93" y="110" width="9" height="16" rx="1.5" fill="#cca04e" />
      <circle cx="91" cy="126" r="1.7" fill={NAVY} />
      <rect x="72" y="142" width="40" height="4" rx="2" fill="#d4c9b8" />
      <path d="M84 144 L76 158 L132 158 L124 144 Z" fill="#ddd0be" />
      <ellipse cx="15" cy="108" rx="11" ry="15" fill="#5a9a5a" />
      <rect x="13" y="122" width="4" height="13" rx="1" fill="#7a5c3a" />
      <ellipse cx="197" cy="111" rx="10" ry="13" fill="#4a8a4a" />
      <rect x="195" y="123" width="4" height="11" rx="1" fill="#7a5c3a" />
    </svg>
  );
}

// ─── 카드형 컨테이너 (모든 화면에서 반복되는 navy 2px 보더 카드) ─────────────
export function Card({ children, className = "", onClick, style }: { children: ReactNode; className?: string; onClick?: () => void; style?: CSSProperties }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border-2 bg-white ${onClick ? "active:scale-[0.98] transition-transform cursor-pointer text-left w-full" : ""} ${className}`}
      style={{ borderColor: NAVY, ...style }}
    >
      {children}
    </div>
  );
}

// ─── 성공 토스트 ("불편사항이 접수되었습니다." 등) ────────────────────────
// 잠깐 떴다가 일정 시간 후 자동으로 사라지고, X를 누르면 바로 사라집니다.
export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2200);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="absolute left-4 right-4 z-50" style={{ top: 16 }}>
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3.5 toast-drop"
        style={{ background: NAVY, boxShadow: "0 12px 30px rgba(53,62,108,0.35)" }}
      >
        <span className="flex-1 text-sm font-bold text-white leading-snug">{message}</span>
        <button
          onClick={onClose}
          aria-label="닫기"
          className="flex items-center justify-center rounded-full flex-shrink-0 active:scale-90 transition-transform"
          style={{ width: 22, height: 22, background: "rgba(255,255,255,0.18)", color: "white", fontSize: 12, fontWeight: 800 }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// ─── 페이지네이션 (목록이 길어질 때 화살표로 페이지 넘기기) ────────────────
export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-4 pt-1 pb-2 flex-shrink-0">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="이전 페이지"
        className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-all"
        style={{ background: NAVY, opacity: page <= 1 ? 0.25 : 1 }}
      >
        <svg width="16" height="16" viewBox="0 0 18 18">
          <path d="M11 4L6 9L11 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>
      <span className="text-xs font-bold" style={{ color: NAVY, opacity: 0.6 }}>
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="다음 페이지"
        className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-all"
        style={{ background: NAVY, opacity: page >= totalPages ? 0.25 : 1 }}
      >
        <svg width="16" height="16" viewBox="0 0 18 18">
          <path d="M7 4L12 9L7 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

// ─── 폰 프레임 (앱 전체를 감싸는 셸 — 시작/세입자/집주인 화면 모두 공용) ─────
export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center py-8" style={{ background: "#d0ccc6" }}>
      <div
        className="relative flex flex-col overflow-hidden"
        style={{ width: 375, height: 812, background: IVORY, borderRadius: 44, boxShadow: "0 40px 100px rgba(53,62,108,0.28), 0 2px 12px rgba(53,62,108,0.12)" }}
      >
        {children}
      </div>
    </div>
  );
}
