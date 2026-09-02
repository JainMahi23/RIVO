import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";

// Public pages
import Landing from "../pages/Landing/Landing.jsx";
import HowItWorks from "../pages/Landing/HowItWorks.jsx";
import FeasibilityCalculator from "../pages/Landing/FeasibilityCalculator.jsx";
import About from "../pages/Landing/About.jsx";
import Login from "../pages/Login/Login.jsx";

// Authenticated pages
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Assessment from "../pages/Assessment/Assessment.jsx";
import MarketFinance from "../pages/MarketFinance/MarketFinance.jsx";
import Feasibility from "../pages/Feasibility/Feasibility.jsx";
import LoanSchemes from "../pages/LoanSchemes/LoanSchemes.jsx";
import AIAssistant from "../pages/AIAssistant/AIAssistant.jsx";
import Settings from "../pages/Settings/Settings.jsx";

import AppLayout from "../components/layout/AppLayout.jsx";
import NotFound from "../pages/NotFound.jsx";

/**
 * Central route map for RIVO.
 * Public routes -> marketing/entry pages, no layout chrome required.
 * Authenticated routes -> wrapped in ProtectedRoute + AppLayout (sidebar/topbar).
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/feasibility-calculator" element={<FeasibilityCalculator />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />

      {/* Authenticated */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/market-finance" element={<MarketFinance />} />
          <Route path="/feasibility" element={<Feasibility />} />
          <Route path="/loan-schemes" element={<LoanSchemes />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
