import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import { registerUser } from "../features/auth/authSlice";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const { name, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(registerUser(formData)).then((res) => {
      if (!res.error) {
        navigate("/dashboard");
      }
    });
  };

  // 🔐 Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

      {error && (
        <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          placeholder="Full Name"
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email"
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password (min 6 chars)"
          className="w-full border p-2 rounded"
          minLength={6}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </AuthLayout>
  );
}
