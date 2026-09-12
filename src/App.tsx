import { useState, useEffect, useRef } from "react";

const NAVY = "#353e6c";
const ORANGE = "#ffa319";
const IVORY = "#faf8f4";

type Screen =
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

// ─── SVG Line Icons ───────────────────────────────────────────────────────────
function IconPlane({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M4 16L28 4L20 28L14 18L4 16Z" stroke={NAVY} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M14 18L20 12" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconChat({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M6 8C6 6.9 6.9 6 8 6H24C25.1 6 26 6.9 26 8V19C26 20.1 25.1 21 24 21H19L14 26V21H8C6.9 21 6 20.1 6 19V8Z" stroke={NAVY} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="11.5" cy="14.5" r="1.5" fill={NAVY} />
      <circle cx="16" cy="14.5" r="1.5" fill={NAVY} />
      <circle cx="20.5" cy="14.5" r="1.5" fill={NAVY} />
    </svg>
  );
}
function IconDoc({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="6" y="4" width="20" height="24" rx="3" stroke={NAVY} strokeWidth="1.8" />
      <path d="M11 11H21M11 16H21M11 21H17" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconArrowLeft({ color = "white", size = 26 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <path d="M17 5L8 13L17 21" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCamera({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M4 9C4 7.9 4.9 7 6 7H8L10 4H18L20 7H22C23.1 7 24 7.9 24 9V21C24 22.1 23.1 23 22 23H6C4.9 23 4 22.1 4 21V9Z" stroke={NAVY} strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="14" cy="15" r="4" stroke={NAVY} strokeWidth="1.7" />
    </svg>
  );
}
function IconHeart({ filled = false, size = 20 }: { filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 17C10 17 3 12.5 3 7.5C3 5.5 4.7 4 6.8 4C8.1 4 9.2 4.7 10 5.7C10.8 4.7 11.9 4 13.2 4C15.3 4 17 5.5 17 7.5C17 12.5 10 17 10 17Z"
        stroke={filled ? ORANGE : NAVY} fill={filled ? ORANGE : "none"} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function IconComment({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M4 5C4 4.4 4.4 4 5 4H15C15.6 4 16 4.4 16 5V12C16 12.6 15.6 13 15 13H11L8 16V13H5C4.4 13 4 12.6 4 12V5Z"
        stroke={NAVY} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function AvatarIcon({ label, size = 32 }: { label: string; size?: number }) {
  return (
    <div className="flex items-center justify-center rounded-full flex-shrink-0 font-extrabold"
      style={{ width: size, height: size, background: "#eef0fa", color: NAVY, fontSize: size * 0.35, border: `1.5px solid ${NAVY}20` }}>
      {label}
    </div>
  );
}

// ─── House 3D Illustration ────────────────────────────────────────────────────
function HouseIllustration() {
  return (
    <svg viewBox="0 0 210 158" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="105" cy="148" rx="72" ry="9" fill="#c5b9aa" opacity="0.35" />
      <rect x="36" y="74" width="112" height="70" rx="4" fill="#f5f0e8" />
      <path d="M148 74 L170 62 L170 136 L148 144 Z" fill="#e2d9cc" />
      <path d="M26 78 L105 31 L184 66 L148 74 L105 55 L36 74 Z" fill="#c0392b" />
      <path d="M148 74 L184 66 L170 62 L148 70 Z" fill="#a93226" />
      <path d="M26 78 L105 31 L105 55 L36 74 Z" fill="#d44f43" />
      <rect x="122" y="37" width="11" height="25" rx="2" fill="#b5863a" />
      <rect x="119" y="34" width="17" height="6" rx="2" fill="#cca04e" />
      <rect x="50" y="86" width="25" height="22" rx="3" fill="#a8d8ea" stroke={NAVY} strokeWidth="1.2" />
      <line x1="62" y1="86" x2="62" y2="108" stroke={NAVY} strokeWidth="0.9" />
      <line x1="50" y1="97" x2="75" y2="97" stroke={NAVY} strokeWidth="0.9" />
      <rect x="103" y="86" width="25" height="22" rx="3" fill="#a8d8ea" stroke={NAVY} strokeWidth="1.2" />
      <line x1="115" y1="86" x2="115" y2="108" stroke={NAVY} strokeWidth="0.9" />
      <line x1="103" y1="97" x2="128" y2="97" stroke={NAVY} strokeWidth="0.9" />
      <rect x="156" y="81" width="11" height="16" rx="2" fill="#a8d8ea" stroke={NAVY} strokeWidth="1" opacity="0.8" />
      <rect x="78" y="106" width="28" height="38" rx="3" fill="#b5863a" />
      <rect x="82" y="110" width="9" height="16" rx="1.5" fill="#cca04e" />
      <rect x="93" y="110" width="9" height="16" rx="1.5" fill="#cca04e" />
      <circle cx="91" cy="126" r="1.7" fill={NAVY} />
      <rect x="72" y="142" width="40" height="4" rx="2" fill="#d4c9b8" />
      <path d="M84 144 L76 158 L132 158 L124 144 Z" fill="#ddd0be" />
      <ellipse cx="15" cy="108" rx="11" ry="15" fill="#5a9a5a" />
      <rect x="13" y="122" width="4" height="13" rx="1" fill="#7a5c3a" />
      <ellipse cx="197" cy="111" rx="10" ry="13" fill="#4a8a4a" />
      <rect x="195" y="123" width="4" height="11" rx="1" fill="#7a5c3a" />
    </svg>
  );
}

// ─── Shared Nav Header ────────────────────────────────────────────────────────
function NavHeader({ title, subtitle, onBack, rightEl }: {
  title: string; subtitle?: string; onBack: () => void; rightEl?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 px-3 flex-shrink-0"
      style={{ background: NAVY, minHeight: 60, paddingTop: 12, paddingBottom: 12 }}>
      <button onClick={onBack}
        className="flex items-center justify-center rounded-xl flex-shrink-0 active:scale-95 transition-transform"
        style={{ width: 44, height: 44, background: "rgba(255,255,255,0.15)" }}>
        <IconArrowLeft />
      </button>
      <div className="flex flex-col flex-1 min-w-0">
        {subtitle && <span className="text-xs font-medium opacity-55 text-white leading-tight">{subtitle}</span>}
        <span className="font-extrabold text-base text-white leading-tight truncate">{title}</span>
      </div>
      {rightEl}
    </div>
  );
}

// ─── Bottom Sheet ─────────────────────────────────────────────────────────────
function BottomSheet({ onClose, onNew, onHistory }: { onClose: () => void; onNew: () => void; onHistory: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(0,0,0,0.45)" }} onClick={onClose}>
      <div className="slide-up rounded-t-3xl px-5 pt-4 pb-8 flex flex-col gap-3 bg-white" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full mx-auto mb-2" style={{ background: "#ddd" }} />
        <div className="font-extrabold text-lg mb-1" style={{ color: NAVY }}>불편사항 접수</div>
        <button onClick={onNew}
          className="w-full py-4 rounded-2xl font-extrabold text-base active:scale-95 transition-transform"
          style={{ background: ORANGE, color: NAVY }}>
          ✏️ &nbsp;새로 접수하기
        </button>
        <button onClick={onHistory}
          className="w-full py-4 rounded-2xl font-bold text-base border-2 active:scale-95 transition-transform bg-white"
          style={{ borderColor: NAVY, color: NAVY }}>
          📋 &nbsp;접수 내역 확인하기
        </button>
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    "접수됨": { bg: "#eef0fa", color: NAVY },
    "확인중": { bg: "#fff4e0", color: "#c97c00" },
    "처리중": { bg: "#e6f2ff", color: "#1a6dc7" },
    "완료":   { bg: "#e8f8ee", color: "#1f9e52" },
  };
  const s = map[status] ?? { bg: "#eee", color: "#555" };
  return <span className="text-xs font-extrabold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>{status}</span>;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const HISTORY_ITEMS = [
  { id: 1, emoji: "🛋️", category: "거실", sub: "천장/벽 누수", date: "2026.09.02", status: "처리중",
    reply: "확인했습니다. 다음 주 월요일 오전에 방문하겠습니다.",
    content: "거실 천장에서 물이 새고 있어요. 비 온 다음 날 더 심해집니다. 벽지도 누렇게 변해가고 있어서 빨리 처리 부탁드립니다.",
    timeline: ["2026.09.02 접수됨", "2026.09.03 확인중", "2026.09.05 처리중"] },
  { id: 2, emoji: "🚿", category: "화장실", sub: "변기 누수", date: "2026.08.25", status: "완료",
    reply: "수리 완료되었습니다. 불편 드려서 죄송합니다.",
    content: "변기 뒤쪽에서 물이 조금씩 새고 있습니다.",
    timeline: ["2026.08.25 접수됨", "2026.08.26 확인중", "2026.08.27 처리중", "2026.08.28 완료"] },
  { id: 3, emoji: "🚪", category: "현관", sub: "도어락 고장/방전", date: "2026.09.08", status: "접수됨",
    reply: null,
    content: "도어락 배터리가 방전된 것 같은데 교체 부탁드립니다.",
    timeline: ["2026.09.08 접수됨"] },
];

const NOTICE_POSTS = [
  { id: 1, title: "입주민 여러분, 집에서 담배를 피지 말아주세요.", date: "2026.09.10",
    preview: "공용 복도와 계단에서도 흡연을 삼가 주시기 바랍니다. 위반 시 경고 조치될 수 있습니다." },
  { id: 2, title: "9월 관리비 고지서 발송 안내", date: "2026.09.01",
    preview: "2026년 9월분 관리비 고지서가 발송되었습니다. 납부 기한은 9월 25일입니다." },
  { id: 3, title: "공용 세탁기 사용 시간 안내", date: "2026.08.20",
    preview: "공용 세탁기는 오전 8시부터 오후 10시까지만 사용 가능합니다." },
];

const FREE_POSTS = [
  { id: 1, author: "201호", title: "벌레 잡아주실 분 ㅠㅠ 사례합니다!", date: "2026.09.11",
    body: "얼마 전부터 방에 바퀴벌레 같은 벌레가 한 마리씩 나오고 있어요. 혹시 도와주실 수 있으신 분 계신가요? 사례는 꼭 하겠습니다!",
    comments: [
      { id: 1, author: "302호", text: "저도 요즘 그런 거 같더라고요. 방역 요청 해보셨어요?", time: "09:32" },
      { id: 2, author: "관리자", text: "이번 달 말에 공용 방역 예정입니다. 참고 부탁드립니다.", time: "10:15" },
      { id: 3, author: "105호", text: "붕산가루 쓰면 좀 줄어요!", time: "11:00" },
      { id: 4, author: "203호", text: "저도 당해봤는데 너무 힘드셨겠어요ㅠ", time: "13:22" },
    ],
    likes: 3, hasPhoto: false },
  { id: 2, author: "302호", title: "택배 문 앞에 두셔도 돼요~ 낮에 집에 있어요", date: "2026.09.10",
    body: "낮 시간에 주로 집에 있으니까 택배기사님이나 이웃분들이 문 앞에 두셔도 됩니다!",
    comments: [
      { id: 1, author: "201호", text: "감사합니다~!", time: "14:00" },
      { id: 2, author: "104호", text: "다들 이렇게 하면 좋겠네요 ㅎ", time: "15:30" },
    ],
    likes: 7, hasPhoto: false },
  { id: 3, author: "101호", title: "주차 관련 양해 구합니다", date: "2026.09.09",
    body: "잠깐 세워뒀어요. 바로 이동할게요 혹시 불편하시면 연락 주세요.",
    comments: [{ id: 1, author: "102호", text: "네 괜찮아요~", time: "08:55" }],
    likes: 1, hasPhoto: false },
  { id: 4, author: "105호", title: "분리수거 요일 정리해봤어요 (사진 첨부)", date: "2026.09.07",
    body: "매번 헷갈리시는 분들을 위해 정리해봤습니다!\n📦 종이 - 화요일\n🥤 플라스틱 - 목요일\n🍾 유리 - 수요일\n🗑️ 일반쓰레기 - 월/수/금",
    comments: [
      { id: 1, author: "201호", text: "감사합니다!! 너무 유용해요", time: "10:00" },
      { id: 2, author: "303호", text: "캡처해뒀어요 ㅎㅎ", time: "10:30" },
      { id: 3, author: "102호", text: "이거 공지에 올려달라고 해도 될 것 같은데요", time: "11:00" },
      { id: 4, author: "105호", text: "감사해요~ 공지 요청 해볼게요!", time: "11:45" },
      { id: 5, author: "203호", text: "저장 완료!", time: "13:00" },
      { id: 6, author: "104호", text: "대단하십니다 덕분에 살겠어요", time: "14:15" },
      { id: 7, author: "301호", text: "최고예요!!", time: "16:00" },
      { id: 8, author: "205호", text: "이거 프린트해서 게시판에 붙여도 될까요?", time: "18:30" },
    ],
    likes: 12, hasPhoto: true },
  { id: 5, author: "203호", title: "냄새 나는 쓰레기 복도에 두지 말아주세요", date: "2026.09.05",
    body: "복도에 음식물 쓰레기를 두시면 냄새가 너무 심합니다. 꼭 지정 수거함에 버려주세요.",
    comments: [
      { id: 1, author: "304호", text: "맞아요 요즘 심하더라고요", time: "20:00" },
      { id: 2, author: "101호", text: "죄송합니다 제가 가끔 그랬는데 앞으로 주의할게요", time: "21:15" },
      { id: 3, author: "203호", text: "감사합니다 ^^", time: "22:00" },
    ],
    likes: 5, hasPhoto: false },
];

const SUBCATEGORIES: Record<string, string[]> = {
  거실: ["에어컨 고장/누수", "천장/벽 누수", "전등 및 콘센트 불량", "벽지/장판 훼손", "기타"],
  부엌: ["싱크대 하수구 막힘/역류", "수압 및 온수 불량", "주방 가전/설비 고장", "수납장 파손", "기타"],
  방: ["벽면 곰팡이/결로", "바닥 난방(보일러) 불량", "창문/창틀 문제", "방문/손잡이 파손", "기타"],
  화장실: ["변기 누수", "바닥/세면대 배수 불량", "환풍기 고장", "타일 및 수전 파손", "기타"],
  현관: ["도어락 고장/방전", "초인종/인터폰 불량", "현관 센서등 고장", "기타"],
  기타: ["소음 문제", "악취", "해충 발생", "공용구역 파손", "기타"],
};

const FEE_MONTHS = ["2026-07", "2026-08", "2026-09"];
const FEE_DATA: Record<string, { paid: boolean; total: number; rent: number; manage: number; dueDate: string; paidDate?: string; dDay?: number }> = {
  "2026-07": { paid: true,  total: 620000, rent: 575000, manage: 45000, dueDate: "2026-07-25", paidDate: "2026-07-22" },
  "2026-08": { paid: true,  total: 620000, rent: 575000, manage: 45000, dueDate: "2026-08-25", paidDate: "2026-08-20" },
  "2026-09": { paid: false, total: 620000, rent: 575000, manage: 45000, dueDate: "2026-09-25", dDay: 13 },
};

// ─── Screen: Home ─────────────────────────────────────────────────────────────
function HomeScreen({ navigate }: { navigate: (s: Screen, e?: any) => void }) {
  const [sheet, setSheet] = useState(false);
  const [dot, setDot] = useState(0);
  const notices = [
    "입주민 여러분, 집에서 담배를 피지 말아주세요.",
    "9월 공용 청소는 9/20(토) 진행됩니다.",
    "주차 공간 변경 안내: 지하 1층 이용 바랍니다.",
  ];
  useEffect(() => {
    const t = setInterval(() => setDot(d => (d + 1) % notices.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-y-auto relative" style={{ background: IVORY }}>
      {/* Hero — safe area top */}
      <div className="relative flex-shrink-0" style={{ background: "linear-gradient(160deg,#f5efe6 55%,#e8e0d4 100%)", paddingTop: 36 }}>
        <div style={{ height: 152 }}><HouseIllustration /></div>
        <div className="absolute right-5" style={{ top: 44, textAlign: "right" }}>
          <div className="text-xs font-medium" style={{ color: NAVY, opacity: 0.6 }}>서울시 관악구 신림로 123</div>
          <div className="text-xl font-black" style={{ color: NAVY }}>라일락빌라</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pt-4 pb-8">
        {/* Fee Card */}
        <div className="rounded-2xl border-2 bg-white px-5 pt-4 pb-5" style={{ borderColor: NAVY }}>
          <div className="flex items-start justify-between mb-1">
            <span className="text-xs font-bold" style={{ color: NAVY }}>2026년 9월 청구서</span>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full" style={{ background: "#e8f8ee", color: "#1f9e52" }}>납부 완료</span>
          </div>
          <div className="font-black mt-1" style={{ fontSize: 34, color: NAVY, letterSpacing: -1 }}>620,000원</div>
          <div className="flex gap-5 mt-2">
            <div><div className="text-xs" style={{ color: NAVY, opacity: 0.45 }}>관리비</div><div className="text-sm font-bold" style={{ color: NAVY }}>45,000원</div></div>
            <div><div className="text-xs" style={{ color: NAVY, opacity: 0.45 }}>월세</div><div className="text-sm font-bold" style={{ color: NAVY }}>575,000원</div></div>
          </div>
        </div>

        {/* Notice carousel */}
        <div className="rounded-2xl overflow-hidden" style={{ background: NAVY }}>
          <div className="flex items-center gap-3 px-4 py-3">
            <span style={{ fontSize: 18, flexShrink: 0 }}>📢</span>
            <span className="text-sm font-medium text-white flex-1 leading-snug">{notices[dot]}</span>
          </div>
          <div className="flex justify-center gap-1.5 pb-2.5">
            {notices.map((_, i) => (
              <button key={i} onClick={() => setDot(i)}
                className="rounded-full transition-all duration-300"
                style={{ height: 6, width: i === dot ? 18 : 6, background: i === dot ? ORANGE : "rgba(255,255,255,0.35)" }} />
            ))}
          </div>
        </div>

        {/* Quick action buttons — unified size */}
        <div className="grid grid-cols-3 gap-3">
          {/* Complaint */}
          <div className="relative">
            <button onClick={() => setSheet(true)}
              className="w-full flex flex-col items-center justify-center gap-3 rounded-2xl border-2 bg-white active:scale-95 transition-transform"
              style={{ borderColor: NAVY, paddingTop: 22, paddingBottom: 22 }}>
              <IconPlane size={32} />
              <span className="text-xs font-extrabold text-center leading-tight" style={{ color: NAVY }}>불편사항{"\n"}접수</span>
            </button>
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
              style={{ background: ORANGE, color: NAVY }}>2</div>
          </div>
          <button onClick={() => navigate("community")}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 bg-white active:scale-95 transition-transform"
            style={{ borderColor: NAVY, paddingTop: 22, paddingBottom: 22 }}>
            <IconChat size={32} />
            <span className="text-xs font-extrabold text-center leading-tight whitespace-pre-line" style={{ color: NAVY }}>{"커뮤니티\n게시판"}</span>
          </button>
          <button onClick={() => navigate("fee-detail")}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 bg-white active:scale-95 transition-transform"
            style={{ borderColor: NAVY, paddingTop: 22, paddingBottom: 22 }}>
            <IconDoc size={32} />
            <span className="text-xs font-extrabold text-center leading-tight whitespace-pre-line" style={{ color: NAVY }}>{"관리비\n및 월세"}</span>
          </button>
        </div>

        {/* Board preview */}
        <div className="rounded-2xl overflow-hidden border-2" style={{ borderColor: NAVY }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ background: NAVY }}>
            <span className="font-extrabold text-base text-white">게시판</span>
            <button onClick={() => navigate("community")} className="text-xs font-bold" style={{ color: ORANGE }}>더보기 &gt;</button>
          </div>
          <div className="bg-white divide-y" style={{ borderColor: "#eee" }}>
            <div className="px-4 py-3 flex items-start gap-2">
              <span className="mt-0.5 text-xs font-extrabold px-2 py-0.5 rounded flex-shrink-0" style={{ background: "#fff0d4", color: ORANGE }}>공지</span>
              <span className="text-sm font-medium leading-snug line-clamp-1" style={{ color: NAVY }}>입주민 여러분, 집에서 담배를 피지 말아주세요.</span>
            </div>
            <div className="px-4 py-3 flex items-start gap-2">
              <span className="mt-0.5 text-xs font-extrabold px-2 py-0.5 rounded flex-shrink-0" style={{ background: "#eef0fa", color: NAVY }}>자유</span>
              <span className="text-sm font-medium leading-snug line-clamp-1" style={{ color: NAVY }}>201호 벌레 잡아주실 분 ㅠㅠ 사례합니다!</span>
            </div>
          </div>
        </div>
      </div>

      {sheet && (
        <BottomSheet
          onClose={() => setSheet(false)}
          onNew={() => { setSheet(false); navigate("complaint-category"); }}
          onHistory={() => { setSheet(false); navigate("complaint-history"); }}
        />
      )}
    </div>
  );
}

// ─── Screen: Complaint History ────────────────────────────────────────────────
function ComplaintHistoryScreen({ navigate }: { navigate: (s: Screen, e?: any) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title="접수 내역" onBack={() => navigate("home")} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {HISTORY_ITEMS.map(item => (
          <button key={item.id} onClick={() => navigate("complaint-history-detail", { item })}
            className="w-full text-left rounded-2xl border-2 bg-white overflow-hidden active:scale-[0.98] transition-transform"
            style={{ borderColor: NAVY }}>
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span style={{ fontSize: 22 }}>{item.emoji}</span>
                  <div>
                    <div className="font-extrabold text-sm" style={{ color: NAVY }}>{item.category} &gt; {item.sub}</div>
                    <div className="text-xs mt-0.5" style={{ color: NAVY, opacity: 0.4 }}>{item.date}</div>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>
            </div>
            <div className="mx-4 mb-4 rounded-xl px-3 py-2.5"
              style={{ background: item.reply ? "#f0f2fa" : "#fafafa", border: `1px solid ${item.reply ? "#d8dcf0" : "#eee"}` }}>
              {item.reply
                ? <div className="flex gap-2 items-start">
                    <span className="text-xs font-extrabold flex-shrink-0 mt-0.5" style={{ color: NAVY }}>🏠 집주인</span>
                    <span className="text-xs font-medium leading-snug line-clamp-2" style={{ color: NAVY, opacity: 0.8 }}>{item.reply}</span>
                  </div>
                : <span className="text-xs font-medium" style={{ color: NAVY, opacity: 0.35 }}>💬 답변 대기중</span>
              }
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Screen: Complaint History Detail ────────────────────────────────────────
function ComplaintHistoryDetailScreen({ item, navigate }: { item: typeof HISTORY_ITEMS[0]; navigate: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title={`${item.category} > ${item.sub}`} subtitle="접수 내역 상세" onBack={() => navigate("complaint-history")} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white border-2" style={{ borderColor: NAVY }}>
          <span className="font-bold text-sm" style={{ color: NAVY }}>접수일: {item.date}</span>
          <StatusBadge status={item.status} />
        </div>
        <div className="rounded-2xl border-2 bg-white px-4 py-4" style={{ borderColor: NAVY }}>
          <div className="text-xs font-extrabold mb-2 opacity-55" style={{ color: NAVY }}>신청 내용</div>
          <p className="text-sm font-medium leading-relaxed" style={{ color: NAVY }}>{item.content}</p>
        </div>
        <div className="rounded-2xl border-2 bg-white px-4 py-4" style={{ borderColor: NAVY }}>
          <div className="text-xs font-extrabold mb-2 opacity-55" style={{ color: NAVY }}>첨부 사진</div>
          <div className="flex gap-2">
            {[1, 2].map(n => (
              <div key={n} className="w-20 h-20 rounded-xl flex items-center justify-center"
                style={{ background: "#eef0fa", border: `1.5px solid ${NAVY}25` }}>
                <span style={{ fontSize: 28 }}>🖼️</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border-2 bg-white px-4 py-4" style={{ borderColor: NAVY }}>
          <div className="text-xs font-extrabold mb-3 opacity-55" style={{ color: NAVY }}>처리 현황</div>
          {item.timeline.map((t, i) => (
            <div key={i} className="flex items-center gap-3 mb-2 last:mb-0">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: i === item.timeline.length - 1 ? ORANGE : NAVY, opacity: i === item.timeline.length - 1 ? 1 : 0.25 }} />
              <span className="text-xs" style={{ color: NAVY, fontWeight: i === item.timeline.length - 1 ? 700 : 500, opacity: i === item.timeline.length - 1 ? 1 : 0.5 }}>{t}</span>
            </div>
          ))}
        </div>
        {item.reply
          ? <div className="rounded-2xl border-2 px-4 py-4" style={{ borderColor: NAVY, background: "#f0f2fa" }}>
              <div className="text-xs font-extrabold mb-2 opacity-55" style={{ color: NAVY }}>🏠 집주인 답변</div>
              <p className="text-sm font-medium leading-relaxed" style={{ color: NAVY }}>{item.reply}</p>
            </div>
          : <div className="rounded-2xl border-2 px-4 py-4 flex items-center justify-center" style={{ borderColor: "#ddd", background: "#fafafa" }}>
              <span className="text-sm font-medium" style={{ color: NAVY, opacity: 0.35 }}>💬 아직 답변이 없습니다.</span>
            </div>
        }
      </div>
    </div>
  );
}

// ─── Screen: Complaint Category ───────────────────────────────────────────────
const CATEGORIES = [
  { label: "거실", emoji: "🛋️" }, { label: "부엌", emoji: "🍳" },
  { label: "방", emoji: "🛏️" },  { label: "화장실", emoji: "🚿" },
  { label: "현관", emoji: "🚪" }, { label: "기타", emoji: "📝" },
];

function ComplaintCategoryScreen({ navigate }: { navigate: (s: Screen, e?: any) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title="불편 사항 접수" onBack={() => navigate("home")} />
      <div className="px-4 py-5 flex-1">
        <p className="text-sm font-medium mb-4" style={{ color: NAVY, opacity: 0.6 }}>어느 공간의 불편사항인지 선택해 주세요.</p>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(({ label, emoji }) => (
            <button key={label} onClick={() => navigate("complaint-subcategory", { category: label })}
              className="flex flex-col items-center justify-center gap-2.5 py-8 rounded-2xl font-extrabold text-white text-base active:scale-95 transition-transform"
              style={{ background: NAVY }}>
              <span style={{ fontSize: 36 }}>{emoji}</span>{label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Complaint Subcategory ────────────────────────────────────────────
function ComplaintSubcategoryScreen({ category, navigate }: { category: string; navigate: (s: Screen, e?: any) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title={category} subtitle="불편 사항 접수" onBack={() => navigate("complaint-category")} />
      <div className="px-4 py-5 flex-1">
        <p className="text-sm font-medium mb-4" style={{ color: NAVY, opacity: 0.6 }}>구체적인 불편 내용을 선택해 주세요.</p>
        <div className="grid grid-cols-2 gap-3">
          {(SUBCATEGORIES[category] ?? []).map(item => (
            <button key={item} onClick={() => navigate("complaint-form", { category, subcategory: item })}
              className="flex items-center justify-center text-center py-6 px-3 rounded-2xl font-bold text-white text-sm leading-snug active:scale-95 transition-transform"
              style={{ background: item === "기타" ? "#6c7caa" : NAVY, minHeight: 80 }}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Complaint Form (Calendar) ───────────────────────────────────────
function ComplaintFormScreen({ category, subcategory, navigate }: {
  category: string; subcategory: string; navigate: (s: Screen, e?: any) => void;
}) {
  const [content, setContent] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const yr = 2026, mo = 8; // Sep 2026 (0-indexed)
  const firstDay = new Date(yr, mo, 1).getDay();
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  const toggle = (d: number) => setSelected(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d].sort((a, b) => a - b));

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title="불편 사항 접수" subtitle={`${category} > ${subcategory}`} onBack={() => navigate("complaint-subcategory", { category })} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Content */}
        <div className="rounded-2xl overflow-hidden border-2" style={{ borderColor: NAVY }}>
          <div className="px-4 pt-3 pb-2" style={{ background: NAVY }}>
            <span className="text-xs font-extrabold text-white opacity-70">하자 내용</span>
          </div>
          <textarea value={content} onChange={e => setContent(e.target.value)}
            placeholder="하자 내용을 구체적으로 작성해주세요."
            rows={4}
            className="w-full px-4 pt-3 pb-4 text-sm font-medium resize-none outline-none bg-white"
            style={{ color: NAVY }} />
        </div>
        {/* Photo */}
        <div className="rounded-2xl border-2 bg-white px-4 py-4" style={{ borderColor: NAVY }}>
          <div className="text-xs font-extrabold mb-3 opacity-60" style={{ color: NAVY }}>사진 첨부</div>
          <div className="flex gap-3">
            <button className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed active:scale-95 transition-transform"
              style={{ width: 72, height: 72, borderColor: NAVY, opacity: 0.5 }}>
              <IconCamera size={26} />
              <span style={{ fontSize: 10, fontWeight: 600, color: NAVY }}>사진 추가</span>
            </button>
            <button className="rounded-xl border-2 border-dashed flex items-center justify-center"
              style={{ width: 72, height: 72, borderColor: "#ddd", color: "#ccc", fontSize: 22 }}>＋</button>
          </div>
        </div>
        {/* Calendar */}
        <div className="rounded-2xl border-2 bg-white px-4 py-4" style={{ borderColor: NAVY }}>
          <div className="text-xs font-extrabold mb-3 opacity-60" style={{ color: NAVY }}>가능한 방문 날짜 (복수 선택)</div>
          <div className="font-extrabold text-sm text-center mb-3" style={{ color: NAVY }}>2026년 9월</div>
          <div className="grid grid-cols-7 mb-1">
            {["일","월","화","수","목","금","토"].map((d, i) => (
              <div key={d} className="text-center text-xs font-bold py-1"
                style={{ color: i === 0 ? "#e74c3c" : i === 6 ? "#2980b9" : NAVY, opacity: 0.5 }}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((d, i) => {
              const sel = d !== null && selected.includes(d);
              const past = d !== null && d < 12;
              return (
                <button key={i} disabled={d === null || past} onClick={() => d && !past && toggle(d)}
                  className="aspect-square flex items-center justify-center rounded-full text-xs font-bold transition-all mx-auto active:scale-90"
                  style={{ width: 32, height: 32, background: sel ? ORANGE : "transparent",
                    color: sel ? NAVY : d === null ? "transparent" : past ? "#ccc" : NAVY,
                    fontWeight: sel ? 800 : 500 }}>
                  {d ?? ""}
                </button>
              );
            })}
          </div>
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t" style={{ borderColor: "#eee" }}>
              {selected.map(d => (
                <button key={d} onClick={() => toggle(d)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold active:scale-95"
                  style={{ background: ORANGE, color: NAVY }}>
                  9/{d} <span style={{ opacity: 0.6 }}>✕</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="px-4 py-4 flex-shrink-0 border-t" style={{ background: IVORY, borderColor: "#eee" }}>
        <button onClick={() => navigate("home")}
          className="w-full py-4 rounded-2xl font-extrabold text-base active:scale-95 transition-transform"
          style={{ background: ORANGE, color: NAVY }}>
          접수하기
        </button>
      </div>
    </div>
  );
}

// ─── Screen: Community Board ──────────────────────────────────────────────────
function CommunityScreen({ navigate }: { navigate: (s: Screen, e?: any) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title="게시판" onBack={() => navigate("home")}
        rightEl={
          <button onClick={() => navigate("community-write")}
            className="ml-auto px-3 py-1.5 rounded-xl text-xs font-extrabold flex-shrink-0 active:scale-95"
            style={{ background: ORANGE, color: NAVY }}>+ 글쓰기</button>
        }
      />
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Notice */}
        <div className="px-4 pt-4">
          <div className="mb-2">
            <div className="font-extrabold text-base" style={{ color: NAVY }}>공지 게시판</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: NAVY, opacity: 0.38 }}>집주인만 작성할 수 있습니다</div>
          </div>
          <div className="flex flex-col gap-2.5">
            {NOTICE_POSTS.map(p => (
              <div key={p.id} className="rounded-2xl border-2 bg-white px-4 py-3.5" style={{ borderColor: NAVY }}>
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded flex-shrink-0 mt-0.5" style={{ background: "#fff0d4", color: ORANGE }}>공지</span>
                  <span className="font-bold text-sm leading-snug" style={{ color: NAVY }}>{p.title}</span>
                </div>
                <p className="text-xs font-medium leading-relaxed line-clamp-2 mb-1.5" style={{ color: NAVY, opacity: 0.5 }}>{p.preview}</p>
                <span className="text-xs" style={{ color: NAVY, opacity: 0.32 }}>{p.date}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Free */}
        <div className="px-4 pt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="font-extrabold text-base" style={{ color: NAVY }}>자유 게시판</div>
          </div>
          <div className="flex flex-col gap-2.5">
            {FREE_POSTS.map(p => (
              <button key={p.id} onClick={() => navigate("community-detail", { post: p })}
                className="w-full text-left rounded-2xl border-2 bg-white px-4 py-3.5 active:scale-[0.98] transition-transform"
                style={{ borderColor: NAVY }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded" style={{ background: "#eef0fa", color: NAVY }}>{p.author}</span>
                  <span className="text-xs" style={{ color: NAVY, opacity: 0.32 }}>{p.date}</span>
                </div>
                <div className="font-bold text-sm leading-snug mb-2" style={{ color: NAVY }}>{p.title}</div>
                <div className="flex items-center gap-3 text-xs" style={{ color: NAVY, opacity: 0.42 }}>
                  <span>💬 {p.comments.length}</span><span>❤️ {p.likes}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Community Write ──────────────────────────────────────────────────
function CommunityWriteScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title="글쓰기" onBack={() => navigate("community")}
        rightEl={
          <button onClick={() => navigate("community")}
            className="ml-auto text-sm font-extrabold px-1 active:scale-95 flex-shrink-0"
            style={{ color: ORANGE }}>등록</button>
        }
      />
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Title */}
        <div className="px-4 pt-4 pb-0">
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요."
            className="w-full text-base font-extrabold outline-none pb-3 border-b-2"
            style={{ color: NAVY, borderColor: NAVY, background: "transparent" }} />
        </div>
        {/* Body */}
        <div className="px-4 pt-4 flex-1">
          <textarea value={body} onChange={e => setBody(e.target.value)}
            placeholder="내용을 작성해주세요."
            className="w-full h-full min-h-[180px] text-sm font-medium resize-none outline-none"
            style={{ color: NAVY, background: "transparent" }} />
        </div>
        {/* Photo */}
        <div className="px-4 pb-6">
          <button className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed active:scale-95 transition-transform"
            style={{ width: 80, height: 80, borderColor: NAVY, opacity: 0.45 }}>
            <IconCamera size={26} />
            <span style={{ fontSize: 10, fontWeight: 600, color: NAVY }}>사진 추가</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Community Detail ─────────────────────────────────────────────────
function CommunityDetailScreen({ post, navigate }: { post: typeof FREE_POSTS[0]; navigate: (s: Screen) => void }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [comment, setComment] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleLike = () => {
    setLiked(l => !l);
    setLikeCount(c => liked ? c - 1 : c + 1);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title="게시글" onBack={() => navigate("community")} />
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-2">
        {/* Author + meta */}
        <div className="flex items-center gap-2.5 mb-3">
          <AvatarIcon label={post.author} size={36} />
          <div>
            <div className="font-extrabold text-sm" style={{ color: NAVY }}>{post.author}</div>
            <div className="text-xs" style={{ color: NAVY, opacity: 0.38 }}>{post.date}</div>
          </div>
        </div>
        {/* Title */}
        <div className="font-extrabold text-lg leading-snug mb-3" style={{ color: NAVY }}>{post.title}</div>
        {/* Body */}
        <p className="text-sm font-medium leading-relaxed whitespace-pre-line mb-4" style={{ color: NAVY, opacity: 0.8 }}>{post.body}</p>
        {/* Photo placeholder */}
        {post.hasPhoto && (
          <div className="rounded-2xl mb-4 flex items-center justify-center"
            style={{ height: 160, background: "#eef0fa", border: `1.5px solid ${NAVY}20` }}>
            <span style={{ fontSize: 40 }}>🖼️</span>
          </div>
        )}
        {/* Like / comment buttons */}
        <div className="flex items-center gap-4 py-3 border-t border-b mb-4" style={{ borderColor: "#eee" }}>
          <button onClick={toggleLike} className="flex items-center gap-1.5 active:scale-95 transition-transform">
            <IconHeart filled={liked} size={22} />
            <span className="text-sm font-bold" style={{ color: liked ? ORANGE : NAVY, opacity: liked ? 1 : 0.55 }}>{likeCount}</span>
          </button>
          <button onClick={() => inputRef.current?.focus()} className="flex items-center gap-1.5 active:scale-95 transition-transform">
            <IconComment size={22} />
            <span className="text-sm font-bold" style={{ color: NAVY, opacity: 0.55 }}>{post.comments.length}</span>
          </button>
        </div>
        {/* Comments */}
        <div className="flex flex-col gap-3 pb-2">
          {post.comments.map(c => (
            <div key={c.id} className="flex gap-2.5">
              <AvatarIcon label={c.author} size={30} />
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-extrabold" style={{ color: NAVY }}>{c.author}</span>
                  <span className="text-xs" style={{ color: NAVY, opacity: 0.32 }}>{c.time}</span>
                </div>
                <p className="text-sm font-medium leading-snug mt-0.5" style={{ color: NAVY, opacity: 0.8 }}>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Fixed comment input */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 border-t" style={{ background: "white", borderColor: "#eee" }}>
        <input ref={inputRef} value={comment} onChange={e => setComment(e.target.value)}
          placeholder="댓글을 입력하세요..."
          className="flex-1 text-sm font-medium outline-none rounded-xl px-3 py-2.5"
          style={{ background: "#f4f4f8", color: NAVY }} />
        <button onClick={() => setComment("")}
          className="px-4 py-2.5 rounded-xl text-xs font-extrabold active:scale-95 transition-transform flex-shrink-0"
          style={{ background: NAVY, color: "white" }}>등록</button>
      </div>
    </div>
  );
}

// ─── Screen: Fee Detail ───────────────────────────────────────────────────────
function FeeDetailScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [idx, setIdx] = useState(FEE_MONTHS.length - 1);
  const key = FEE_MONTHS[idx];
  const [y, m] = key.split("-");
  const fee = FEE_DATA[key];

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title="관리비 및 월세" onBack={() => navigate("home")} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Month nav */}
        <div className="flex items-center justify-between">
          <button onClick={() => setIdx(i => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all"
            style={{ background: NAVY, opacity: idx === 0 ? 0.25 : 1 }}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M11 4L6 9L11 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" /></svg>
          </button>
          <span className="font-extrabold text-base" style={{ color: NAVY }}>{y}년 {m}월</span>
          <button onClick={() => setIdx(i => Math.min(FEE_MONTHS.length - 1, i + 1))}
            disabled={idx === FEE_MONTHS.length - 1}
            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all"
            style={{ background: NAVY, opacity: idx === FEE_MONTHS.length - 1 ? 0.25 : 1 }}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M7 4L12 9L7 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Fee card */}
        <div className="rounded-2xl border-2 bg-white px-5 py-5" style={{ borderColor: NAVY }}>
          <div className="flex items-start justify-between mb-3">
            <span className="font-extrabold text-sm" style={{ color: NAVY }}>{y}년 {m}월 청구서</span>
            {fee.paid
              ? <span className="text-xs font-extrabold px-3 py-1 rounded-full" style={{ background: "#e8f8ee", color: "#1f9e52" }}>완납</span>
              : <span className="text-xs font-extrabold px-3 py-1 rounded-full" style={{ background: "#ffeae0", color: "#d04a0a" }}>미납</span>
            }
          </div>
          <div className="font-black mb-4" style={{ fontSize: 36, color: NAVY, letterSpacing: -1 }}>{fee.total.toLocaleString()}원</div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl px-3 py-2.5" style={{ background: "#eef0fa" }}>
              <div className="text-xs font-medium mb-0.5 opacity-50" style={{ color: NAVY }}>월세</div>
              <div className="font-bold text-sm" style={{ color: NAVY }}>{fee.rent.toLocaleString()}원</div>
            </div>
            <div className="rounded-xl px-3 py-2.5" style={{ background: "#eef0fa" }}>
              <div className="text-xs font-medium mb-0.5 opacity-50" style={{ color: NAVY }}>관리비</div>
              <div className="font-bold text-sm" style={{ color: NAVY }}>{fee.manage.toLocaleString()}원</div>
            </div>
          </div>
          <div className="border-t pt-3 flex flex-col gap-2" style={{ borderColor: "#eee" }}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium opacity-55" style={{ color: NAVY }}>납부 기한</span>
              <span className="font-bold text-xs" style={{ color: NAVY }}>{fee.dueDate}</span>
            </div>
            {fee.paid
              ? <div className="flex justify-between items-center">
                  <span className="text-xs font-medium opacity-55" style={{ color: NAVY }}>납부 완료일</span>
                  <span className="font-bold text-xs" style={{ color: "#1f9e52" }}>{fee.paidDate}</span>
                </div>
              : <div className="flex justify-between items-center">
                  <span className="text-xs font-medium opacity-55" style={{ color: NAVY }}>납부까지</span>
                  <span className="font-bold text-base" style={{ color: fee.dDay! <= 3 ? "#d04a0a" : NAVY }}>
                    {(fee.dDay ?? 0) >= 0 ? `D-${fee.dDay}` : `D+${Math.abs(fee.dDay!)}`}
                  </span>
                </div>
            }
          </div>
        </div>

        {/* Breakdown */}
        <div className="rounded-2xl border-2 bg-white px-4 py-4" style={{ borderColor: NAVY }}>
          <div className="text-xs font-extrabold mb-3 opacity-55" style={{ color: NAVY }}>관리비 상세</div>
          {[
            { label: "일반관리비", amount: 15000 },
            { label: "청소비", amount: 8000 },
            { label: "수도료", amount: 12000 },
            { label: "전기료(공용)", amount: 6000 },
            { label: "승강기유지비", amount: 4000 },
          ].map(r => (
            <div key={r.label} className="flex justify-between py-2 border-b last:border-b-0" style={{ borderColor: "#f2f2f2" }}>
              <span className="text-sm font-medium opacity-70" style={{ color: NAVY }}>{r.label}</span>
              <span className="text-sm font-bold" style={{ color: NAVY }}>{r.amount.toLocaleString()}원</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [extra, setExtra] = useState<any>({});

  const navigate = (s: Screen, e?: any) => { setScreen(s); if (e !== undefined) setExtra(e); };

  const render = () => {
    switch (screen) {
      case "home":                     return <HomeScreen navigate={navigate} />;
      case "complaint-history":        return <ComplaintHistoryScreen navigate={navigate} />;
      case "complaint-history-detail": return <ComplaintHistoryDetailScreen item={extra.item ?? HISTORY_ITEMS[0]} navigate={navigate} />;
      case "complaint-category":       return <ComplaintCategoryScreen navigate={navigate} />;
      case "complaint-subcategory":    return <ComplaintSubcategoryScreen category={extra.category ?? "거실"} navigate={navigate} />;
      case "complaint-form":           return <ComplaintFormScreen category={extra.category ?? "거실"} subcategory={extra.subcategory ?? "기타"} navigate={navigate} />;
      case "community":                return <CommunityScreen navigate={navigate} />;
      case "community-write":          return <CommunityWriteScreen navigate={navigate} />;
      case "community-detail":         return <CommunityDetailScreen post={extra.post ?? FREE_POSTS[0]} navigate={navigate} />;
      case "fee-detail":               return <FeeDetailScreen navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8" style={{ background: "#d0ccc6" }}>
      <div className="relative flex flex-col overflow-hidden"
        style={{ width: 375, height: 812, background: IVORY, borderRadius: 44,
          boxShadow: "0 40px 100px rgba(53,62,108,0.28), 0 2px 12px rgba(53,62,108,0.12)" }}>
        {render()}
      </div>
    </div>
  );
}
