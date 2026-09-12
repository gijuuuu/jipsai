import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Complaint, Notice, FreePost, FeeRecord, ComplaintStatus, ComplaintCategory } from "./data";
import { CURRENT_TENANT_ID } from "./data";
import * as api from "./api";

interface AppData {
  loading: boolean;
  error: string | null;

  complaints: Complaint[];
  addComplaint: (c: {
    unitNumber: string;
    tenantName: string;
    category: ComplaintCategory;
    subcategory: string;
    emoji: string;
    description: string;
    visitDays: number[];
  }) => Promise<Complaint>;
  updateComplaintStatus: (id: number, status: ComplaintStatus, memo?: string, actor?: "tenant" | "landlord") => Promise<void>;

  notices: Notice[];
  addNotice: (n: { title: string; content: string; buildingId: number }) => Promise<Notice>;

  freePosts: FreePost[];
  addFreePost: (p: { title: string; body: string; isAnonymous: boolean; unitNumber: string }) => Promise<FreePost>;
  addComment: (postId: number, author: string, text: string) => Promise<void>;
  toggleLike: (postId: number) => Promise<void>;

  fees: FeeRecord[];
  markFeePaid: (unitNumber: string, yearMonth: string) => Promise<void>;
}

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [freePosts, setFreePosts] = useState<FreePost[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);

  // ─── 최초 로드: 백엔드(DB)에서 전체 데이터를 가져옵니다 ────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [c, n, p, f] = await Promise.all([
          api.fetchComplaints(),
          api.fetchNotices(),
          api.fetchPosts(CURRENT_TENANT_ID),
          api.fetchFees(),
        ]);
        if (cancelled) return;
        setComplaints(c);
        setNotices(n);
        setFreePosts(p);
        setFees(f);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setError(err instanceof Error ? err.message : "데이터를 불러오지 못했습니다. 백엔드 서버(npm run server)가 실행 중인지 확인해주세요.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addComplaint: AppData["addComplaint"] = async (c) => {
    const created = await api.createComplaint(c);
    setComplaints((prev) => [created, ...prev]);
    return created;
  };

  const updateComplaintStatus: AppData["updateComplaintStatus"] = async (id, status, memo, actor) => {
    const updated = await api.patchComplaint(id, { status, memo, actor });
    setComplaints((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const addNotice: AppData["addNotice"] = async (n) => {
    const created = await api.createNotice(n);
    setNotices((prev) => [created, ...prev]);
    return created;
  };

  const addFreePost: AppData["addFreePost"] = async (p) => {
    const created = await api.createPost(p);
    setFreePosts((prev) => [created, ...prev]);
    return created;
  };

  const addComment: AppData["addComment"] = async (postId, author, text) => {
    // 댓글 API 응답에는 likedByMe가 항상 false로 내려오므로(호출 시 tenantId를 넘기지
    // 않음), 댓글 목록만 갈아끼우고 좋아요 상태는 기존 클라이언트 상태를 그대로 둡니다.
    const updated = await api.createComment(postId, { author, text });
    setFreePosts((prev) => prev.map((p) => (p.id === postId ? { ...p, comments: updated.comments } : p)));
  };

  const toggleLike: AppData["toggleLike"] = async (postId) => {
    const { likes, liked } = await api.togglePostLike(postId, CURRENT_TENANT_ID);
    setFreePosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes, likedByMe: liked } : p)));
  };

  const markFeePaid: AppData["markFeePaid"] = async (unitNumber, yearMonth) => {
    const updated = await api.payFee(unitNumber, yearMonth);
    setFees((prev) => prev.map((f) => (f.unitNumber === unitNumber && f.yearMonth === yearMonth ? updated : f)));
  };

  return (
    <AppDataContext.Provider
      value={{
        loading,
        error,
        complaints,
        addComplaint,
        updateComplaintStatus,
        notices,
        addNotice,
        freePosts,
        addFreePost,
        addComment,
        toggleLike,
        fees,
        markFeePaid,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
