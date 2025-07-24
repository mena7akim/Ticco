import { Route, Routes } from "react-router";
import ProtectedRoute from "./components/ProdectedRoute";
import Home from "./pages/tabs/home";
import Activities from "./pages/tabs/activities";
import Timesheets from "./pages/tabs/timesheets";
import Analytics from "./pages/tabs/analytics";
import NotFound from "./pages/not-found";
import SignIn from "./pages/auth/sign-in";
import CreateProfile from "./pages/auth/create-profile";
import Profile from "./pages/tabs/profile";
import { useAuthContext } from "./hooks/useAuthContext";
import { Loading } from "./components/ui/loading";
import AuthRoute from "./components/AuthRoute";

function App() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute user={user} />}>
        <Route index element={<Home />} />
        <Route path="activities" element={<Activities />} />
        <Route path="timesheets" element={<Timesheets />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="/auth/" element={<AuthRoute user={user} />}>
        <Route path="sign-in" element={<SignIn />} />
        <Route path="create-profile" element={<CreateProfile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
