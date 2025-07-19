import { Route, Routes } from "react-router";
import ProtectedRoute from "./components/ProdectedRoute";
import type { AuthUser } from "./types/types";
import Home from "./pages/tabs/home";
import Activities from "./pages/tabs/activities";
import Timesheets from "./pages/tabs/timesheets";
import Analytics from "./pages/tabs/analytics";
import NotFound from "./pages/not-found";
import SignIn from "./pages/auth/sign-in";
import CreateProfile from "./pages/auth/create-profile";
import Profile from "./pages/tabs/profile";

const fakeUser: AuthUser = {
  id: "1",
  email: "email@gmail.com",
  firstName: "John",
  lastName: "Doe",
  avatar: "https://example.com/avatar.jpg",
};

function App() {
  const user: AuthUser = fakeUser;

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute user={user} />}>
        <Route index element={<Home />} />
        <Route path="activities" element={<Activities />} />
        <Route path="timesheets" element={<Timesheets />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/create-profile" element={<CreateProfile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
