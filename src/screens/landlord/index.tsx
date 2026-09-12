import { useState } from "react";
import LandlordHome from "./Home";
import NoticeManageScreen from "./NoticeManage";
import NoticeWriteScreen from "./NoticeWrite";
import BuildingList from "./BuildingList";
import BuildingDetail from "./BuildingDetail";
import InvoiceDetail from "./InvoiceDetail";
import RequestsReceived from "./RequestsReceived";
import MeetingScheduler from "./MeetingScheduler";
import RequestLog from "./RequestLog";
import RequestLogDetail from "./RequestLogDetail";
import Settlement from "./Settlement";
import type { LandlordScreen, LandlordNavExtra, LandlordNavigate } from "./types";

export default function LandlordFlow({ onExit }: { onExit: () => void }) {
  const [screen, setScreen] = useState<LandlordScreen>("home");
  const [extra, setExtra] = useState<LandlordNavExtra>({});

  const navigate: LandlordNavigate = (s, e) => {
    setScreen(s);
    if (e !== undefined) setExtra((prev) => ({ ...prev, ...e }));
  };

  switch (screen) {
    case "home":
      return <LandlordHome navigate={navigate} onExit={onExit} />;
    case "notice-manage":
      return <NoticeManageScreen navigate={navigate} />;
    case "notice-write":
      return <NoticeWriteScreen navigate={navigate} />;
    case "building-list":
      return <BuildingList navigate={navigate} />;
    case "building-detail":
      return <BuildingDetail navigate={navigate} />;
    case "invoice-detail":
      return <InvoiceDetail unitNumber={extra.unitNumber ?? "101"} navigate={navigate} />;
    case "requests-received":
      return <RequestsReceived unitNumber={extra.unitNumber ?? "101"} navigate={navigate} />;
    case "meeting-scheduler":
      return typeof extra.complaintId === "number" ? (
        <MeetingScheduler unitNumber={extra.unitNumber ?? "101"} complaintId={extra.complaintId} navigate={navigate} />
      ) : (
        <RequestsReceived unitNumber={extra.unitNumber ?? "101"} navigate={navigate} />
      );
    case "request-log":
      return <RequestLog unitNumber={extra.unitNumber ?? "101"} navigate={navigate} />;
    case "request-log-detail":
      return typeof extra.complaintId === "number" ? (
        <RequestLogDetail unitNumber={extra.unitNumber ?? "101"} complaintId={extra.complaintId} navigate={navigate} />
      ) : (
        <RequestLog unitNumber={extra.unitNumber ?? "101"} navigate={navigate} />
      );
    case "settlement":
      return <Settlement navigate={navigate} />;
    default:
      return <LandlordHome navigate={navigate} onExit={onExit} />;
  }
}
