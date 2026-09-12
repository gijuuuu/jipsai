// ─── 백엔드 REST API 클라이언트 ─────────────────────────────────────────────
// 모든 요청은 vite.config.ts의 프록시를 통해 backend/server.js(기본 4000번
// 포트)로 전달됩니다. 이 파일 하나만 보면 프론트가 백엔드와 어떻게
// 통신하는지 알 수 있도록 얇게 유지했습니다.

import type { Complaint, ComplaintCategory, ComplaintStatus, Notice, FreePost, PostComment, FeeRecord, FeeStatus } from "./data";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as { error?: string });
    throw new Error(body.error || `요청에 실패했습니다. (${res.status})`);
  }
  return res.json() as Promise<T>;
}

// ─── 불편사항 (하자신청) ────────────────────────────────────────────────────
export function fetchComplaints(): Promise<Complaint[]> {
  return request<Complaint[]>("/complaints");
}

export function createComplaint(payload: {
  unitNumber: string;
  tenantName: string;
  category: ComplaintCategory;
  subcategory: string;
  emoji: string;
  description: string;
  visitDays: number[];
}): Promise<Complaint> {
  return request<Complaint>("/complaints", { method: "POST", body: JSON.stringify(payload) });
}

export function patchComplaint(
  id: number,
  payload: { status?: ComplaintStatus; memo?: string; actor?: "tenant" | "landlord" }
): Promise<Complaint> {
  return request<Complaint>(`/complaints/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

// ─── 공지 ───────────────────────────────────────────────────────────────────
export function fetchNotices(): Promise<Notice[]> {
  return request<Notice[]>("/notices");
}

export function createNotice(payload: { title: string; content: string }): Promise<Notice> {
  return request<Notice>("/notices", { method: "POST", body: JSON.stringify(payload) });
}

// ─── 커뮤니티 게시판 ────────────────────────────────────────────────────────
export function fetchPosts(tenantId: string): Promise<FreePost[]> {
  return request<FreePost[]>(`/posts?tenantId=${encodeURIComponent(tenantId)}`);
}

export function createPost(payload: { title: string; body: string; unitNumber: string; isAnonymous: boolean }): Promise<FreePost> {
  return request<FreePost>("/posts", { method: "POST", body: JSON.stringify(payload) });
}

export function createComment(postId: number, payload: { author: string; text: string }): Promise<FreePost> {
  return request<FreePost>(`/posts/${postId}/comments`, { method: "POST", body: JSON.stringify(payload) });
}

export function togglePostLike(postId: number, tenantId: string): Promise<{ likes: number; liked: boolean }> {
  return request<{ likes: number; liked: boolean }>(`/posts/${postId}/like`, { method: "POST", body: JSON.stringify({ tenantId }) });
}

// ─── 관리비 및 월세 ─────────────────────────────────────────────────────────
export function fetchFees(): Promise<FeeRecord[]> {
  return request<FeeRecord[]>("/fees");
}

export function payFee(unitNumber: string, yearMonth: string): Promise<FeeRecord> {
  return request<FeeRecord>("/fees/pay", { method: "POST", body: JSON.stringify({ unitNumber, yearMonth }) });
}

export type { FeeStatus, PostComment };
