import { useState } from "react";
import API from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
  // ✅ Pull from environment variables
  const defaultUsername = import.meta.env.VITE_ADMIN_USERNAME ;
  const defaultPassword = import.meta.env.VITE_ADMIN_PASSWORD ;

  const [form, setForm] = useState({
    username: defaultUsername,
    password: defaultPassword,
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrefill = () => {
    setForm({
      username: defaultUsername,
      password: defaultPassword,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      await API.post("/admin/login", form);
      setMessage("Login successful! Redirecting...");
      localStorage.setItem("isAdmin", "true");
      setTimeout(() => navigate("/admin/dashboard"), 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "Admin login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-teal-500 to-green-500 rounded-full w-20 h-20 flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="text-3xl">🌿</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Portal</h2>
          <p className="mt-2 text-gray-600">Mental Wellness Administration</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 space-y-6 border border-green-100"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👨‍💼 Admin Username
              </label>
              <input
                type="text"
                name="username"
                className="w-full px-4 py-3 border border-green-200 rounded-xl"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔒 Admin Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-3 border border-green-200 rounded-xl"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* 🔄 Prefill Button */}
          <button
            type="button"
            onClick={handlePrefill}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 border border-gray-300"
          >
            Use Demo Admin Credentials
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-xl font-semibold"
          >
            {isLoading ? "Authenticating..." : "🌿 Admin Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
