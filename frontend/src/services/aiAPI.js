import apiClient from "./apiClient.js";

// Placeholder ai API module — thin wrappers around backend routes.
// Components should call these functions, never axios directly.
const BASE = "/ai";

export async function getAiPlaceholder() {
  const { data } = await apiClient.get(BASE);
  return data;
}
