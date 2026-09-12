import { useState } from "react";
import { NAVY, ORANGE, IVORY } from "../../theme";
import { NavHeader, Toast } from "../../ui";
import { IconCamera } from "../../icons";
import { useAppData } from "../../store";
import type { LandlordNavigate } from "./types";

export default function NoticeWriteScreen({ buildingId, navigate }: { buildingId: number; navigate: LandlordNavigate }) {
  const { addNotice } = useAppData();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const submit = async () => {
    if (!title.trim() || !content.trim() || submitting) return;
    setSubmitting(true);
    try {
      await addNotice({ title: title.trim(), content: content.trim(), buildingId });
      setShowToast(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative" style={{ background: IVORY }}>
      {showToast && <Toast message="공지가 등록되었습니다." onClose={() => navigate("notice-manage", { buildingId })} />}
      <NavHeader
        title="공지 작성"
        onBack={() => navigate("notice-manage", { buildingId })}
        rightEl={
          <button onClick={submit} disabled={submitting} className="ml-auto text-sm font-extrabold px-1 active:scale-95 flex-shrink-0" style={{ color: ORANGE, opacity: submitting ? 0.5 : 1 }}>
            {submitting ? "등록 중..." : "등록"}
          </button>
        }
      />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="px-4 pt-4 pb-0">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="공지 제목을 입력해주세요."
            className="w-full text-base font-extrabold outline-none pb-3 border-b-2"
            style={{ color: NAVY, borderColor: NAVY, background: "transparent" }}
          />
        </div>
        <div className="px-4 pt-4 flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="세입자들에게 전달할 내용을 작성해주세요."
            className="w-full h-full min-h-[180px] text-sm font-medium resize-none outline-none"
            style={{ color: NAVY, background: "transparent" }}
          />
        </div>
        <div className="px-4 pb-6">
          <button
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed active:scale-95 transition-transform"
            style={{ width: 80, height: 80, borderColor: NAVY, opacity: 0.45 }}
          >
            <IconCamera size={26} />
            <span style={{ fontSize: 10, fontWeight: 600, color: NAVY }}>사진 추가</span>
          </button>
        </div>
      </div>
    </div>
  );
}
