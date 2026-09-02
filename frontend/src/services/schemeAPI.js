import apiClient from "./apiClient.js";

// Placeholder scheme API module — thin wrappers around backend routes.
// Components should call these functions, never axios directly.
const BASE = "/scheme";

export async function getSchemePlaceholder() {
  const { data } = await apiClient.get(BASE);
  return data;
}
