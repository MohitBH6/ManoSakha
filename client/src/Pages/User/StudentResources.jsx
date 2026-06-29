import { useEffect, useState } from "react";
import API from "../../services/api";

export default function StudentResources() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await API.get("/student/resources/");
      setResources(res.data);
    } catch (err) {
      console.error("Failed to fetch resources", err);
    }
  };

  const getFileUrl = (file_id) => `${API.defaults.baseURL}/admin/resources/file/${file_id}`;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-3">Resources</h2>
      {resources.length === 0 ? (
        <p className="text-gray-500">No resources available.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((r) => (
            <li key={r.id} className="border rounded p-3 bg-white">
              <h3 className="font-semibold">{r.title}</h3>
              <p className="text-sm text-gray-600">{r.description}</p>
              {r.type === "image" && <img src={getFileUrl(r.file_id)} alt={r.title} className="mt-2 max-h-40" />}
              {r.type === "video" && (
                <video controls className="mt-2 max-h-40">
                  <source src={getFileUrl(r.file_id)} type={r.content_type} />
                </video>
              )}
              {r.type === "post" && <p className="mt-2 text-gray-700">{r.content}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
