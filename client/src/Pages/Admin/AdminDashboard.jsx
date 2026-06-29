import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminUpload from "./AdminUpload";
import AdminResources from "./AdminResources";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upload");

  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate("/admin");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_role");
    navigate("/admin");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("upload")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "upload" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Upload Users
        </button>

        <button
          onClick={() => setActiveTab("resources")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "resources" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Manage Resources
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        {activeTab === "upload" && <AdminUpload />}
        {activeTab === "resources" && <AdminResources />}
      </div>
    </div>
  );
}