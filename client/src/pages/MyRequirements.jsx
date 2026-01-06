import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyRequirements,
  closeRequirement
} from "../features/requirements/requirementSlice";

export default function MyRequirements() {
  const dispatch = useDispatch();

  const { myPosts, loading } = useSelector(
    (state) => state.requirements
  );

  // 🔹 UI filter state
  const [statusFilter, setStatusFilter] = useState("open");

  // 🔄 Fetch whenever filter changes
  useEffect(() => {
    dispatch(fetchMyRequirements(statusFilter));
  }, [dispatch, statusFilter]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">My Requirements</h2>

        {/* 🔘 FILTER BUTTONS */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setStatusFilter("open")}
            className={`flex-1 py-2 rounded ${
              statusFilter === "open"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Active
          </button>

          <button
            onClick={() => setStatusFilter("closed")}
            className={`flex-1 py-2 rounded ${
              statusFilter === "closed"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Closed
          </button>
        </div>

        {/* 🟡 NO POSTS */}
        {!myPosts.length && (
          <p className="text-center text-gray-600">
            No {statusFilter} requirement posts.
          </p>
        )}

        {/* 📦 POSTS LIST */}
        {myPosts.map((post) => (
          <div
            key={post._id}
            className="border rounded p-4 mb-4 bg-gray-50"
          >
            <p className="mb-2">
              <b>Description:</b> {post.description}
            </p>
            <p className="mb-2">
              <b>Status:</b>{" "}
              <span
                className={
                  post.status === "open"
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                {post.status}
              </span>
            </p>

            {post.status === "open" && (
              <button
                onClick={() => dispatch(closeRequirement(post._id))}
                className="mt-2 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                Close Requirement
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
