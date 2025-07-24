import { User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useLogout } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

function Profile() {
  const { user } = useAuthContext();
  const logout = useLogout();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl">
            {user.firstName} {user.lastName}
          </CardTitle>
          <CardDescription className="text-base">{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">First Name</span>
              <p className="font-medium">{user.firstName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Last Name</span>
              <p className="font-medium">{user.lastName}</p>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Email</span>
              <p className="font-medium">{user.email}</p>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Avatar</span>
              <Badge variant="outline" className="ml-2">
                {user.avatar || "default"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </CardTitle>
          <CardDescription>Account preferences and actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              /* TODO: Add edit profile functionality */
            }}
          >
            <User className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>

          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
