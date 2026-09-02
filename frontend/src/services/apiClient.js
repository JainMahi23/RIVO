import axios from "axios";

// Single axios instance so every service module shares base URL,
// auth header injection, and error handling. No feature module should
// create its own axios/fetch instance.
const apiClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  // TODO: attach auth token once auth module exists
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    // TODO: centralize error toast / logging here
    return Promise.reject(err);
  }
);

export default apiClient;
