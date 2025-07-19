import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllActivities,
  createUserActivity,
  updateUserActivity,
  deleteUserActivity,
} from "@/services/activityService";
import type {
  CreateActivityRequest,
  UpdateActivityRequest,
} from "@/types/types";

// Query keys
export const ACTIVITY_KEYS = {
  all: ["activities"] as const,
  lists: () => [...ACTIVITY_KEYS.all, "list"] as const,
  list: (filters: string) => [...ACTIVITY_KEYS.lists(), { filters }] as const,
  details: () => [...ACTIVITY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...ACTIVITY_KEYS.details(), id] as const,
};

// Fetch all activities (global + user activities)
export const useActivities = () => {
  return useQuery({
    queryKey: ACTIVITY_KEYS.lists(),
    queryFn: getAllActivities,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create activity mutation
export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activity: CreateActivityRequest) =>
      createUserActivity(activity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_KEYS.lists() });
    },
  });
};

// Update activity mutation
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      activity,
    }: {
      id: number;
      activity: UpdateActivityRequest;
    }) => updateUserActivity(id, activity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_KEYS.lists() });
    },
  });
};

// Delete activity mutation
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUserActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_KEYS.lists() });
    },
  });
};
