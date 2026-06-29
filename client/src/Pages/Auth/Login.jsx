import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import logo from "/logo.jpg";

export default function Login() {
const [form, setForm] = useState({
  email: import.meta.env.VITE_DEFAULT_STUDENT_EMAIL || "",
  password: import.meta.env.VITE_DEFAULT_STUDENT_PASSWORD || "",
  role: "student",
});

// Prefill handler
const handlePrefill = (role) => {
  if (role === "student") {
    setForm({
      email: import.meta.env.VITE_DEFAULT_STUDENT_EMAIL || "",
      password: import.meta.env.VITE_DEFAULT_STUDENT_PASSWORD || "",
      role: "student",
    });
  } else {
    setForm({
      email: import.meta.env.VITE_DEFAULT_COUNSELLOR_EMAIL || "",
      password: import.meta.env.VITE_DEFAULT_COUNSELLOR_PASSWORD || "",
      role: "counsellor",
    });
  }
};


  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await API.post("/login", form);
      setMessage(response.data.message);

      localStorage.setItem("user_id", response.data.user_id);
      localStorage.setItem("user_role", response.data.user.role);

      const redirectPath =
        response.data.user.role === "student" ? "/student" : "/counsellor";
      setTimeout(() => navigate(redirectPath), 1200);
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Login failed. Please try again."
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
          <div className="flex flex-col items-center mb-6">
            <img
              src={logo}
              alt="Mano Sakha Logo"
              className="w-16 h-16 rounded-full shadow-lg mb-3 border-2 border-white"
            />
            <h1 className="text-2xl font-bold text-gray-900">Mano Sakha</h1>
            <p className="text-gray-600 mt-1">Your mental wellness partner</p>
          </div>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 space-y-6 border border-green-100"
        >
          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📧 Email Address
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 border border-green-200 rounded-xl"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔒 Password
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

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👤 I am a
              </label>
              <select
                name="role"
                className="w-full px-4 py-3 border border-green-200 rounded-xl"
                value={form.role}
                onChange={handleChange}
              >
                <option value="student">🎓 Student</option>
                <option value="counsellor">💼 Counsellor</option>
              </select>
            </div>
          </div>

          {/* 🔄 Quick Prefill Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => handlePrefill("student")}
              className="text-sm bg-green-100 px-3 py-2 rounded-lg hover:bg-green-200"
            >
              Fill Student Demo
            </button>
            <button
              type="button"
              onClick={() => handlePrefill("counsellor")}
              className="text-sm bg-blue-100 px-3 py-2 rounded-lg hover:bg-blue-200"
            >
              Fill Counsellor Demo
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-xl font-semibold"
          >
            {isLoading ? "Signing in..." : "🌿 Begin Your Journey"}
          </button>
        </form>
      </div>
    </div>
  );
}
