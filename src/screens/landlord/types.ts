export type LandlordScreen =
  | "home"
  | "notice-building-select"
  | "notice-manage"
  | "notice-write"
  | "building-list"
  | "building-detail"
  | "invoice-detail"
  | "requests-received"
  | "meeting-scheduler"
  | "request-log"
  | "request-log-detail"
  | "settlement";

export interface LandlordNavExtra {
  unitNumber?: string;
  complaintId?: number;
  buildingId?: number;
  // 이 화면에 어디서 들어왔는지 — 뒤로가기를 누르면 항상 정해진 화면(예: building-detail)이
  // 아니라 실제로 들어온 곳(예: 홈 알림, 청구·정산 목록)으로 돌아가기 위해 씁니다.
  backTo?: LandlordScreen;
}

export type LandlordNavigate = (screen: LandlordScreen, extra?: LandlordNavExtra) => void;
