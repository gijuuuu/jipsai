import { useState } from "react";
import TenantHome from "./Home";
import ComplaintHistoryScreen from "./ComplaintHistory";
import ComplaintHistoryDetailScreen from "./ComplaintHistoryDetail";
import ComplaintCategoryScreen from "./ComplaintCategory";
import ComplaintSubcategoryScreen from "./ComplaintSubcategory";
import ComplaintFormScreen from "./ComplaintForm";
import CommunityScreen from "./Community";
import CommunityWriteScreen from "./CommunityWrite";
import CommunityDetailScreen from "./CommunityDetail";
import FeeDetailScreen from "./FeeDetail";
import type { TenantScreen, TenantNavExtra, TenantNavigate } from "./types";
import { CATEGORIES } from "../../data";

export default function TenantFlow({ onExit }: { onExit: () => void }) {
  const [screen, setScreen] = useState<TenantScreen>("home");
  const [extra, setExtra] = useState<TenantNavExtra>({});

  const navigate: TenantNavigate = (s, e) => {
    setScreen(s);
    if (e !== undefined) setExtra(e);
  };

  switch (screen) {
    case "home":
      return <TenantHome navigate={navigate} onExit={onExit} />;
    case "complaint-history":
      return <ComplaintHistoryScreen navigate={navigate} />;
    case "complaint-history-detail":
      return extra.item ? <ComplaintHistoryDetailScreen item={extra.item} navigate={navigate} /> : <ComplaintHistoryScreen navigate={navigate} />;
    case "complaint-category":
      return <ComplaintCategoryScreen navigate={navigate} />;
    case "complaint-subcategory":
      return <ComplaintSubcategoryScreen category={extra.category ?? CATEGORIES[0].label} navigate={navigate} />;
    case "complaint-form":
      return <ComplaintFormScreen category={extra.category ?? CATEGORIES[0].label} subcategory={extra.subcategory ?? "기타"} navigate={navigate} />;
    case "community":
      return <CommunityScreen navigate={navigate} />;
    case "community-write":
      return <CommunityWriteScreen navigate={navigate} />;
    case "community-detail":
      return typeof extra.postId === "number" ? <CommunityDetailScreen postId={extra.postId} navigate={navigate} /> : <CommunityScreen navigate={navigate} />;
    case "fee-detail":
      return <FeeDetailScreen navigate={navigate} />;
    default:
      return <TenantHome navigate={navigate} onExit={onExit} />;
  }
}
