import { useEffect, useState } from "react";
import api from "../services/api";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function BrowseProfiles() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await api.get("/user/browse");
        setProfiles(res.data);
      } catch (err) {
        setError("Failed to load profiles");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // 🔐 Protect page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <p className="text-center mt-10">Loading profiles...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Browse Profiles
      </h1>

      {profiles.length === 0 ? (
        <p className="text-center text-gray-500">
          No profiles found
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {profiles.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={user.image || "https://via.placeholder.com/80"}
                  alt="profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-semibold text-lg">
                    {user.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {user.city || "City not specified"}
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-700 space-y-1">
                <p><b>Age:</b> {user.age || "N/A"}</p>
                <p><b>Gender:</b> {user.gender || "N/A"}</p>
                <p><b>Education:</b> {user.education || "N/A"}</p>
              </div>

              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
