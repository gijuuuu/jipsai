import { createContext, useContext, useState, type ReactNode } from "react";
import { INITIAL_COMPLAINTS, INITIAL_NOTICES, INITIAL_FREE_POSTS, INITIAL_FEES, type Complaint, type Notice, type FreePost, type FeeRecord, type ComplaintStatus } from "./data";

interface AppData {
  complaints: Complaint[];
  addComplaint: (c: Omit<Complaint, "id" | "timeline">) => void;
  updateComplaintStatus: (id: number, status: ComplaintStatus, memo?: string) => void;

  notices: Notice[];
  addNotice: (n: Omit<Notice, "id" | "date">) => void;

  freePosts: FreePost[];
  addFreePost: (p: Omit<FreePost, "id" | "date" | "likes" | "hasPhoto" | "comments">) => void;
  addComment: (postId: number, author: string, text: string) => void;

  fees: FeeRecord[];
  markFeePaid: (unitNumber: string, yearMonth: string) => void;
}

const AppDataContext = createContext<AppData | null>(null);

function todayLabel() {
  // 데모 기준일: 2026년 9월 (PRD 시드 데이터 기준 날짜)
  return "2026.09.12";
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [freePosts, setFreePosts] = useState<FreePost[]>(INITIAL_FREE_POSTS);
  const [fees, setFees] = useState<FeeRecord[]>(INITIAL_FEES);

  const addComplaint: AppData["addComplaint"] = (c) => {
    setComplaints((prev) => [
      { ...c, id: Date.now(), timeline: [`${todayLabel()} 접수됨`] },
      ...prev,
    ]);
  };

  const updateComplaintStatus: AppData["updateComplaintStatus"] = (id, status, memo) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status, memo: memo ?? c.memo, timeline: [...c.timeline, `${todayLabel()} ${status}`] }
          : c
      )
    );
  };

  const addNotice: AppData["addNotice"] = (n) => {
    setNotices((prev) => [{ ...n, id: Date.now(), date: todayLabel() }, ...prev]);
  };

  const addFreePost: AppData["addFreePost"] = (p) => {
    setFreePosts((prev) => [{ ...p, id: Date.now(), date: todayLabel(), likes: 0, hasPhoto: false, comments: [] }, ...prev]);
  };

  const addComment: AppData["addComment"] = (postId, author, text) => {
    setFreePosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, { id: Date.now(), author, text, time: "방금" }] } : p))
    );
  };

  const markFeePaid: AppData["markFeePaid"] = (unitNumber, yearMonth) => {
    setFees((prev) => prev.map((f) => (f.unitNumber === unitNumber && f.yearMonth === yearMonth ? { ...f, status: "paid", paidDate: todayLabel().replace(/\./g, "-") } : f)));
  };

  return (
    <AppDataContext.Provider value={{ complaints, addComplaint, updateComplaintStatus, notices, addNotice, freePosts, addFreePost, addComment, fees, markFeePaid }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
