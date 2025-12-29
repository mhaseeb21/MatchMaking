import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

function Dashboard() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔐 Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    dispatch(logout());      // clear redux + localStorage
    navigate("/login");     // redirect
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Welcome, {user.name}
        </h1>

        <div className="space-y-3 text-gray-700">
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>
          <p>
            <b>Joined:</b>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
