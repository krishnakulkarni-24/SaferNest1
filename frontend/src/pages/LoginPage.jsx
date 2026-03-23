import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/services";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await authApi.login(form);
      setSession(data.token, {
        id: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      navigate("/dashboard");
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold mb-1">Welcome to SaferNest</h1>
        <p className="text-sm text-slate-500 mb-4">Sign in to continue</p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded bg-transparent"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded bg-transparent"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button disabled={loading} className="w-full p-2 rounded bg-blue-600 text-white">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
        <p className="text-sm mt-4">
          Don&apos;t have an account? <Link className="text-blue-600" to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
