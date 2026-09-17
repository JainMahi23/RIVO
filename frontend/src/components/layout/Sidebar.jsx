import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  MapPinned,
  Gauge,
  Landmark,
  MessageCircleHeart,
  Settings as SettingsIcon,
  Wheat,
  Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/assessment', label: 'Assessment', icon: ClipboardList },
  { to: '/market-finance/active', label: 'Market & Finance', icon: MapPinned },
  { to: '/feasibility/active', label: 'Feasibility Report', icon: Gauge },
  { to: '/loan-schemes/active', label: 'Loan & Schemes', icon: Landmark },
  { to: '/ai-assistant', label: 'AI Copilot', icon: MessageCircleHeart },
  { to: '/settings', label: 'Settings & Health', icon: SettingsIcon },
];

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-ink/40 z-30 lg:hidden" onClick={onCloseMobile} />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 shrink-0 bg-forest text-cream z-40 flex flex-col justify-between transition-transform duration-200 shadow-xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          <div className="flex items-center gap-2.5 px-6 h-16 border-b border-cream/10">
            <span className="h-9 w-9 rounded-xl bg-gold/20 flex items-center justify-center text-gold">
              <Wheat size={22} />
            </span>
            <div>
              <span className="font-display text-xl tracking-tight text-cream">Rivo</span>
              <span className="text-[10px] block text-gold/80 font-semibold tracking-wider uppercase">Rural Enterprise</span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-gold text-forest-dark shadow-gold/20 shadow-md font-bold'
                      : 'text-cream/80 hover:bg-cream/10 hover:text-cream'
                  }`
                }
              >
                <Icon size={18} strokeWidth={2.25} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-cream/10 bg-forest-dark/40">
          <div className="bg-cream/10 rounded-xl p-3 border border-cream/15 text-xs text-cream/80 space-y-1">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-gold">
              <Sparkles size={12} /> ML Engine Connected
            </span>
            <p className="text-[11px] text-cream/60">GIS & Demand Forecasting Active</p>
          </div>
          <p className="text-[10px] text-cream/40 mt-2 text-center">
            Rivo v1.2 · Built for Rural Enterprises
          </p>
        </div>
      </aside>
    </>
  );
}
