export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
} | null;

export type ProtectedRouteProps = {
  user: AuthUser | null;
  redirectPath?: string;
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
