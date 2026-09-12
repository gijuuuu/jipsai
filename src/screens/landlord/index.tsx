import { useState } from "react";
import LandlordHome from "./Home";
import NoticeBuildingSelect from "./NoticeBuildingSelect";
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

  const buildingId = extra.buildingId ?? 1;
  const unitNumber = extra.unitNumber ?? "101";
  const backTo = extra.backTo ?? "building-detail";

  switch (screen) {
    case "home":
      return <LandlordHome navigate={navigate} onExit={onExit} />;
    case "notice-building-select":
      return <NoticeBuildingSelect navigate={navigate} />;
    case "notice-manage":
      return <NoticeManageScreen buildingId={buildingId} navigate={navigate} />;
    case "notice-write":
      return <NoticeWriteScreen buildingId={buildingId} navigate={navigate} />;
    case "building-list":
      return <BuildingList navigate={navigate} />;
    case "building-detail":
      return <BuildingDetail buildingId={buildingId} navigate={navigate} />;
    case "invoice-detail":
      return <InvoiceDetail unitNumber={unitNumber} buildingId={buildingId} backTo={backTo} navigate={navigate} />;
    case "requests-received":
      return <RequestsReceived unitNumber={unitNumber} buildingId={buildingId} backTo={backTo} navigate={navigate} />;
    case "meeting-scheduler":
      return typeof extra.complaintId === "number" ? (
        <MeetingScheduler unitNumber={unitNumber} buildingId={buildingId} complaintId={extra.complaintId} navigate={navigate} />
      ) : (
        <RequestsReceived unitNumber={unitNumber} buildingId={buildingId} backTo={backTo} navigate={navigate} />
      );
    case "request-log":
      return <RequestLog unitNumber={unitNumber} buildingId={buildingId} navigate={navigate} />;
    case "request-log-detail":
      return typeof extra.complaintId === "number" ? (
        <RequestLogDetail unitNumber={unitNumber} buildingId={buildingId} complaintId={extra.complaintId} navigate={navigate} />
      ) : (
        <RequestLog unitNumber={unitNumber} buildingId={buildingId} navigate={navigate} />
      );
    case "settlement":
      return <Settlement navigate={navigate} />;
    default:
      return <LandlordHome navigate={navigate} onExit={onExit} />;
  }
}
