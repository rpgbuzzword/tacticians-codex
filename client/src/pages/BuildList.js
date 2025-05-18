import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function BuildList() {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedBuildId, setExpandedBuildId] = useState(null); // For collapsible view
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/builds");
        setBuilds(res.data);
      } catch (err) {
        setError("Failed to load builds.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuilds();
  }, []);

  if (loading) return <p>Loading builds...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const toggleExpand = (id) => {
    setExpandedBuildId(expandedBuildId === id ? null : id);
  };

  const handleEdit = (build) => {
  navigate("/", {
    state: {
      isEditing: true,
      buildId: build.id,
      buildData: build,
    },
  });
};


  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this army plan?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:5000/api/builds/${id}`);
    setBuilds(builds.filter(build => build.id !== id));
  } catch (err) {
    console.error("Failed to delete build:", err);
  }
};


  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font mb-4">Saved Army Plans</h2>

      {builds.length === 0 ? (
        <p>No builds saved yet.</p>
      ) : (
        <div className="space-y-6">
          {builds.map((build) => (
            <div key={build.id} className="border rounded p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font">{build.title}</h3>
                <div className="flex gap-4">
                <button
                  onClick={() => toggleExpand(build.id)}
                  className="text-blue-600 underline"
                >
                  {expandedBuildId === build.id ? "Hide Details" : "View Details"}
                </button>
                <button
                  onClick={() => handleEdit(build)}
                  className="text-green-600 underline"
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(build.id)} className="text-red-600 underline ml-2">
  Delete
</button>

              </div>
              </div>

              {expandedBuildId === build.id && (
                <div className="mt-4">
                  <p className="mb-2">Notes:{build.notes || "None"}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {build.army.map((char) => (
                      <div key={char.name} className="border p-3 rounded">
                        <h4 className="font">{char.name} - {char.base_class}</h4>
                        <p>Promoted:{char.promoted_class || "Not set"}</p>
                        {char.notes && (
                          <p>Notes:{char.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
