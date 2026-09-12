// ─── 사진 첨부 유틸 ──────────────────────────────────────────────────────────
// 사용자가 고른 이미지 파일을 서버로 보내기 전에 브라우저에서 먼저 리사이즈 ·
// 압축해서 base64 data URL로 바꿔줍니다. 휴대폰 사진 원본(수 MB)을 그대로
// 보내면 요청이 무거워지므로, 긴 변 기준 최대 1080px / JPEG 품질 0.82로
// 줄여서 보통 수백 KB 이하로 만듭니다. (백엔드는 새 npm 의존성 없이 이 base64
// data URL을 받아 디코딩해 backend/uploads/에 실제 파일로 저장합니다.)

export const MAX_PHOTOS = 4;

export function resizeImageToDataUrl(file: File, maxDim = 1080, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("이미지를 읽는 데 실패했습니다."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("이미지를 불러오지 못했습니다."));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("이미지를 처리하지 못했습니다."));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function resizeImagesToDataUrls(files: FileList | File[]): Promise<string[]> {
  const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
  return Promise.all(list.map((f) => resizeImageToDataUrl(f)));
}
