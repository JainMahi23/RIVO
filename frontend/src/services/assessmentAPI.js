import apiClient from "./apiClient.js";

// Placeholder assessment API module — thin wrappers around backend routes.
// Components should call these functions, never axios directly.
const BASE = "/assessment";

export async function getAssessmentPlaceholder() {
  const { data } = await apiClient.get(BASE);
  return data;
}
