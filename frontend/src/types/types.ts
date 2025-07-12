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
