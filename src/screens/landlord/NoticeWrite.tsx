import { useState } from "react";
import { NAVY, ORANGE, IVORY } from "../../theme";
import { NavHeader } from "../../ui";
import { IconCamera } from "../../icons";
import { useAppData } from "../../store";
import type { LandlordNavigate } from "./types";

export default function NoticeWriteScreen({ navigate }: { navigate: LandlordNavigate }) {
  const { addNotice } = useAppData();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submit = () => {
    if (!title.trim() || !content.trim()) return;
    addNotice({ title: title.trim(), content: content.trim() });
    navigate("notice-manage");
  };

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader
        title="공지 작성"
        onBack={() => navigate("notice-manage")}
        rightEl={
          <button onClick={submit} className="ml-auto text-sm font-extrabold px-1 active:scale-95 flex-shrink-0" style={{ color: ORANGE }}>
            등록
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
