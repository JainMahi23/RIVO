import { createContext, useContext, useState } from "react";

// Holds the user's in-progress assessment so the AI Assistant and other
// modules can read current context without prop-drilling or refetching.
const AssessmentContext = createContext(null);

export function AssessmentProvider({ children }) {
  const [currentAssessment, setCurrentAssessment] = useState(null);
  return (
    <AssessmentContext.Provider value={{ currentAssessment, setCurrentAssessment }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  return useContext(AssessmentContext);
}
