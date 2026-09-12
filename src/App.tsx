import { useState } from "react";
import { PhoneShell } from "./ui";
import { AppDataProvider } from "./store";
import StartScreen from "./screens/StartScreen";
import TenantFlow from "./screens/tenant";
import LandlordFlow from "./screens/landlord";

type Role = "start" | "landlord" | "tenant";

export default function App() {
  const [role, setRole] = useState<Role>("start");

  return (
    <AppDataProvider>
      <PhoneShell>
        {role === "start" && <StartScreen onSelect={setRole} />}
        {role === "tenant" && <TenantFlow onExit={() => setRole("start")} />}
        {role === "landlord" && <LandlordFlow onExit={() => setRole("start")} />}
      </PhoneShell>
    </AppDataProvider>
  );
}
