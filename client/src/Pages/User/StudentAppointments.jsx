import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom"; // 👈 Added this import

const LANGUAGES = [
  "Hindi","English" ,"Bengali","Telugu","Marathi","Tamil","Urdu","Gujarati","Kannada",
  "Odia","Malayalam","Punjabi","Assamese","Maithili","Other"
];

function CustomDropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Selected value */}
      <div
        className="border p-2 rounded bg-white cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {value}
      </div>

      {/* Dropdown options */}
      {open && (
        <div className="absolute left-0 right-0 bg-white border rounded shadow-md mt-1 z-10 max-h-40 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                opt === value ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StudentAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    reason: "",
    preferredTime: "",
    language: "Hindi",
    therapyType: "Self",
    gender: "Male",
    mode: "In-person",
    issue: "Exam",
    identityVisibility: "Anonymous"
  });

  const studentId = localStorage.getItem("user_id");
  const navigate = useNavigate(); // 👈 Added this

  useEffect(() => {
    if (studentId) fetchAppointments();
  }, [studentId]);

  const fetchAppointments = async () => {
    try {
      const res = await API.get(`/student/appointments/${studentId}`);
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    }
  };

  const handleBookAppointment = async () => {
    const { reason, preferredTime, language, therapyType, gender, mode, issue, identityVisibility } = form;
    if (!reason || !preferredTime) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await API.post("/student/appointments/", {
        reason,
        preferred_time: new Date(preferredTime).toISOString(),
        language,
        therapy_type: therapyType,
        gender,
        mode,
        issue,
        identity_visibility: identityVisibility
      });
      alert("Appointment booked successfully!");
      setForm({ ...form, reason: "", preferredTime: "" });
      fetchAppointments();
    } catch (err) {
      console.error("Failed to book appointment", err);
      alert("Failed to book appointment");
    }
  };

  return (
    <div className="p-6">
      {/* Back Button - Top Left */}
      <button
        onClick={() => navigate(-1)} // or use navigate('/student') for specific route
        className="mb-4 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-3">Book Counsellor Appointment</h2>
      {studentId ? (
        <div className="bg-gray-50 p-4 rounded mb-4 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Reason for Appointment</label>
          <input
            type="text"
            placeholder="Reason"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className="w-full border p-2 rounded"
          />
          
          <label className="block text-sm font-medium text-gray-700">Preferred Date & Time</label>
          <input
            type="datetime-local"
            value={form.preferredTime}
            onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
            className="w-full border p-2 rounded"
          />

          <label className="block text-sm font-medium text-gray-700">Preferred Language</label>
          <CustomDropdown
            options={LANGUAGES}
            value={form.language}
            onChange={(val) => setForm({ ...form, language: val })}
          />

          <label className="block text-sm font-medium text-gray-700">Therapy Type</label>
          <CustomDropdown
            options={["Self", "Family", "Other"]}
            value={form.therapyType}
            onChange={(val) => setForm({ ...form, therapyType: val })}
          />

          <label className="block text-sm font-medium text-gray-700">Preferred Counsellor Gender</label>
          <CustomDropdown
            options={["Male", "Female", "Other"]}
            value={form.gender}
            onChange={(val) => setForm({ ...form, gender: val })}
          />

          <label className="block text-sm font-medium text-gray-700">Mode of Session</label>
          <CustomDropdown
            options={["In-person", "Online"]}
            value={form.mode}
            onChange={(val) => setForm({ ...form, mode: val })}
          />

          <label className="block text-sm font-medium text-gray-700">Issue Category</label>
          <input
            type="text"
            placeholder="Issue (exam, stress, other)"
            value={form.issue}
            onChange={(e) => setForm({ ...form, issue: e.target.value })}
            className="w-full border p-2 rounded"
          />

          <label className="block text-sm font-medium text-gray-700">Identity Visibility</label>
          <CustomDropdown
            options={["Anonymous", "Public"]}
            value={form.identityVisibility}
            onChange={(val) => setForm({ ...form, identityVisibility: val })}
          />

          <button onClick={handleBookAppointment} className="bg-blue-600 text-white px-4 py-2 rounded">
            Book Appointment
          </button>
        </div>
      ) : (
        <p className="text-red-500">Please log in to book an appointment.</p>
      )}

      <h3 className="text-lg font-medium mb-2">My Appointments</h3>
      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments yet.</p>
      ) : (
        <ul className="space-y-2">
          {appointments.map((a) => (
            <li key={a.id} className="border rounded p-2 bg-white space-y-1">
              <div className="font-semibold">{a.reason}</div>
              <div className="text-sm">{a.preferred_time}</div>
              <div className="text-sm">Language: {a.language}</div>
              <div className="text-sm">Therapy: {a.therapy_type}</div>
              <div className="text-sm">Gender: {a.gender}</div>
              <div className="text-sm">Mode: {a.mode}</div>
              <div className="text-sm">Issue: {a.issue}</div>
              <div className={`text-sm ${a.status === "pending" ? "text-orange-600" : "text-green-600"}`}>{a.status}</div>
              <div className="text-sm">Identity: {a.identity_visibility}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}