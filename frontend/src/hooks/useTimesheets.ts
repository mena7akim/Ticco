import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  startTimesheet,
  stopTimesheet,
  getCurrentTimesheet,
  getUserTimesheets,
  deleteTimesheet,
} from "@/services/timesheetService";
import type {
  StartTimesheetRequest,
  StopTimesheetRequest,
  Timesheet,
} from "@/types/types";
import { useSocket } from "./useSocket";
import { useEffect } from "react";

// Query keys
export const TIMESHEET_KEYS = {
  all: ["timesheets"] as const,
  lists: () => [...TIMESHEET_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...TIMESHEET_KEYS.lists(), { filters }] as const,
  current: () => [...TIMESHEET_KEYS.all, "current"] as const,
  details: () => [...TIMESHEET_KEYS.all, "detail"] as const,
  detail: (id: number) => [...TIMESHEET_KEYS.details(), id] as const,
};

// Fetch current timesheet with socket support
export const useCurrentTimesheet = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // Set up socket listeners for timesheet updates
  useEffect(() => {
    if (!socket) return;

    // Listen for timesheet status updates
    const handleTimesheetStatus = (data: { timesheet: Timesheet | null }) => {
      queryClient.setQueryData(TIMESHEET_KEYS.current(), data.timesheet);
    };

    // Listen for sync request
    const handleSync = () => {
      queryClient.invalidateQueries({ queryKey: TIMESHEET_KEYS.current() });
    };

    socket.on("timesheet:status", handleTimesheetStatus);
    socket.on("timesheet:sync", handleSync);

    // Clean up event listeners
    return () => {
      socket.off("timesheet:status", handleTimesheetStatus);
      socket.off("timesheet:sync", handleSync);
    };
  }, [socket, queryClient]);

  return useQuery({
    queryKey: TIMESHEET_KEYS.current(),
    queryFn: getCurrentTimesheet,
    // No need for aggressive refetching with socket updates
    refetchInterval: socket ? false : 10000,
  });
};

// Fetch user timesheets with filters and pagination
export const useTimesheets = (params: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  activityId?: number;
}) => {
  return useQuery({
    queryKey: TIMESHEET_KEYS.list(params),
    queryFn: () => getUserTimesheets(params),
  });
};

// Start timesheet mutation
export const useStartTimesheet = () => {
  return useMutation({
    mutationFn: (data: StartTimesheetRequest) => startTimesheet(data),
  });
};

// Stop timesheet mutation
export const useStopTimesheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StopTimesheetRequest) => stopTimesheet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TIMESHEET_KEYS.lists() });
    },
  });
};

// Delete timesheet mutation
export const useDeleteTimesheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTimesheet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TIMESHEET_KEYS.lists() });
    },
  });
};
