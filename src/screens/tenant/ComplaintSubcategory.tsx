import { NAVY, IVORY } from "../../theme";
import { NavHeader } from "../../ui";
import { SUBCATEGORIES, type ComplaintCategory } from "../../data";
import type { TenantNavigate } from "./types";

export default function ComplaintSubcategoryScreen({ category, navigate }: { category: ComplaintCategory; navigate: TenantNavigate }) {
  return (
    <div className="flex flex-col h-full" style={{ background: IVORY }}>
      <NavHeader title={category} subtitle="불편 사항 접수" onBack={() => navigate("complaint-category")} />
      <div className="px-4 py-5 flex-1">
        <p className="text-sm font-medium mb-4" style={{ color: NAVY, opacity: 0.6 }}>
          구체적인 불편 내용을 선택해 주세요.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(SUBCATEGORIES[category] ?? []).map((item) => (
            <button
              key={item}
              onClick={() => navigate("complaint-form", { category, subcategory: item })}
              className="flex items-center justify-center text-center py-6 px-3 rounded-2xl font-bold text-white text-sm leading-snug active:scale-95 transition-transform"
              style={{ background: item === "기타" ? "#6c7caa" : NAVY, minHeight: 80 }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
