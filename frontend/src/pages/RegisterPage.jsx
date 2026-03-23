import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/services";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "CITIZEN",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.register(form);
      navigate("/login");
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold mb-1">Create account</h1>
        <p className="text-sm text-slate-500 mb-4">Join SaferNest</p>
        <div className="space-y-3">
          <input placeholder="Full name" className="w-full p-2 border rounded bg-transparent" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input type="email" placeholder="Email" className="w-full p-2 border rounded bg-transparent" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" className="w-full p-2 border rounded bg-transparent" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <input placeholder="Phone" className="w-full p-2 border rounded bg-transparent" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <select className="w-full p-2 border rounded bg-transparent" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="CITIZEN">Citizen</option>
            <option value="VOLUNTEER">Volunteer</option>
            <option value="AUTHORITY">Authority</option>
          </select>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button disabled={loading} className="w-full p-2 rounded bg-blue-600 text-white">{loading ? "Creating..." : "Create Account"}</button>
        </div>
        <p className="text-sm mt-4">
          Already have an account? <Link className="text-blue-600" to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
