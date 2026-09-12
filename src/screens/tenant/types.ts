import type { Complaint, ComplaintCategory } from "../../data";

export type TenantScreen =
  | "home"
  | "complaint-history"
  | "complaint-history-detail"
  | "complaint-category"
  | "complaint-subcategory"
  | "complaint-form"
  | "community"
  | "community-write"
  | "community-detail"
  | "fee-detail";

export interface TenantNavExtra {
  category?: ComplaintCategory;
  subcategory?: string;
  item?: Complaint;
  postId?: number;
}

export type TenantNavigate = (screen: TenantScreen, extra?: TenantNavExtra) => void;
