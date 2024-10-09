import { PropsWithChildren } from "react";
import { Sidebar } from "./sidebar";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="grid grid-cols-[20%_auto] gap-0 container">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
