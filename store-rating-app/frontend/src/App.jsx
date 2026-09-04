import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ChangePassword from "./pages/auth/ChangePassword";

import AdminDashboard from "./pages/admin/Dashboard";
import UserDetails from "./pages/admin/UserDetails";

import UserStores from "./pages/user/Stores";
import OwnerDashboard from "./pages/owner/Dashboard";

function HomeRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === "STORE_OWNER") {
    return <Navigate to="/owner/dashboard" replace />;
  }

  return <Navigate to="/stores" replace />;
}

export default function App() {
  return (
    <Routes>

      {/* Home */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Change Password - All Logged-in Roles */}
      <Route
        element={
          <ProtectedRoute
            roles={["USER", "ADMIN", "STORE_OWNER"]}
          />
        }
      >
        <Route
          path="/change-password"
          element={<ChangePassword />}
        />
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/users/:id"
          element={<UserDetails />}
        />
      </Route>

      {/* Normal User */}
      <Route element={<ProtectedRoute roles={["USER"]} />}>
        <Route
          path="/stores"
          element={<UserStores />}
        />
      </Route>

      {/* Store Owner */}
      <Route element={<ProtectedRoute roles={["STORE_OWNER"]} />}>
        <Route
          path="/owner/dashboard"
          element={<OwnerDashboard />}
        />
      </Route>

      {/* Unknown route */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}