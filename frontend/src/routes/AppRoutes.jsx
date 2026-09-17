import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

import Landing from '../pages/Landing/Landing.jsx';
import Login from '../pages/Login/Login.jsx';
import Onboarding from '../pages/Login/Onboarding.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import AssessmentStepper from '../pages/Assessment/AssessmentStepper.jsx';
import MarketFinanceContainer from '../pages/MarketFinance/MarketFinanceContainer.jsx';
import FeasibilityReport from '../pages/Feasibility/FeasibilityReport.jsx';
import LoanSchemes from '../pages/LoanSchemes/LoanSchemes.jsx';
import AIAssistant from '../pages/AIAssistant/AIAssistant.jsx';
import Settings from '../pages/Settings/Settings.jsx';
import NotFound from '../pages/NotFound.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assessment/:id?" element={<AssessmentStepper />} />
        <Route path="/market-finance/:assessmentId" element={<MarketFinanceContainer />} />
        <Route path="/feasibility/:assessmentId" element={<FeasibilityReport />} />
        <Route path="/loan-schemes/:assessmentId" element={<LoanSchemes />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
