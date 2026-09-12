import { useState } from "react";
import { NAVY, ORANGE, IVORY } from "../../theme";
import { NavHeader } from "../../ui";
import { IconCamera } from "../../icons";
import { useAppData } from "../../store";
import { CURRENT_TENANT } from "../../data";
import type { TenantNavigate } from "./types";

export default function CommunityWriteScreen({ navigate }: { navigate: TenantNavigate }) {
  const { addFreePost } = useAppData();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const submit = () => {
    if (!title.trim() || !body.trim()) return;
    addFreePost({ author: `${CURRENT_TENANT.unitNumber}호`, title: title.trim(), body: body.trim() });
    navigate("community");
  };

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader
        title="글쓰기"
        onBack={() => navigate("community")}
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
