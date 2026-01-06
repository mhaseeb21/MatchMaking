import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRequirementFeed,
  resetFeed
} from "../features/requirements/requirementSlice";
import { Navigate } from "react-router-dom";
import SendProposalModal from "../components/proposals/SendProposalModal";

export default function RequirementFeed() {
  const dispatch = useDispatch();

  const {
    feedPosts,
    page,
    totalPages,
    loading
  } = useSelector((state) => state.requirements);

  const { isAuthenticated } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    city: "",
    gender: "",
    minAge: "",
    maxAge: ""
  });

  const [selectedPost, setSelectedPost] = useState(null);

  // 🔹 Initial load
  useEffect(() => {
    dispatch(resetFeed());
    dispatch(fetchRequirementFeed({ page: 1, filters }));
  }, [dispatch]);

  // 🔹 Apply filters
  const applyFilters = () => {
    dispatch(resetFeed());
    dispatch(fetchRequirementFeed({ page: 1, filters }));
  };

  // 🔹 Load more pagination
  const loadMore = () => {
    if (page < totalPages && !loading) {
      dispatch(fetchRequirementFeed({ page: page + 1, filters }));
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Requirement Feed
      </h1>

      {/* =====================
          FILTERS
      ===================== */}
      <div className="bg-white p-4 rounded shadow max-w-3xl mx-auto mb-6 grid grid-cols-2 md:grid-cols-5 gap-3">
        <input
          placeholder="City"
          className="border p-2 rounded"
          value={filters.city}
          onChange={(e) =>
            setFilters({ ...filters, city: e.target.value })
          }
        />

        <select
          className="border p-2 rounded"
          value={filters.gender}
          onChange={(e) =>
            setFilters({ ...filters, gender: e.target.value })
          }
        >
          <option value="">Any Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input
          type="number"
          placeholder="Min Age"
          className="border p-2 rounded"
          value={filters.minAge}
          onChange={(e) =>
            setFilters({ ...filters, minAge: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Max Age"
          className="border p-2 rounded"
          value={filters.maxAge}
          onChange={(e) =>
            setFilters({ ...filters, maxAge: e.target.value })
          }
        />

        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Apply
        </button>
      </div>

      {/* =====================
          POSTS
      ===================== */}
      <div className="space-y-6 max-w-3xl mx-auto">
        {feedPosts.map((post) => (
          <div
            key={post._id}
            className="bg-white p-5 rounded-lg shadow"
          >
            {/* User info */}
            <div className="flex items-center space-x-4 mb-3">
              <img
                src={post.user.image || "https://via.placeholder.com/50"}
                className="w-12 h-12 rounded-full"
                alt="user"
              />
              <div>
                <p className="font-semibold">{post.user.name}</p>
                <p className="text-sm text-gray-500">
                  {post.user.city}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-3">
              {post.description}
            </p>

            {/* Meta */}
            <div className="grid grid-cols-2 text-sm text-gray-600 gap-2">
              <p><b>Gender:</b> {post.genderPreference}</p>
              <p><b>Age:</b> {post.minAge} - {post.maxAge}</p>
              <p><b>City:</b> {post.city}</p>
              <p><b>Education:</b> {post.education}</p>
            </div>

            {/* Action */}
            <button
              onClick={() => setSelectedPost(post)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Send Proposal
            </button>
          </div>
        ))}

        {!loading && feedPosts.length === 0 && (
          <p className="text-center text-gray-500">
            No requirements found
          </p>
        )}
      </div>

      {/* =====================
          LOAD MORE
      ===================== */}
      {page < totalPages && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 disabled:opacity-60"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* =====================
          SEND PROPOSAL MODAL
      ===================== */}
      {selectedPost && (
        <SendProposalModal
          postId={selectedPost._id}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
