import { useState } from "react";
import { NAVY, IVORY } from "./theme";
import { PhoneShell } from "./ui";
import { AppDataProvider, useAppData } from "./store";
import StartScreen from "./screens/StartScreen";
import TenantFlow from "./screens/tenant";
import LandlordFlow from "./screens/landlord";

type Role = "start" | "landlord" | "tenant";

function AppShell() {
  const [role, setRole] = useState<Role>("start");
  const { loading, error } = useAppData();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3" style={{ background: IVORY }}>
        <div className="w-8 h-8 rounded-full border-4 animate-spin" style={{ borderColor: `${NAVY}30`, borderTopColor: NAVY }} />
        <p className="text-sm font-medium" style={{ color: NAVY, opacity: 0.5 }}>
          불러오는 중...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center" style={{ background: IVORY }}>
        <span style={{ fontSize: 32 }}>⚠️</span>
        <p className="text-sm font-bold" style={{ color: NAVY }}>
          서버에 연결할 수 없습니다
        </p>
        <p className="text-xs leading-relaxed" style={{ color: NAVY, opacity: 0.55 }}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <>
      {role === "start" && <StartScreen onSelect={setRole} />}
      {role === "tenant" && <TenantFlow onExit={() => setRole("start")} />}
      {role === "landlord" && <LandlordFlow onExit={() => setRole("start")} />}
    </>
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <PhoneShell>
        <AppShell />
      </PhoneShell>
    </AppDataProvider>
  );
}
