import { useState } from "react";
import { NAVY, ORANGE, IVORY } from "../../theme";
import { NavHeader, Card } from "../../ui";
import { useAppData } from "../../store";
import type { LandlordNavigate } from "./types";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const UNAVAILABLE = [3, 4, 10, 11, 13, 17, 18, 24, 25];
const CALENDAR_DATES = Array.from({ length: 35 }, (_, i) => {
  const d = i - 2;
  if (d < 1 || d > 30) return null;
  return { day: d, available: !UNAVAILABLE.includes(d) };
});

export default function MeetingScheduler({ unitNumber, complaintId, navigate }: { unitNumber: string; complaintId: number; navigate: LandlordNavigate }) {
  const { complaints, updateComplaintStatus } = useAppData();
  const complaint = complaints.find((c) => c.id === complaintId);
  const [selectedDay, setSelectedDay] = useState<number | null>(complaint?.visitDays[0] ?? null);
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!selectedDay || !message.trim()) return;
    updateComplaintStatus(complaintId, "확인중", message.trim());
    setConfirmed(true);
    setTimeout(() => navigate("request-log", { unitNumber }), 1200);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title="방문 일정 조율" onBack={() => navigate("requests-received", { unitNumber })} />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        <div className="rounded-xl px-4 py-3" style={{ background: "#eef0fa" }}>
          <p className="text-xs" style={{ color: NAVY, opacity: 0.5 }}>
            요청 건
          </p>
          <p className="text-sm font-bold mt-0.5" style={{ color: NAVY }}>
            {complaint ? `${complaint.category} > ${complaint.subcategory}` : "하자신청"}
          </p>
          {complaint && complaint.visitDays.length > 0 && (
            <p className="text-xs mt-1" style={{ color: NAVY, opacity: 0.5 }}>
              세입자 희망일: {complaint.visitDays.map((d) => `9/${d}`).join(", ")}
            </p>
          )}
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold" style={{ color: NAVY }}>
              2026년 9월
            </p>
            <div className="flex gap-3 text-xs" style={{ color: NAVY, opacity: 0.5 }}>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#dbeafe", display: "inline-block" }} />
                가능
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#fee2e2", display: "inline-block" }} />
                불가
              </span>
            </div>
          </div>
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-bold py-1" style={{ color: NAVY, opacity: 0.4 }}>
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {CALENDAR_DATES.map((d, i) => {
              if (!d) return <div key={i} />;
              const isSel = selectedDay === d.day;
              const isRequested = complaint?.visitDays.includes(d.day);
              return (
                <button
                  key={i}
                  onClick={() => d.available && setSelectedDay(d.day)}
                  disabled={!d.available}
                  className="aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-transform relative"
                  style={{
                    background: isSel ? ORANGE : d.available ? "#dbeafe" : "#fee2e2",
                    color: isSel ? NAVY : d.available ? NAVY : "#fca5a5",
                    transform: isSel ? "scale(1.08)" : "scale(1)",
                  }}
                >
                  {d.day}
                  {isRequested && !isSel && <span className="absolute bottom-0.5 w-1 h-1 rounded-full" style={{ background: ORANGE }} />}
                </button>
              );
            })}
          </div>
        </Card>

        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-2 px-1" style={{ color: NAVY, opacity: 0.4 }}>
            방문 일정 메시지
          </p>
          <Card className="p-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={selectedDay ? `9월 ${selectedDay}일 방문 예정입니다. 몇 시에 방문할지 알려주세요.` : "날짜를 먼저 선택해주세요."}
              disabled={!selectedDay}
              className="w-full h-24 text-sm resize-none outline-none"
              style={{ color: NAVY, background: "transparent", border: "none" }}
            />
          </Card>
        </div>

        {selectedDay && (
          <div className="rounded-xl px-4 py-3" style={{ background: "#fff0d4" }}>
            <p className="text-sm font-medium" style={{ color: "#8a6a30" }}>
              9월 {selectedDay}일 선택됨
            </p>
          </div>
        )}
      </div>

      <div className="px-4 pb-8 pt-3 bg-white" style={{ borderTop: "1px solid #e8e2d8" }}>
        {confirmed ? (
          <div className="rounded-xl py-3.5 text-center" style={{ background: "#e8f8ee" }}>
            <p className="text-sm font-bold" style={{ color: "#1f9e52" }}>일정이 확정되었습니다 ✓</p>
          </div>
        ) : (
          <button
            onClick={handleConfirm}
            disabled={!selectedDay || !message.trim()}
            className="w-full font-extrabold rounded-2xl py-4 text-sm active:scale-95 transition-transform"
            style={{ background: selectedDay && message.trim() ? NAVY : "#ede8df", color: selectedDay && message.trim() ? "#fff" : "#a8a29a" }}
          >
            {selectedDay ? `9월 ${selectedDay}일로 확정하기` : "날짜를 선택하세요"}
          </button>
        )}
      </div>
    </div>
  );
}
