import apiClient from "./apiClient.js";

// Placeholder feasibility API module — thin wrappers around backend routes.
// Components should call these functions, never axios directly.
const BASE = "/feasibility";

export async function getFeasibilityPlaceholder() {
  const { data } = await apiClient.get(BASE);
  return data;
}
