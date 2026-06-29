// src/pages/admin/AdminResources.jsx
import { useEffect, useState, useRef } from "react";
import API from "../../services/api"; // axios instance with baseURL

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  // upload state
  const [resourceType, setResourceType] = useState("image"); // image|video|post
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const fileRef = useRef();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/resources/");
      setResources(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      alert("Please select a file");
      return;
    }
    const form = new FormData();
    form.append("resource_type", resourceType); // backend expects "resource_type"
    form.append("title", title);
    form.append("description", description);
    form.append("file", file);

    try {
      setLoading(true);
      const res = await API.post("/admin/resources/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Uploaded");
      fileRef.current.value = "";
      setTitle("");
      setDescription("");
      fetchResources();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!description.trim()) {
      alert("Please enter post content");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post("/admin/resources/post", {
        title,
        description,
        content: description,
      });
      alert("Post created");
      setTitle("");
      setDescription("");
      fetchResources();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Post failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this resource?")) return;
    try {
      await API.delete(`/admin/resources/${id}`);
      fetchResources();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const getFileUrl = (file_id) => {
    if (!file_id) return null;
    return `${API.defaults.baseURL}/admin/resources/file/${file_id}`;
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Manage Resources</h2>

      <div className="bg-gray-50 p-4 rounded mb-6">
        <div className="mb-2">
          <label className="font-medium mr-2">Type:</label>
          <select
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="post">Text Post</option>
          </select>
        </div>

        <div className="mb-2">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
        </div>

        {resourceType === "post" ? (
          <>
            <textarea
              placeholder="Post content"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded mb-2 h-28"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleCreatePost}
                className="bg-orange-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                Create Post
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              ref={fileRef}
              type="file"
              accept={resourceType === "image" ? "image/*" : "video/*"}
              className="w-full mb-2"
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded mb-2 h-20"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleFileUpload}
                className="bg-green-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                Upload {resourceType}
              </button>
            </div>
          </>
        )}
      </div>

      <div>
        <h3 className="text-md font-medium mb-3">Uploaded Resources</h3>
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {!loading && resources.length === 0 && (
          <p className="text-gray-500">No resources yet.</p>
        )}

        <ul className="space-y-3">
          {resources.map((r) => (
            <li key={r.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div>
                    {r.type === "image" && <span>📷</span>}
                    {r.type === "video" && <span>🎥</span>}
                    {r.type === "post" && <span>📝</span>}
                  </div>
                  <div>
                    <div className="font-semibold">{r.title}</div>
                    <div className="text-sm text-gray-600">{r.description}</div>
                  </div>
                </div>

                {/* Preview for image/video */}
                {r.type !== "post" && r.file_id && (
                  <div className="mt-3">
                    {r.type === "image" ? (
                      <img
                        src={getFileUrl(r.file_id)}
                        alt={r.title}
                        className="max-w-xs max-h-40 rounded"
                      />
                    ) : (
                      <video className="max-w-xs max-h-48" controls>
                        <source src={getFileUrl(r.file_id)} type={r.content_type} />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}

                {r.type === "post" && (
                  <div className="mt-2 text-sm text-gray-700">{r.content}</div>
                )}
              </div>

              <div className="ml-4 flex flex-col items-end space-y-2">
                {r.file_id && (
                  <a
                    href={getFileUrl(r.file_id)}
                    className="text-sm text-blue-600 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download
                  </a>
                )}
                <button onClick={() => handleDelete(r.id)} className="text-red-500 text-sm">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
