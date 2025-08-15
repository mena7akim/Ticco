import { api } from "@/lib/api";
import type {
  Timesheet,
  TimesheetsResponse,
  StartTimesheetRequest,
  StopTimesheetRequest,
} from "@/types/types";

// Start a timesheet
export const startTimesheet = async (
  data: StartTimesheetRequest
): Promise<Timesheet> => {
  const response = await api.post("/timesheets/start", data);
  return response.data.result.data;
};

// Stop a timesheet
export const stopTimesheet = async (
  data: StopTimesheetRequest
): Promise<Timesheet> => {
  const response = await api.post("/timesheets/stop", data);
  return response.data.result.data;
};

// Get current running timesheet (if any)
export const getCurrentTimesheet = async (): Promise<Timesheet | null> => {
  const response = await api.get("/timesheets/current");
  return response.data.result.data;
};

// Get user timesheets with pagination and filters
export const getUserTimesheets = async (params: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  activityId?: number;
}): Promise<TimesheetsResponse> => {
  const response = await api.get("/timesheets", { params });
  return response.data.result.data;
};

// Get timesheet by ID
export const getTimesheetById = async (id: number): Promise<Timesheet> => {
  const response = await api.get(`/timesheets/${id}`);
  return response.data.result.data;
};

// Delete a timesheet
export const deleteTimesheet = async (id: number): Promise<void> => {
  await api.delete(`/timesheets/${id}`);
};
