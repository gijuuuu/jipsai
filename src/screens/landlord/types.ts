export type LandlordScreen =
  | "home"
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
}

export type LandlordNavigate = (screen: LandlordScreen, extra?: LandlordNavExtra) => void;
