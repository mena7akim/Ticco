import { api } from "@/lib/api";
import type {
  Activity,
  UserActivity,
  ActivitiesResponse,
  CreateActivityRequest,
  UpdateActivityRequest,
} from "@/types/types";

// Get all global activities (public)
export const getGlobalActivities = async (): Promise<Activity[]> => {
  const response = await api.get("/activities/global");
  return response.data.result.data;
};

// Get user's custom activities
export const getUserActivities = async (): Promise<UserActivity[]> => {
  const response = await api.get("/activities/user");
  return response.data.result.data;
};

// Get all activities (global + user's custom activities)
export const getAllActivities = async (): Promise<ActivitiesResponse> => {
  const response = await api.get("/activities/all");
  return response.data.result.data;
};

// Create a new user activity
export const createUserActivity = async (
  activity: CreateActivityRequest
): Promise<UserActivity> => {
  const response = await api.post("/activities/user", activity);
  return response.data.result.data;
};

// Update a user activity
export const updateUserActivity = async (
  id: number,
  activity: UpdateActivityRequest
): Promise<UserActivity> => {
  const response = await api.put(`/activities/user/${id}`, activity);
  return response.data.result.data;
};

// Delete a user activity
export const deleteUserActivity = async (id: number): Promise<void> => {
  await api.delete(`/activities/user/${id}`);
};
