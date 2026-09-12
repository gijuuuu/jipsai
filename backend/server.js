// ─── 백엔드 REST API 서버 ───────────────────────────────────────────────────
// 프레임워크 없이 node:http만으로 작성했습니다 (이 세션은 npm 레지스트리에
// 접근할 수 없어 express 등을 설치할 수 없었습니다 — 사용자 환경에서는
// `node backend/server.js` 한 줄이면 그대로 실행됩니다).
//
// PRD 12장 API 명세를 기준으로 하되, 실제 프론트엔드(자유 게시판 익명/호실
// 선택, 하트 좋아요, 청구서 납부완료 처리, 하자신청 세입자 완료처리)에 맞춰
// 약간 확장했습니다. 모든 쓰기는 backend/data.sqlite에 즉시 반영되어
// 서버를 재시작하거나 프론트를 새로고침해도 사라지지 않습니다.

import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import { db } from "./db.js";

const PORT = Number(process.env.API_PORT || 4000);

// ─── 사진 첨부(파일 업로드) ─────────────────────────────────────────────────
// 새 npm 의존성 없이(multipart 파서 없이) 처리하기 위해, 프론트에서 사진을
// base64 data URL 문자열로 인코딩해 JSON body에 담아 보내면, 여기서 디코딩해
// backend/uploads/ 디렉터리에 실제 파일로 저장하고 그 경로("/uploads/xxx.jpg")만
// DB에 남깁니다. 정적 파일 응답은 아래 GET /uploads/:file 라우트가 담당합니다.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "uploads");
mkdirSync(UPLOADS_DIR, { recursive: true });

const DATA_URL_RE = /^data:image\/(png|jpe?g|webp|gif);base64,([a-zA-Z0-9+/=]+)$/;
const EXT_BY_MIME = { png: "png", jpg: "jpg", jpeg: "jpg", webp: "webp", gif: "gif" };
const CONTENT_TYPE_BY_EXT = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" };

function saveImageDataUrl(dataUrl) {
  if (typeof dataUrl !== "string") return null;
  const match = dataUrl.match(DATA_URL_RE);
  if (!match) return null; // 이미 "/uploads/..." 형태(수정 없이 재전송된 기존 사진)면 그대로 통과시키지 않고 무시
  const ext = EXT_BY_MIME[match[1].toLowerCase()] ?? "jpg";
  const buffer = Buffer.from(match[2], "base64");
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  writeFileSync(path.join(UPLOADS_DIR, filename), buffer);
  return `/uploads/${filename}`;
}

function saveImages(photos) {
  if (!Array.isArray(photos)) return [];
  const saved = [];
  for (const p of photos) {
    if (typeof p === "string" && p.startsWith("/uploads/")) {
      saved.push(p); // 이미 저장된 사진 경로(그대로 유지)
    } else {
      const url = saveImageDataUrl(p);
      if (url) saved.push(url);
    }
  }
  return saved;
}

// ─── 유틸 ───────────────────────────────────────────────────────────────────
function todayLabel() {
  // "2026.09.12" 형식 (한국 시간 기준)
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}.${get("month")}.${get("day")}`;
}

function todayIso() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(payload);
}

function sendError(res, status, message) {
  sendJson(res, status, { error: message });
}

// 사진을 base64로 실어 보내면 원본보다 용량이 커지므로(약 1.33배) 여유 있게
// 25MB까지 허용합니다 (프론트에서 업로드 전에 사진을 리사이즈/압축하므로
// 실제로는 이보다 훨씬 작게 옵니다).
const MAX_BODY_BYTES = 25 * 1024 * 1024;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    let tooLarge = false;
    req.on("data", (chunk) => {
      if (tooLarge) return;
      raw += chunk;
      if (raw.length > MAX_BODY_BYTES) {
        tooLarge = true;
        reject(new Error("요청 용량이 너무 큽니다. 사진 개수나 용량을 줄여주세요."));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (tooLarge) return;
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("잘못된 JSON 형식입니다."));
      }
    });
    req.on("error", (err) => {
      if (!tooLarge) reject(err);
    });
  });
}

// ─── row -> API 응답 형태로 변환 ────────────────────────────────────────────
function complaintRow(r) {
  return {
    id: r.id,
    unitNumber: r.unit_number,
    tenantName: r.tenant_name,
    category: r.category,
    subcategory: r.subcategory,
    emoji: r.emoji,
    description: r.description,
    visitDays: JSON.parse(r.visit_days),
    createdAt: r.created_at,
    status: r.status,
    memo: r.memo,
    timeline: JSON.parse(r.timeline),
    photos: JSON.parse(r.photos ?? "[]"),
  };
}

function noticeRow(r) {
  return { id: r.id, buildingId: r.building_id, title: r.title, content: r.content, date: r.date };
}

function feeRow(r) {
  return {
    id: r.id,
    unitNumber: r.unit_number,
    yearMonth: r.year_month,
    rent: r.rent,
    managementFee: r.management_fee,
    dueDate: r.due_date,
    status: r.status,
    paidDate: r.paid_date ?? undefined,
  };
}

function commentRow(r) {
  return { id: r.id, author: r.author, text: r.text, time: r.time };
}

function postRow(r, tenantId) {
  const comments = db.prepare(`SELECT * FROM comments WHERE post_id = ? ORDER BY id ASC`).all(r.id).map(commentRow);
  const likes = db.prepare(`SELECT COUNT(*) AS n FROM post_likes WHERE post_id = ?`).get(r.id).n;
  const likedByMe = tenantId
    ? !!db.prepare(`SELECT 1 FROM post_likes WHERE post_id = ? AND tenant_id = ?`).get(r.id, tenantId)
    : false;
  return {
    id: r.id,
    author: r.author,
    isAnonymous: !!r.is_anonymous,
    unitNumber: r.unit_number,
    title: r.title,
    body: r.body,
    date: r.date,
    hasPhoto: !!r.has_photo,
    photos: JSON.parse(r.photos ?? "[]"),
    likes,
    likedByMe,
    comments,
  };
}

const STATUS_ORDER = ["접수됨", "확인중", "처리중", "완료"];

// ─── 라우팅 ─────────────────────────────────────────────────────────────────
const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const { pathname } = url;
  const method = req.method ?? "GET";

  try {
    // GET /api/health
    if (method === "GET" && pathname === "/api/health") {
      return sendJson(res, 200, { ok: true });
    }

    // ── 업로드된 사진 정적 파일 서빙 ─────────────────────────────────────────
    if (method === "GET" && pathname.startsWith("/uploads/")) {
      const filename = path.basename(pathname); // 경로 조작(../) 방지 — 파일명만 취급
      const filePath = path.join(UPLOADS_DIR, filename);
      if (!filePath.startsWith(UPLOADS_DIR) || !existsSync(filePath)) {
        res.writeHead(404, { "Access-Control-Allow-Origin": "*" });
        return res.end("이미지를 찾을 수 없습니다.");
      }
      const ext = path.extname(filename).toLowerCase();
      const contentType = CONTENT_TYPE_BY_EXT[ext] ?? "application/octet-stream";
      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      });
      return res.end(readFileSync(filePath));
    }

    // ── 불편사항(하자신청) ──────────────────────────────────────────────────
    if (method === "GET" && pathname === "/api/complaints") {
      const unitNumber = url.searchParams.get("unitNumber");
      let rows = db.prepare(`SELECT * FROM complaints ORDER BY id DESC`).all();
      if (unitNumber) rows = rows.filter((r) => r.unit_number === unitNumber);
      return sendJson(res, 200, rows.map(complaintRow));
    }

    if (method === "POST" && pathname === "/api/complaints") {
      const body = await readBody(req);
      const { unitNumber, tenantName, category, subcategory, emoji, description, visitDays, photos } = body;
      if (!unitNumber || !tenantName || !category || !subcategory || !description) {
        return sendError(res, 400, "unitNumber, tenantName, category, subcategory, description는 필수입니다.");
      }
      const createdAt = todayLabel();
      const timeline = [`${createdAt} 접수됨`];
      const savedPhotos = saveImages(photos);
      const info = db
        .prepare(
          `INSERT INTO complaints (unit_number, tenant_name, category, subcategory, emoji, description, visit_days, created_at, status, memo, timeline, photos)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, '접수됨', NULL, ?, ?)`
        )
        .run(
          unitNumber,
          tenantName,
          category,
          subcategory,
          emoji ?? "📝",
          description,
          JSON.stringify(Array.isArray(visitDays) ? visitDays : []),
          createdAt,
          JSON.stringify(timeline),
          JSON.stringify(savedPhotos)
        );
      const row = db.prepare(`SELECT * FROM complaints WHERE id = ?`).get(Number(info.lastInsertRowid));
      return sendJson(res, 201, complaintRow(row));
    }

    const complaintMatch = pathname.match(/^\/api\/complaints\/(\d+)$/);
    if (method === "PATCH" && complaintMatch) {
      const id = Number(complaintMatch[1]);
      const existing = db.prepare(`SELECT * FROM complaints WHERE id = ?`).get(id);
      if (!existing) return sendError(res, 404, "해당 접수 내역을 찾을 수 없습니다.");

      const body = await readBody(req);
      const { status, memo, actor } = body;
      if (status && !STATUS_ORDER.includes(status)) {
        return sendError(res, 400, `status는 ${STATUS_ORDER.join(", ")} 중 하나여야 합니다.`);
      }
      // 세입자는 '완료' 처리만 할 수 있고, 아직 집주인이 확인하지 않은(접수됨) 건은 완료 처리할 수 없습니다.
      if (actor === "tenant") {
        if (status !== "완료") return sendError(res, 403, "세입자는 처리 완료 처리만 할 수 있습니다.");
        if (existing.status === "접수됨") return sendError(res, 409, "아직 집주인이 확인하지 않은 접수건입니다.");
      }

      const nextStatus = status ?? existing.status;
      const nextMemo = memo !== undefined ? memo : existing.memo;
      const timeline = JSON.parse(existing.timeline);
      if (status && status !== existing.status) {
        timeline.push(`${todayLabel()} ${status}`);
      }
      db.prepare(`UPDATE complaints SET status = ?, memo = ?, timeline = ? WHERE id = ?`).run(
        nextStatus,
        nextMemo,
        JSON.stringify(timeline),
        id
      );
      const row = db.prepare(`SELECT * FROM complaints WHERE id = ?`).get(id);
      return sendJson(res, 200, complaintRow(row));
    }

    // ── 공지 ────────────────────────────────────────────────────────────────
    if (method === "GET" && pathname === "/api/notices") {
      const buildingId = url.searchParams.get("buildingId");
      let rows = db.prepare(`SELECT * FROM notices ORDER BY id DESC`).all();
      if (buildingId) rows = rows.filter((r) => r.building_id === Number(buildingId));
      return sendJson(res, 200, rows.map(noticeRow));
    }

    if (method === "POST" && pathname === "/api/notices") {
      const body = await readBody(req);
      const { title, content, buildingId } = body;
      if (!title?.trim() || !content?.trim() || !buildingId) return sendError(res, 400, "title, content, buildingId는 필수입니다.");
      const date = todayLabel();
      const info = db
        .prepare(`INSERT INTO notices (building_id, title, content, date) VALUES (?, ?, ?, ?)`)
        .run(Number(buildingId), title.trim(), content.trim(), date);
      const row = db.prepare(`SELECT * FROM notices WHERE id = ?`).get(Number(info.lastInsertRowid));
      return sendJson(res, 201, noticeRow(row));
    }

    // ── 커뮤니티 게시판 ─────────────────────────────────────────────────────
    if (method === "GET" && pathname === "/api/posts") {
      const tenantId = url.searchParams.get("tenantId") ?? undefined;
      const rows = db.prepare(`SELECT * FROM posts ORDER BY id DESC`).all();
      return sendJson(res, 200, rows.map((r) => postRow(r, tenantId)));
    }

    if (method === "POST" && pathname === "/api/posts") {
      const body = await readBody(req);
      const { title, body: content, isAnonymous, unitNumber, photos } = body;
      if (!title?.trim() || !content?.trim() || !unitNumber) {
        return sendError(res, 400, "title, body, unitNumber는 필수입니다.");
      }
      const anon = isAnonymous !== false; // 기본값: 익명
      const author = anon ? "익명" : `${unitNumber}호`;
      const date = todayLabel();
      const savedPhotos = saveImages(photos);
      const info = db
        .prepare(`INSERT INTO posts (author, is_anonymous, unit_number, title, body, date, has_photo, photos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(author, anon ? 1 : 0, unitNumber, title.trim(), content.trim(), date, savedPhotos.length > 0 ? 1 : 0, JSON.stringify(savedPhotos));
      const row = db.prepare(`SELECT * FROM posts WHERE id = ?`).get(Number(info.lastInsertRowid));
      return sendJson(res, 201, postRow(row, undefined));
    }

    const commentMatch = pathname.match(/^\/api\/posts\/(\d+)\/comments$/);
    if (method === "GET" && commentMatch) {
      const postId = Number(commentMatch[1]);
      const rows = db.prepare(`SELECT * FROM comments WHERE post_id = ? ORDER BY id ASC`).all(postId);
      return sendJson(res, 200, rows.map(commentRow));
    }
    if (method === "POST" && commentMatch) {
      const postId = Number(commentMatch[1]);
      const post = db.prepare(`SELECT * FROM posts WHERE id = ?`).get(postId);
      if (!post) return sendError(res, 404, "해당 게시글을 찾을 수 없습니다.");
      const body = await readBody(req);
      const { author, text } = body;
      if (!author?.trim() || !text?.trim()) return sendError(res, 400, "author, text는 필수입니다.");
      const time = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
      db.prepare(`INSERT INTO comments (post_id, author, text, time) VALUES (?, ?, ?, ?)`).run(postId, author.trim(), text.trim(), time);
      const updated = db.prepare(`SELECT * FROM posts WHERE id = ?`).get(postId);
      return sendJson(res, 201, postRow(updated, undefined));
    }

    const likeMatch = pathname.match(/^\/api\/posts\/(\d+)\/like$/);
    if (method === "POST" && likeMatch) {
      const postId = Number(likeMatch[1]);
      const post = db.prepare(`SELECT * FROM posts WHERE id = ?`).get(postId);
      if (!post) return sendError(res, 404, "해당 게시글을 찾을 수 없습니다.");
      const body = await readBody(req);
      const tenantId = body.tenantId || "t1";
      const already = db.prepare(`SELECT 1 FROM post_likes WHERE post_id = ? AND tenant_id = ?`).get(postId, tenantId);
      if (already) {
        db.prepare(`DELETE FROM post_likes WHERE post_id = ? AND tenant_id = ?`).run(postId, tenantId);
      } else {
        db.prepare(`INSERT INTO post_likes (post_id, tenant_id) VALUES (?, ?)`).run(postId, tenantId);
      }
      const likes = db.prepare(`SELECT COUNT(*) AS n FROM post_likes WHERE post_id = ?`).get(postId).n;
      return sendJson(res, 200, { likes, liked: !already });
    }

    // ── 관리비 및 월세 ──────────────────────────────────────────────────────
    if (method === "GET" && pathname === "/api/fees") {
      const unitNumber = url.searchParams.get("unitNumber");
      let rows = db.prepare(`SELECT * FROM fees ORDER BY year_month ASC`).all();
      if (unitNumber) rows = rows.filter((r) => r.unit_number === unitNumber);
      return sendJson(res, 200, rows.map(feeRow));
    }

    if (method === "POST" && pathname === "/api/fees/pay") {
      const body = await readBody(req);
      const { unitNumber, yearMonth } = body;
      if (!unitNumber || !yearMonth) return sendError(res, 400, "unitNumber, yearMonth는 필수입니다.");
      const row = db.prepare(`SELECT * FROM fees WHERE unit_number = ? AND year_month = ?`).get(unitNumber, yearMonth);
      if (!row) return sendError(res, 404, "해당 청구서를 찾을 수 없습니다.");
      const paidDate = todayIso();
      db.prepare(`UPDATE fees SET status = 'paid', paid_date = ? WHERE id = ?`).run(paidDate, row.id);
      const updated = db.prepare(`SELECT * FROM fees WHERE id = ?`).get(row.id);
      return sendJson(res, 200, feeRow(updated));
    }

    return sendError(res, 404, "존재하지 않는 API입니다.");
  } catch (err) {
    console.error(err);
    return sendError(res, 500, err instanceof Error ? err.message : "서버 오류가 발생했습니다.");
  }
});

server.listen(PORT, () => {
  console.log(`[backend] API server listening on http://localhost:${PORT}`);
});
