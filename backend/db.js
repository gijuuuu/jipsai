// ─── SQLite 데이터 저장소 ───────────────────────────────────────────────────
// Node 22에 내장된 node:sqlite(DatabaseSync)만 사용합니다 — 이 세션에서는
// npm 레지스트리 접근이 막혀 있어 better-sqlite3 등 외부 패키지를 설치할 수
// 없었기 때문입니다. 사용자 환경(Node 22+)에서는 별도 설치 없이 그대로
// `node backend/server.js`로 실행됩니다.
//
// 앱을 재시작해도(=서버 프로세스를 껐다 켜도) 데이터가 사라지지 않도록
// backend/data.sqlite 파일에 저장하고, 파일이 없을 때만(최초 실행) 시드
// 데이터를 채웁니다. 이미 데이터가 있으면 시드를 다시 넣지 않습니다.

import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "data.sqlite");

export const db = new DatabaseSync(DB_PATH);

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unit_number TEXT NOT NULL,
    tenant_name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    emoji TEXT NOT NULL,
    description TEXT NOT NULL,
    visit_days TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT '접수됨',
    memo TEXT,
    timeline TEXT NOT NULL DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    building_id INTEGER NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    is_anonymous INTEGER NOT NULL DEFAULT 1,
    unit_number TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    date TEXT NOT NULL,
    has_photo INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    author TEXT NOT NULL,
    text TEXT NOT NULL,
    time TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS post_likes (
    post_id INTEGER NOT NULL,
    tenant_id TEXT NOT NULL,
    PRIMARY KEY (post_id, tenant_id)
  );

  CREATE TABLE IF NOT EXISTS fees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unit_number TEXT NOT NULL,
    year_month TEXT NOT NULL,
    rent INTEGER NOT NULL,
    management_fee INTEGER NOT NULL,
    due_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled',
    paid_date TEXT,
    UNIQUE (unit_number, year_month)
  );
`);

function count(table) {
  return db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n;
}

// ─── 시드 데이터 (PRD 11장 / 최초 실행 시에만 삽입) ─────────────────────────
if (count("complaints") === 0) {
  const insert = db.prepare(`
    INSERT INTO complaints (unit_number, tenant_name, category, subcategory, emoji, description, visit_days, created_at, status, memo, timeline)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insert.run(
    "101", "김세입", "거실", "천장/벽 누수", "🛋️",
    "거실 천장에서 물이 새고 있어요. 비 온 다음 날 더 심해집니다. 벽지도 누렇게 변해가고 있어서 빨리 처리 부탁드립니다.",
    JSON.stringify([14, 15]), "2026.09.02", "처리중",
    "확인했습니다. 다음 주 월요일 오전에 방문하겠습니다.",
    JSON.stringify(["2026.09.02 접수됨", "2026.09.03 확인중", "2026.09.05 처리중"])
  );
  insert.run(
    "101", "김세입", "화장실", "변기 누수", "🚿",
    "변기 뒤쪽에서 물이 조금씩 새고 있습니다.",
    JSON.stringify([]), "2026.08.25", "완료",
    "수리 완료되었습니다. 불편 드려서 죄송합니다.",
    JSON.stringify(["2026.08.25 접수됨", "2026.08.26 확인중", "2026.08.27 처리중", "2026.08.28 완료"])
  );
  insert.run(
    "202", "정세입", "방", "바닥 난방(보일러) 불량", "🛏️",
    "온도를 올려도 방이 따뜻해지지 않습니다.",
    JSON.stringify([]), "2026.09.11", "접수됨", null,
    JSON.stringify(["2026.09.11 접수됨"])
  );
}

if (count("notices") === 0) {
  const insert = db.prepare(`INSERT INTO notices (building_id, title, content, date) VALUES (?, ?, ?, ?)`);
  insert.run(1, "9월 정기 소독 안내", "9월 20일(토) 오전 9시부터 건물 전체 정기 소독이 진행됩니다. 세대 내 소독을 원하시면 미리 문을 열어두시거나 관리자에게 연락 바랍니다.", "2026.09.10");
  insert.run(1, "9월 관리비 고지서 발송 안내", "2026년 9월분 관리비 고지서가 발송되었습니다. 납부 기한은 9월 25일입니다.", "2026.09.01");
  insert.run(1, "공용 세탁기 사용 시간 안내", "공용 세탁기는 오전 8시부터 오후 10시까지만 사용 가능합니다.", "2026.08.20");
  insert.run(2, "행복빌라 주차장 재도색 안내", "9월 15일(화) 지하주차장 바닥 재도색 작업이 진행됩니다. 당일은 인근 공영주차장을 이용해주세요.", "2026.09.08");
}

if (count("posts") === 0) {
  const insertPost = db.prepare(`
    INSERT INTO posts (author, is_anonymous, unit_number, title, body, date, has_photo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertComment = db.prepare(`INSERT INTO comments (post_id, author, text, time) VALUES (?, ?, ?, ?)`);

  const p1 = insertPost.run("201호", 0, "201", "벌레 잡아주실 분 ㅠㅠ 사례합니다!", "얼마 전부터 방에 바퀴벌레 같은 벌레가 한 마리씩 나오고 있어요. 혹시 도와주실 수 있으신 분 계신가요? 사례는 꼭 하겠습니다!", "2026.09.11", 0);
  insertComment.run(Number(p1.lastInsertRowid), "302호", "저도 요즘 그런 거 같더라고요. 방역 요청 해보셨어요?", "09:32");
  insertComment.run(Number(p1.lastInsertRowid), "관리자", "이번 달 말에 공용 방역 예정입니다. 참고 부탁드립니다.", "10:15");
  insertComment.run(Number(p1.lastInsertRowid), "105호", "붕산가루 쓰면 좀 줄어요!", "11:00");
  // 좋아요 3개 시드(특정 세입자 귀속 없이 카운트만 유지하기 위해 가상 사용자로 기록)
  for (let i = 0; i < 3; i++) {
    db.prepare(`INSERT OR IGNORE INTO post_likes (post_id, tenant_id) VALUES (?, ?)`).run(Number(p1.lastInsertRowid), `seed-${i}`);
  }

  const p2 = insertPost.run("202호", 0, "202", "택배 문 앞에 두셔도 돼요~ 낮에 집에 있어요", "낮 시간에 주로 집에 있으니까 택배기사님이나 이웃분들이 문 앞에 두셔도 됩니다!", "2026.09.10", 0);
  insertComment.run(Number(p2.lastInsertRowid), "101호", "감사합니다~!", "14:00");
  for (let i = 0; i < 7; i++) {
    db.prepare(`INSERT OR IGNORE INTO post_likes (post_id, tenant_id) VALUES (?, ?)`).run(Number(p2.lastInsertRowid), `seed-${i}`);
  }
}

if (count("fees") === 0) {
  const insert = db.prepare(`
    INSERT INTO fees (unit_number, year_month, rent, management_fee, due_date, status, paid_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insert.run("101", "2026-07", 550000, 70000, "2026-07-25", "paid", "2026-07-22");
  insert.run("101", "2026-08", 550000, 70000, "2026-08-25", "paid", "2026-08-20");
  insert.run("101", "2026-09", 550000, 70000, "2026-09-25", "scheduled", null);
  insert.run("201", "2026-08", 600000, 65000, "2026-08-25", "paid", "2026-08-23");
  insert.run("201", "2026-09", 600000, 65000, "2026-09-25", "paid", "2026-09-05");
  insert.run("202", "2026-08", 520000, 60000, "2026-08-24", "paid", "2026-08-24");
  insert.run("202", "2026-09", 520000, 60000, "2026-09-25", "overdue", null);
  // 행복빌라(2번 건물) — 다건물 데모용
  insert.run("301", "2026-09", 480000, 50000, "2026-09-25", "paid", "2026-09-10");
  insert.run("302", "2026-09", 490000, 50000, "2026-09-25", "scheduled", null);
}
