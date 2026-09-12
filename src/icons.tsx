import { NAVY, ORANGE } from "./theme";

// ─── 친구 파일에서 가져온 기존 아이콘 ─────────────────────────────────────────
export function IconPlane({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M4 16L28 4L20 28L14 18L4 16Z" stroke={NAVY} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M14 18L20 12" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
export function IconChat({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M6 8C6 6.9 6.9 6 8 6H24C25.1 6 26 6.9 26 8V19C26 20.1 25.1 21 24 21H19L14 26V21H8C6.9 21 6 20.1 6 19V8Z" stroke={NAVY} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="11.5" cy="14.5" r="1.5" fill={NAVY} />
      <circle cx="16" cy="14.5" r="1.5" fill={NAVY} />
      <circle cx="20.5" cy="14.5" r="1.5" fill={NAVY} />
    </svg>
  );
}
export function IconDoc({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="6" y="4" width="20" height="24" rx="3" stroke={NAVY} strokeWidth="1.8" />
      <path d="M11 11H21M11 16H21M11 21H17" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
export function IconArrowLeft({ color = "white", size = 26 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <path d="M17 5L8 13L17 21" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function IconCamera({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M4 9C4 7.9 4.9 7 6 7H8L10 4H18L20 7H22C23.1 7 24 7.9 24 9V21C24 22.1 23.1 23 22 23H6C4.9 23 4 22.1 4 21V9Z" stroke={NAVY} strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="14" cy="15" r="4" stroke={NAVY} strokeWidth="1.7" />
    </svg>
  );
}
export function IconHeart({ filled = false, size = 20 }: { filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M10 17C10 17 3 12.5 3 7.5C3 5.5 4.7 4 6.8 4C8.1 4 9.2 4.7 10 5.7C10.8 4.7 11.9 4 13.2 4C15.3 4 17 5.5 17 7.5C17 12.5 10 17 10 17Z"
        stroke={filled ? ORANGE : NAVY}
        fill={filled ? ORANGE : "none"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function IconComment({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M4 5C4 4.4 4.4 4 5 4H15C15.6 4 16 4.4 16 5V12C16 12.6 15.6 13 15 13H11L8 16V13H5C4.4 13 4 12.6 4 12V5Z" stroke={NAVY} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
export function AvatarIcon({ label, size = 32 }: { label: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full flex-shrink-0 font-extrabold"
      style={{ width: size, height: size, background: "#eef0fa", color: NAVY, fontSize: size * 0.35, border: `1.5px solid ${NAVY}20` }}
    >
      {label}
    </div>
  );
}

// ─── 집주인 화면을 위해 같은 라인 스타일로 새로 그린 아이콘 ───────────────────
export function IconBuilding({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="7" y="6" width="18" height="22" rx="2" stroke={NAVY} strokeWidth="1.8" />
      <path d="M7 12H25M7 18H25" stroke={NAVY} strokeWidth="1.8" />
      <path d="M12 6V28M20 6V28" stroke={NAVY} strokeWidth="1.4" opacity="0.5" />
      <rect x="14" y="21" width="4" height="7" rx="0.5" fill={NAVY} opacity="0.7" />
    </svg>
  );
}
export function IconMegaphone({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M5 13L21 6V26L5 19V13Z" stroke={NAVY} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M5 13H3.5C2.7 13 2 13.9 2 15V17C2 18.1 2.7 19 3.5 19H5V13Z" stroke={NAVY} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 20L10.5 26.5C10.7 27.4 11.8 27.8 12.5 27.2C13.4 26.4 13.7 25.1 13.3 24L11.5 19" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function IconReceipt({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M8 4H24V27L20.5 25L17 27L13.5 25L10 27L6.5 25L8 27V4Z" stroke={NAVY} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 11H20M12 16H20M12 21H17" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
export function IconTool({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M20.6 8.4a2 2 0 0 0 0 2.9l2.1 2.1a2 2 0 0 0 2.9 0l3.9-3.9a7 7 0 0 1-9 9L11.7 27.3a3 3 0 0 1-4-4.5L17.5 12a7 7 0 0 1 9-9l-3.9 3.9z"
        stroke={NAVY}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function IconCheckCircle({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="12" stroke={NAVY} strokeWidth="1.8" />
      <path d="M11 16.5L14.5 20L21.5 12.5" stroke={ORANGE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function IconChevronRight({ size = 18, color = NAVY }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M7 4L12 9L7 14" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function IconPlus({ size = 18, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M9 3V15M3 9H15" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
