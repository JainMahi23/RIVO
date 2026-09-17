import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Plus, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
];

export default function Topbar({ onOpenMobileNav }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 h-16 bg-forest text-cream flex items-center gap-3 px-4 lg:px-6 border-b border-cream/10">
      <button className="lg:hidden text-cream/80" onClick={onOpenMobileNav} aria-label="Open menu">
        <Menu size={22} />
      </button>

      <div className="flex-1 max-w-md relative hidden sm:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" />
        <input
          type="search"
          placeholder="Search assessments, schemes, reports…"
          className="w-full bg-cream/10 placeholder:text-cream/40 text-sm rounded-pill pl-9 pr-4 py-2 outline-none focus:bg-cream/15 transition-colors"
        />
      </div>

      <div className="flex-1 sm:hidden" />

      <div className="flex items-center gap-2 ml-auto">
        <div className="relative">
          <button
            onClick={() => setLangOpen((o) => !o)}
            className="flex items-center gap-1 text-sm text-cream/80 hover:text-cream px-2 py-1.5 rounded-lg hover:bg-cream/10 transition-colors"
          >
            {LANGUAGES.find((l) => l.code === lang)?.label}
            <ChevronDown size={14} />
          </button>
          {langOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-white text-ink rounded-lg shadow-card overflow-hidden">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setLangOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-cream"
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/assessment')}
          className="hidden sm:inline-flex items-center gap-1.5 bg-gold text-forest-dark text-sm font-semibold rounded-pill px-4 py-2 hover:bg-gold-dark transition-colors"
        >
          <Plus size={16} />
          New Assessment
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="h-9 w-9 rounded-full bg-gold text-forest-dark font-semibold flex items-center justify-center text-sm"
          >
            {(user?.name || 'R').charAt(0).toUpperCase()}
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white text-ink rounded-lg shadow-card overflow-hidden">
              <button
                onClick={() => {
                  navigate('/settings');
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-sm hover:bg-cream"
              >
                <UserIcon size={15} /> Profile
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-sm text-terracotta-dark hover:bg-cream"
              >
                <LogOut size={15} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
