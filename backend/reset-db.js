// ─── 데모용 DB 초기화 스크립트 ───────────────────────────────────────────────
// `npm run reset-db`로 실행합니다. backend/data.sqlite(+ WAL 보조 파일)를
// 지워서, 다음에 `npm run server`로 서버를 다시 켰을 때 db.js가 시드
// 데이터(PRD 11장 기준)로 처음 상태를 새로 만들도록 합니다.
//
// 평소에는 서버를 껐다 켜도 데이터가 그대로 남아있어야 하므로(요청사항),
// "리셋"은 이 스크립트를 실행했을 때만 일어나는 명시적인 동작입니다 —
// 단순히 서버 프로세스를 재시작한다고 자동으로 초기화되지 않습니다.

import { existsSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const files = ["data.sqlite", "data.sqlite-shm", "data.sqlite-wal"].map((f) => path.join(__dirname, f));

let removed = 0;
for (const f of files) {
  if (existsSync(f)) {
    rmSync(f);
    removed++;
    console.log(`[reset-db] 삭제됨: ${path.basename(f)}`);
  }
}

// 사용자가 접수/게시글에 첨부한 사진 파일도 시드 데이터가 아니므로 함께 지웁니다.
const uploadsDir = path.join(__dirname, "uploads");
if (existsSync(uploadsDir)) {
  const photoFiles = readdirSync(uploadsDir).filter((f) => f !== ".gitkeep");
  for (const f of photoFiles) {
    rmSync(path.join(uploadsDir, f));
    removed++;
  }
  if (photoFiles.length > 0) console.log(`[reset-db] 첨부 사진 ${photoFiles.length}개 삭제됨`);
}

if (removed === 0) {
  console.log("[reset-db] 이미 초기 상태입니다 (데이터 파일 없음).");
} else {
  console.log("[reset-db] 완료. 다음에 `npm run server`를 실행하면 시드 데이터로 새로 시작합니다.");
}
