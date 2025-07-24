import { api } from "@/lib/api";
import type {
  LoginRequest,
  RequestLoginRequest,
  AuthResponse,
  CreateProfileRequest,
  AuthUser,
} from "@/types/types";

// Request login OTP
export const requestLogin = async (
  data: RequestLoginRequest
): Promise<void> => {
  await api.post("/auth/request-login", data);
};

// Login with email and OTP
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  console.log("Login response:", response.data);
  return response.data;
};

// Get authenticated user
export const getAuthenticatedUser = async (): Promise<AuthUser> => {
  const response = await api.get("/auth/user");
  return response.data.result.data;
};

// Create user profile
export const createProfile = async (
  data: CreateProfileRequest
): Promise<void> => {
  await api.post("/profile/create", data);
};

// Authentication utilities
export const setAuthToken = (token: string): void => {
  localStorage.setItem("access_token", token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("access_token");
};

export const removeAuthToken = (): void => {
  localStorage.removeItem("access_token");
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
