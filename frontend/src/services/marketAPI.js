import apiClient from "./apiClient.js";

// Placeholder market API module — thin wrappers around backend routes.
// Components should call these functions, never axios directly.
const BASE = "/market";

export async function getMarketPlaceholder() {
  const { data } = await apiClient.get(BASE);
  return data;
}
