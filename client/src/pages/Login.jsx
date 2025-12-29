import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice"; // ✅ Import loginUser action
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)); // ✅ CORRECT - dispatch loginUser action
  };

  // 🔁 Redirect on login success
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

      <form className="space-y-4" onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={onChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onChange}
          className="w-full border p-2 rounded"
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthLayout>
  );
}