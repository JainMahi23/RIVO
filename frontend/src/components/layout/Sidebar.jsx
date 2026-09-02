import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  MapPinned,
  BarChart3,
  Landmark,
  Bot,
  Settings as SettingsIcon,
} from "lucide-react";

// Authenticated app sidebar. Order matches the product's information
// architecture: Dashboard -> Assessment -> Market & Finance -> Feasibility
// -> Loan & Schemes. AI Assistant + Settings sit outside that flow.
const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/assessment", label: "Assessment", icon: ClipboardList },
  { to: "/market-finance", label: "Market & Finance", icon: MapPinned },
  { to: "/feasibility", label: "Feasibility", icon: BarChart3 },
  { to: "/loan-schemes", label: "Loan & Schemes", icon: Landmark },
  { to: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 border-r h-screen p-4">
      <div className="font-bold text-lg mb-6">RIVO</div>
      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded text-sm ${
                isActive ? "bg-gray-100 font-medium" : "text-gray-600"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
