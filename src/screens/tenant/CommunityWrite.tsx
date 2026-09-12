import { useState } from "react";
import { NAVY, ORANGE, IVORY } from "../../theme";
import { NavHeader, Toast, PhotoPicker } from "../../ui";
import { useAppData } from "../../store";
import { CURRENT_TENANT } from "../../data";
import type { TenantNavigate } from "./types";

export default function CommunityWriteScreen({ navigate }: { navigate: TenantNavigate }) {
  const { addFreePost } = useAppData();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(true); // 기본값: 익명
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const submit = async () => {
    if (!title.trim() || !body.trim() || submitting || submitted) return;
    setSubmitting(true);
    try {
      await addFreePost({ title: title.trim(), body: body.trim(), isAnonymous, unitNumber: CURRENT_TENANT.unitNumber, photos });
      setSubmitted(true);
      setShowToast(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative" style={{ background: IVORY }}>
      {showToast && <Toast message="글이 작성되었습니다." onClose={() => navigate("home")} />}
      <NavHeader
        title="글쓰기"
        onBack={() => navigate("community")}
        rightEl={
          <button
            onClick={submit}
            disabled={submitting || submitted}
            className="ml-auto text-sm font-extrabold px-1 active:scale-95 flex-shrink-0"
            style={{ color: ORANGE, opacity: submitting || submitted ? 0.5 : 1 }}
          >
            {submitting ? "등록 중..." : submitted ? "등록 완료" : "등록"}
          </button>
        }
      />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="px-4 pt-4 pb-0">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요."
            className="w-full text-base font-extrabold outline-none pb-3 border-b-2"
            style={{ color: NAVY, borderColor: NAVY, background: "transparent" }}
          />
        </div>
        <div className="px-4 pt-4 flex-1">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="내용을 작성해주세요."
            className="w-full h-full min-h-[180px] text-sm font-medium resize-none outline-none"
            style={{ color: NAVY, background: "transparent" }}
          />
        </div>
        <div className="px-4 pb-3">
          <PhotoPicker photos={photos} onChange={setPhotos} />
        </div>
        <div className="px-4 pb-6">
          <div className="flex items-center justify-between rounded-2xl border-2 bg-white px-4 py-3.5" style={{ borderColor: NAVY }}>
            <div>
              <p className="text-sm font-extrabold" style={{ color: NAVY }}>
                익명으로 작성
              </p>
              <p className="text-xs mt-0.5" style={{ color: NAVY, opacity: 0.5 }}>
                {isAnonymous ? "\"익명\"으로 표시돼요" : `\"${CURRENT_TENANT.unitNumber}호\"로 표시돼요`}
              </p>
            </div>
            <button
              onClick={() => setIsAnonymous((v) => !v)}
              aria-label="익명 작성 여부 전환"
              className="relative flex-shrink-0 rounded-full transition-colors"
              style={{ width: 48, height: 28, background: isAnonymous ? ORANGE : "#ddd6c8" }}
            >
              <span
                className="absolute top-0.5 rounded-full bg-white transition-transform"
                style={{ width: 22, height: 22, left: 3, transform: isAnonymous ? "translateX(20px)" : "translateX(0)", boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
