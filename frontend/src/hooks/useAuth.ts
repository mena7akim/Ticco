import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import {
  requestLogin,
  login,
  createProfile,
  setAuthToken,
} from "@/services/authService";
import { useAuthContext } from "./useAuthContext";
import type {
  LoginRequest,
  RequestLoginRequest,
  CreateProfileRequest,
} from "@/types/types";

// Request login OTP mutation
export const useRequestLogin = () => {
  return useMutation({
    mutationFn: (data: RequestLoginRequest) => requestLogin(data),
    onSuccess: () => {
      toast.success("OTP sent to your email!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error?.response?.data?.message || "Failed to send OTP";
      toast.error(message);
    },
  });
};

// Login mutation
export const useLogin = () => {
  const { setUser } = useAuthContext();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (response) => {
      // Store the token
      const { access_token, user } = response.result.data;
      setAuthToken(access_token);

      // Update the user in context
      setUser(user);

      toast.success("Welcome back!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
    },
  });
};

// Create profile mutation
export const useCreateProfile = () => {
  const { getCurrentUser } = useAuthContext();

  return useMutation({
    mutationFn: (data: CreateProfileRequest) => createProfile(data),
    onSuccess: async () => {
      // Refresh user data to get updated profile
      await getCurrentUser();
      toast.success("Profile created successfully!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error?.response?.data?.message || "Failed to create profile";
      toast.error(message);
    },
  });
};

// Logout utility
export const useLogout = () => {
  const { logout } = useAuthContext();

  return () => {
    // Show logout message
    toast.success("Logged out successfully");

    // Use context logout function
    logout();
  };
};
