// ─── Shared design tokens ───────────────────────────────────────────────────
// 친구 디자인(세입자 화면)을 기준으로 통일한 컬러 팔레트입니다.
// 집주인 화면도 전부 이 값들을 사용해 두 역할의 톤을 맞춥니다.

export const NAVY = "#353e6c";
export const ORANGE = "#ffa319";
export const IVORY = "#faf8f4";
export const GREEN_BADGE = "#4db874";

// 상태 배지에 쓰는 보조 색상 (친구 파일의 StatusBadge 팔레트 기준)
export const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  접수됨: { bg: "#eef0fa", color: NAVY },
  확인중: { bg: "#fff4e0", color: "#c97c00" },
  처리중: { bg: "#e6f2ff", color: "#1a6dc7" },
  완료: { bg: "#e8f8ee", color: "#1f9e52" },
};

export const PAID_COLORS = {
  paid: { bg: "#e8f8ee", color: "#1f9e52", label: "완납" },
  scheduled: { bg: "#fff0d4", color: "#c97c00", label: "예정" },
  overdue: { bg: "#ffeae0", color: "#d04a0a", label: "연체" },
} as const;
