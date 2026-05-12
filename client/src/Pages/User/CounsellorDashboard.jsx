// src/pages/counsellor/CounsellorDashboard.jsx
import { useEffect, useState } from "react";
import { Calendar, CheckCircle, XCircle, Clock, Users, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function CounsellorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/pending"); // fetch pending
      setAppointments(res.data);

      const allRes = await API.get("/appointments");
      const all = allRes.data;
      setStats({
        total: all.length,
        pending: all.filter((a) => a.status === "pending").length,
        approved: all.filter((a) => a.status === "approved").length,
        rejected: all.filter((a) => a.status === "rejected").length,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.patch(`/appointments/${id}`, { status });
      fetchAppointments(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // remove token
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_role");
    navigate("/login"); // redirect to login page
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header with Logout */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#52a173]">Counsellor Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-5 flex items-center space-x-4">
          <Users className="text-[#52a173]" size={32} />
          <div>
            <p className="text-sm text-gray-500">Total Appointments</p>
            <p className="text-xl font-semibold">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center space-x-4">
          <Clock className="text-yellow-500" size={32} />
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-xl font-semibold">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center space-x-4">
          <CheckCircle className="text-green-600" size={32} />
          <div>
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-xl font-semibold">{stats.approved}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-5 flex items-center space-x-4">
          <XCircle className="text-red-600" size={32} />
          <div>
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-xl font-semibold">{stats.rejected}</p>
          </div>
        </div>
      </div>

      {/* Pending Appointments */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Calendar className="text-[#52a173]" />
          <span>Upcoming Appointment</span>
        </h2>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No pending appointments 🎉</p>
        ) : (
          <ul className="space-y-3">
            {appointments.map((a) => (
              <li
                key={a.id}
                className="border p-4 rounded-lg flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    Reason: {a.reason}
                  </p>
                  <p className="text-sm text-gray-600">
                    Time: {a.preferred_time}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    onClick={() => handleUpdateStatus(a.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    onClick={() => handleUpdateStatus(a.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}