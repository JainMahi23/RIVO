import { Link } from 'react-router-dom';
import { Wheat, Globe, MapPin, Sparkles, ShieldCheck, Landmark } from 'lucide-react';
import HowItWorks from './HowItWorks.jsx';
import FeasibilityCalculator from './FeasibilityCalculator.jsx';
import About from './About.jsx';

export default function Landing() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-20 bg-cream/95 backdrop-blur border-b border-forest/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Wheat size={22} className="text-gold-dark" />
            <span className="font-display text-xl text-forest">Rivo</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/70">
            <a href="#how-it-works" className="hover:text-forest transition-colors">How it works</a>
            <a href="#feasibility-calculator" className="hover:text-forest transition-colors">Feasibility calculator</a>
            <a href="#about" className="hover:text-forest transition-colors">Why Rivo</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-1 text-sm text-ink/60 hover:text-forest">
              <Globe size={15} /> EN
            </button>
            <Link to="/login" className="btn-primary text-sm px-4 py-2">
              Log in
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-forest text-cream relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <h1 className="text-4xl sm:text-5xl font-display leading-[1.08]">
              Your rural enterprise partner
            </h1>
            <p className="mt-5 text-cream/75 text-lg leading-relaxed max-w-md">
              Turn your village business idea into a sustainable, bank-ready reality — with
              localised market intelligence, transparent financial projections, and government
              scheme matching.
            </p>
            <div className="mt-8 flex items-center gap-5">
              <Link to="/login" className="btn-primary">
                Get started
              </Link>
              <a href="#feasibility-calculator" className="text-sm font-semibold underline underline-offset-4 decoration-gold/60 hover:decoration-gold">
                Try the feasibility calculator
              </a>
            </div>
          </div>

          {/* Capabilities Card */}
          <div className="relative h-72 lg:h-80 flex items-center justify-center">
            <div className="absolute inset-0 rounded-card bg-gradient-to-br from-gold/20 via-forest-light/40 to-terracotta/10 border border-cream/15 backdrop-blur-sm" />
            <div className="relative z-10 w-full p-6 space-y-4">
              <div className="flex items-center gap-3 bg-cream/10 backdrop-blur rounded-xl p-3.5 border border-cream/15">
                <span className="h-10 w-10 rounded-lg bg-gold/20 text-gold flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gold/90 font-semibold">GIS Spatial Scanning</p>
                  <p className="text-sm text-cream font-medium">Population Catchment & Competitor Analysis</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-cream/10 backdrop-blur rounded-xl p-3.5 border border-cream/15">
                <span className="h-10 w-10 rounded-lg bg-gold/20 text-gold flex items-center justify-center shrink-0">
                  <Sparkles size={20} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gold/90 font-semibold">ML Feasibility Engine</p>
                  <p className="text-sm text-cream font-medium">Financial Payback & Debt-Coverage Ratios</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-cream/10 backdrop-blur rounded-xl p-3.5 border border-cream/15">
                <span className="h-10 w-10 rounded-lg bg-gold/20 text-gold flex items-center justify-center shrink-0">
                  <Landmark size={20} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gold/90 font-semibold">Scheme Matcher</p>
                  <p className="text-sm text-cream font-medium">PMEGP, MUDRA & Stand-Up India Integration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <HowItWorks />

      {/* Feasibility Calculator */}
      <FeasibilityCalculator />

      {/* Why Rivo / About */}
      <div id="about">
        <About />
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-10 text-sm text-ink/45 flex flex-col sm:flex-row justify-between gap-2 border-t border-forest/10">
        <span>© {new Date().getFullYear()} Rivo. Built for rural enterprises.</span>
        <span>support@rivo.in</span>
      </footer>
    </div>
  );
}
