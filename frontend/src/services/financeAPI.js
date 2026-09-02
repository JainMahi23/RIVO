import apiClient from "./apiClient.js";

// Placeholder finance API module — thin wrappers around backend routes.
// Components should call these functions, never axios directly.
const BASE = "/finance";

export async function getFinancePlaceholder() {
  const { data } = await apiClient.get(BASE);
  return data;
}
