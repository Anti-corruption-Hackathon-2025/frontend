import axios from "axios";

export const backendAPI = axios.create({
  baseURL: "http://localhost:4000"
});

backendAPI.interceptors.request.use((config) => {
  const connectionHash = localStorage.getItem("connection-profile");

  if (connectionHash)
    config.headers["x-conn-profile"] = connectionHash;

  return config;
})