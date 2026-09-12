import { NAVY, IVORY } from "../../theme";
import { NavHeader } from "../../ui";
import { CATEGORIES } from "../../data";
import type { TenantNavigate } from "./types";

export default function ComplaintCategoryScreen({ navigate }: { navigate: TenantNavigate }) {
  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title="불편 사항 접수" onBack={() => navigate("home")} />
      <div className="px-4 py-5 flex-1">
        <p className="text-sm font-medium mb-4" style={{ color: NAVY, opacity: 0.6 }}>
          어느 공간의 불편사항인지 선택해 주세요.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(({ label, emoji }) => (
            <button
              key={label}
              onClick={() => navigate("complaint-subcategory", { category: label })}
              className="flex flex-col items-center justify-center gap-2.5 py-8 rounded-2xl font-extrabold text-white text-base active:scale-95 transition-transform"
              style={{ background: NAVY }}
            >
              <span style={{ fontSize: 36 }}>{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
