// ─── 공용 데이터 모델 & 시드 데이터 ────────────────────────────────────────
// PRD 11장(시드 데이터) 기준으로 통일했습니다. 세입자 화면과 집주인 화면이
// 이제 이 파일의 데이터를 함께 참조하므로, 세입자가 접수한 하자신청/게시글은
// 집주인 화면에도 그대로 반영됩니다 (실제 백엔드가 붙기 전까지의 프론트 목업 상태).

export type ComplaintCategory = "거실" | "부엌" | "방" | "화장실" | "현관" | "기타";
export type ComplaintStatus = "접수됨" | "확인중" | "처리중" | "완료";

export const CATEGORIES: { label: ComplaintCategory; emoji: string }[] = [
  { label: "거실", emoji: "🛋️" },
  { label: "부엌", emoji: "🍳" },
  { label: "방", emoji: "🛏️" },
  { label: "화장실", emoji: "🚿" },
  { label: "현관", emoji: "🚪" },
  { label: "기타", emoji: "📝" },
];

export const SUBCATEGORIES: Record<ComplaintCategory, string[]> = {
  거실: ["에어컨 고장/누수", "천장/벽 누수", "전등 및 콘센트 불량", "벽지/장판 훼손", "기타"],
  부엌: ["싱크대 하수구 막힘/역류", "수압 및 온수 불량", "주방 가전/설비 고장", "수납장 파손", "기타"],
  방: ["벽면 곰팡이/결로", "바닥 난방(보일러) 불량", "창문/창틀 문제", "방문/손잡이 파손", "기타"],
  화장실: ["변기 누수", "바닥/세면대 배수 불량", "환풍기 고장", "타일 및 수전 파손", "기타"],
  현관: ["도어락 고장/방전", "초인종/인터폰 불량", "현관 센서등 고장", "기타"],
  기타: ["소음 문제", "악취", "해충 발생", "공용구역 파손", "기타"],
};

export interface Complaint {
  id: number;
  unitNumber: string;
  tenantName: string;
  category: ComplaintCategory;
  subcategory: string;
  emoji: string;
  description: string;
  visitDays: number[]; // 방문 가능 날짜 (9월 기준 일 단위)
  createdAt: string;
  status: ComplaintStatus;
  memo: string | null; // 집주인 처리 메모 / 답변
  timeline: string[];
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
}

export interface PostComment {
  id: number;
  author: string;
  text: string;
  time: string;
}

export interface FreePost {
  id: number;
  author: string; // 익명이면 "익명", 아니면 "201호" 형태
  isAnonymous: boolean;
  unitNumber: string; // 작성자의 실제 호실 (익명이어도 서버에는 보관 — 화면에는 노출 안 함)
  title: string;
  body: string;
  date: string;
  likes: number;
  likedByMe?: boolean; // 현재 세입자가 하트를 눌렀는지 (백엔드에서 계산해 내려줌)
  hasPhoto: boolean;
  comments: PostComment[];
}

export type FeeStatus = "paid" | "scheduled" | "overdue";

export interface FeeRecord {
  id?: number;
  unitNumber: string;
  yearMonth: string; // "2026-09"
  rent: number;
  managementFee: number;
  dueDate: string;
  status: FeeStatus;
  paidDate?: string;
}

export interface Unit {
  number: string;
  tenantName: string;
}

export interface BuildingInfo {
  id: number;
  name: string;
  address: string;
  floors: number;
  units: Unit[];
}

// ─── 건물 · 집주인 · 세입자 (PRD 11장) ──────────────────────────────────────
export const BUILDING: BuildingInfo = {
  id: 1,
  name: "라일락빌라",
  address: "서울시 관악구 신림로 123",
  floors: 3,
  units: [
    { number: "101", tenantName: "김세입" },
    { number: "201", tenantName: "이세입" },
    { number: "202", tenantName: "정세입" },
  ],
};

export const LANDLORD = { name: "박집주", phone: "010-1111-2222" };

// 로그인이 없는 해커톤 버전이라, 세입자 화면은 시드 세입자 중 한 명(101호 김세입)의
// 시점으로 고정되어 있습니다. (백엔드 하드코딩된 t1과 동일)
export const CURRENT_TENANT = { name: "김세입", unitNumber: "101" };
export const CURRENT_TENANT_ID = "t1";
export const LANDLORD_ID = "l1";

// ─── 하자신청 시드 데이터 ────────────────────────────────────────────────────
export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 1,
    unitNumber: "101",
    tenantName: "김세입",
    category: "거실",
    subcategory: "천장/벽 누수",
    emoji: "🛋️",
    description: "거실 천장에서 물이 새고 있어요. 비 온 다음 날 더 심해집니다. 벽지도 누렇게 변해가고 있어서 빨리 처리 부탁드립니다.",
    visitDays: [14, 15],
    createdAt: "2026.09.02",
    status: "처리중",
    memo: "확인했습니다. 다음 주 월요일 오전에 방문하겠습니다.",
    timeline: ["2026.09.02 접수됨", "2026.09.03 확인중", "2026.09.05 처리중"],
  },
  {
    id: 2,
    unitNumber: "101",
    tenantName: "김세입",
    category: "화장실",
    subcategory: "변기 누수",
    emoji: "🚿",
    description: "변기 뒤쪽에서 물이 조금씩 새고 있습니다.",
    visitDays: [],
    createdAt: "2026.08.25",
    status: "완료",
    memo: "수리 완료되었습니다. 불편 드려서 죄송합니다.",
    timeline: ["2026.08.25 접수됨", "2026.08.26 확인중", "2026.08.27 처리중", "2026.08.28 완료"],
  },
  {
    id: 3,
    unitNumber: "202",
    tenantName: "정세입",
    category: "방",
    subcategory: "바닥 난방(보일러) 불량",
    emoji: "🛏️",
    description: "온도를 올려도 방이 따뜻해지지 않습니다.",
    visitDays: [],
    createdAt: "2026.09.11",
    status: "접수됨",
    memo: null,
    timeline: ["2026.09.11 접수됨"],
  },
];

// ─── 공지 게시판 시드 데이터 (집주인이 작성 → 세입자 게시판에 노출) ─────────
export const INITIAL_NOTICES: Notice[] = [
  { id: 1, title: "9월 정기 소독 안내", date: "2026.09.10", content: "9월 20일(토) 오전 9시부터 건물 전체 정기 소독이 진행됩니다. 세대 내 소독을 원하시면 미리 문을 열어두시거나 관리자에게 연락 바랍니다." },
  { id: 2, title: "9월 관리비 고지서 발송 안내", date: "2026.09.01", content: "2026년 9월분 관리비 고지서가 발송되었습니다. 납부 기한은 9월 25일입니다." },
  { id: 3, title: "공용 세탁기 사용 시간 안내", date: "2026.08.20", content: "공용 세탁기는 오전 8시부터 오후 10시까지만 사용 가능합니다." },
];

// ─── 자유 게시판 시드 데이터 (세입자 전용 — 집주인은 작성 불가) ─────────────
export const INITIAL_FREE_POSTS: FreePost[] = [
  {
    id: 1,
    author: "201호",
    isAnonymous: false,
    unitNumber: "201",
    title: "벌레 잡아주실 분 ㅠㅠ 사례합니다!",
    date: "2026.09.11",
    body: "얼마 전부터 방에 바퀴벌레 같은 벌레가 한 마리씩 나오고 있어요. 혹시 도와주실 수 있으신 분 계신가요? 사례는 꼭 하겠습니다!",
    comments: [
      { id: 1, author: "302호", text: "저도 요즘 그런 거 같더라고요. 방역 요청 해보셨어요?", time: "09:32" },
      { id: 2, author: "관리자", text: "이번 달 말에 공용 방역 예정입니다. 참고 부탁드립니다.", time: "10:15" },
      { id: 3, author: "105호", text: "붕산가루 쓰면 좀 줄어요!", time: "11:00" },
    ],
    likes: 3,
    hasPhoto: false,
  },
  {
    id: 2,
    author: "202호",
    isAnonymous: false,
    unitNumber: "202",
    title: "택배 문 앞에 두셔도 돼요~ 낮에 집에 있어요",
    date: "2026.09.10",
    body: "낮 시간에 주로 집에 있으니까 택배기사님이나 이웃분들이 문 앞에 두셔도 됩니다!",
    comments: [{ id: 1, author: "101호", text: "감사합니다~!", time: "14:00" }],
    likes: 7,
    hasPhoto: false,
  },
];

// ─── 관리비 · 월세 시드 데이터 ───────────────────────────────────────────────
// PRD 11장: 9월 3건 (완료/연체/예정 각 1건씩) + 8월분 완료 내역 1건
export const INITIAL_FEES: FeeRecord[] = [
  // 101 김세입 — 8월 완료, 9월 예정 (친구 파일 원본 데이터 유지)
  { unitNumber: "101", yearMonth: "2026-07", rent: 550000, managementFee: 70000, dueDate: "2026-07-25", status: "paid", paidDate: "2026-07-22" },
  { unitNumber: "101", yearMonth: "2026-08", rent: 550000, managementFee: 70000, dueDate: "2026-08-25", status: "paid", paidDate: "2026-08-20" },
  { unitNumber: "101", yearMonth: "2026-09", rent: 550000, managementFee: 70000, dueDate: "2026-09-25", status: "scheduled" },
  // 201 이세입 — 9월 완료
  { unitNumber: "201", yearMonth: "2026-08", rent: 600000, managementFee: 65000, dueDate: "2026-08-25", status: "paid", paidDate: "2026-08-23" },
  { unitNumber: "201", yearMonth: "2026-09", rent: 600000, managementFee: 65000, dueDate: "2026-09-25", status: "paid", paidDate: "2026-09-05" },
  // 202 정세입 — 9월 연체
  { unitNumber: "202", yearMonth: "2026-08", rent: 520000, managementFee: 60000, dueDate: "2026-08-25", status: "paid", paidDate: "2026-08-24" },
  { unitNumber: "202", yearMonth: "2026-09", rent: 520000, managementFee: 60000, dueDate: "2026-09-25", status: "overdue" },
];

export function feeTotal(f: FeeRecord) {
  return f.rent + f.managementFee;
}
