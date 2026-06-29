import { useState } from "react";
import API from "../../services/api";

export default function AdminUpload() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("student"); // default
  const [report, setReport] = useState(null);
  const [msg, setMsg] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMsg("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role);

    try {
      const res = await API.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setReport(res.data);
      setMsg("Upload completed!");
    } catch (err) {
      setMsg(err.response?.data?.detail || "Error uploading file");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Upload Users</h2>

      {/* Role selection */}
      <div className="mb-3">
        <label className="mr-2 font-semibold">Select Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="student">Student</option>
          <option value="counsellor">Counsellor</option>
        </select>
      </div>

      {/* Download Sample Excel */}
      <div className="flex justify-between items-center mb-3">
        <label className="font-semibold">Upload Excel/CSV:</label>
        <a
          href={`http://localhost:8000/static/sample_${role}.xlsx`}
          download
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
        >
          Download Sample {role.charAt(0).toUpperCase() + role.slice(1)} Excel
        </a>
      </div>

      {/* File input */}
      <input
        type="file"
        accept=".xlsx,.csv"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 mb-3 w-full"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>

      {msg && <p className="mt-3 text-sm text-gray-700">{msg}</p>}

      {report && (
        <div className="mt-4">
          <h3 className="font-semibold">Report:</h3>
          <p>Total Rows: {report.total_rows}</p>
          <p>Success: {report.success_count}</p>
          <p>Failed: {report.failed_count}</p>

          {report.errors.length > 0 && (
            <table className="mt-2 border-collapse border border-gray-300 w-full text-sm">
              <thead>
                <tr>
                  <th className="border p-1">Row</th>
                  <th className="border p-1">Email</th>
                  <th className="border p-1">Error</th>
                </tr>
              </thead>
              <tbody>
                {report.errors.map((err, idx) => (
                  <tr key={idx}>
                    <td className="border p-1">{err.row}</td>
                    <td className="border p-1">{err.email}</td>
                    <td className="border p-1">{err.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
