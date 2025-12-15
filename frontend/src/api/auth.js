import { api } from "@/api/client";

export async function loginUser(data) {
  const response = await api.post("/api/auth/login", data);
  return response.data;
}

export async function registerUser(data) {
  const response = await api.post("/api/auth/register", data);
  return response.data;
}