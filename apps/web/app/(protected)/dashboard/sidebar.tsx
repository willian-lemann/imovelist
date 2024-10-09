import { Database, House, LayoutDashboard, UsersIcon } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dados", href: "/dashboard" },
    { icon: UsersIcon, label: "Corretores", href: "/dashboard/corretores" },
  ];

  return (
    <div className="w-64 bg-white shadow-md h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <nav>
          <ul>
            {sidebarItems.map((item, index) => (
              <li key={index} className="mb-2">
                <Link
                  href={item.href}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <item.icon className="w-5 h-5 mr-3 text-gray-500" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
