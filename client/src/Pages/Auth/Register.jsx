import { useState } from "react";
import API from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dob: "",
    role: "student",
    // Student-specific
    roll_no: "",
    department: "",
    year: "",
    section: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    // Counsellor-specific
    employee_id: "",
    qualification: "",
    specialization: "",
    experience_years: "",
    availability: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await API.post("/register", form);
      setMessage(response.data.message + " Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6"> {/* Increased max-width */}
        
        {/* Simple Header without Logo */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">Create Your Account</h2>
          <p className="mt-2 text-gray-600">Join our mental wellness community</p>
        </div>

        {/* Registration Form - Wider */}
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 space-y-6 border border-green-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Common Fields */}
            <div className="md:col-span-2">
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                👤 Full Name
              </label>
              <input
                id="full_name"
                type="text"
                name="full_name"
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                📧 Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                🔒 Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Create a password"
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                📞 Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Your phone number"
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                🚻 Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
                📅 Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                name="dob"
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                value={form.dob}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                🎯 I want to register as a
              </label>
              <select
                id="role"
                name="role"
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                value={form.role}
                onChange={handleChange}
              >
                <option value="student">🎓 Student</option>
                <option value="counsellor">💼 Counsellor</option>
              </select>
            </div>

            {/* Student Specific Fields */}
            {form.role === "student" && (
              <>
                <div>
                  <label htmlFor="roll_no" className="block text-sm font-medium text-gray-700 mb-2">
                    🎫 Roll Number
                  </label>
                  <input
                    id="roll_no"
                    type="text"
                    name="roll_no"
                    placeholder="Your roll number"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    value={form.roll_no}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    🏫 Department
                  </label>
                  <input
                    id="department"
                    type="text"
                    name="department"
                    placeholder="Your department"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    value={form.department}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                    📚 Year
                  </label>
                  <input
                    id="year"
                    type="number"
                    name="year"
                    placeholder="1-4"
                    min="1"
                    max="4"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    value={form.year}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Section
                  </label>
                  <input
                    id="section"
                    type="text"
                    name="section"
                    placeholder="Your section"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    value={form.section}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="emergency_contact_name" className="block text-sm font-medium text-gray-700 mb-2">
                    🆘 Emergency Contact Name
                  </label>
                  <input
                    id="emergency_contact_name"
                    type="text"
                    name="emergency_contact_name"
                    placeholder="Contact person name"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    value={form.emergency_contact_name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="emergency_contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                    📞 Emergency Contact Phone
                  </label>
                  <input
                    id="emergency_contact_phone"
                    type="tel"
                    name="emergency_contact_phone"
                    placeholder="Emergency phone number"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    value={form.emergency_contact_phone}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {/* Counsellor Specific Fields */}
            {form.role === "counsellor" && (
              <>
                <div>
                  <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 mb-2">
                    🆔 Employee ID
                  </label>
                  <input
                    id="employee_id"
                    type="text"
                    name="employee_id"
                    placeholder="Your employee ID"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    value={form.employee_id}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-2">
                    🎓 Qualification
                  </label>
                  <input
                    id="qualification"
                    type="text"
                    name="qualification"
                    placeholder="Your qualifications"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    value={form.qualification}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                    💡 Specialization
                  </label>
                  <input
                    id="specialization"
                    type="text"
                    name="specialization"
                    placeholder="Your specializations"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    value={form.specialization}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700 mb-2">
                    ⏳ Years of Experience
                  </label>
                  <input
                    id="experience_years"
                    type="number"
                    name="experience_years"
                    placeholder="Years of experience"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    value={form.experience_years}
                    onChange={handleChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Availability
                  </label>
                  <input
                    id="availability"
                    type="text"
                    name="availability"
                    placeholder="Your availability schedule"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                    value={form.availability}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 focus:ring-2 focus:ring-offset-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </span>
            ) : (
              "🌿 Create Account"
            )}
          </button>

          {message && (
            <div className={`p-4 rounded-xl text-center text-sm border ${
              message.includes("failed") || message.includes("Error") 
                ? "bg-red-50 text-red-800 border-red-200" 
                : "bg-green-50 text-green-800 border-green-200"
            }`}>
              <span className={message.includes("failed") || message.includes("Error") ? "text-red-600" : "text-green-600"}>
                {message.includes("failed") || message.includes("Error") ? "❌" : "✅"} {message}
              </span>
            </div>
          )}

          {/* Login and Back to Home Links */}
          <div className="space-y-4 pt-4 border-t border-green-100">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="font-semibold text-green-600 hover:text-green-700 transition-colors hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>

            {/* Back to Home Button */}
            <div className="text-center">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-all duration-200 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 hover:shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}