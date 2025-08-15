export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

export type RouteProps = {
  user: AuthUser | null;
  redirectPath?: string;
};

// Authentication types
export type LoginRequest = {
  email: string;
  otp: string;
};

export type RequestLoginRequest = {
  email: string;
};

export type AuthResponse = {
  result: {
    data: {
      access_token: string;
      user: AuthUser;
    };
    message: string;
  };
};

export type CreateProfileRequest = {
  firstName: string;
  lastName: string;
  avatar?: string;
};

export type Activity = {
  id: number;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
};

export type UserActivity = {
  id: number;
  userId: number;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
};

export type ActivitiesResponse = {
  globalActivities: Activity[];
  userActivities: UserActivity[];
};

export type CreateActivityRequest = {
  name: string;
  color: string;
  icon: string;
};

export type UpdateActivityRequest = CreateActivityRequest;

// Timesheet types
export type Timesheet = {
  id: number;
  startTime: string;
  endTime: string | null;
  activityId: number;
  userId: number;
  activity: Activity | UserActivity;
  createdAt: string;
  updatedAt: string;
  durationMinutes?: number;
};

export type StartTimesheetRequest = {
  activityId: number;
  startTime: string;
};

export type StopTimesheetRequest = {
  endTime: string;
};

export type TimesheetsResponse = {
  timesheets: Timesheet[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};
