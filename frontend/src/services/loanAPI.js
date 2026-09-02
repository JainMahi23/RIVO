import apiClient from "./apiClient.js";

// Placeholder loan API module — thin wrappers around backend routes.
// Components should call these functions, never axios directly.
const BASE = "/loan";

export async function getLoanPlaceholder() {
  const { data } = await apiClient.get(BASE);
  return data;
}
