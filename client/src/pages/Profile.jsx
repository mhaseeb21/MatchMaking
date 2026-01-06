import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile, updateProfile } from "../features/user/userSlice";
import { Navigate } from "react-router-dom";

export default function Profile() {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.user);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    city: "",
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        age: profile.age || "",
        gender: profile.gender || "",
        city: profile.city || "",
      });
    }
  }, [profile]);

  if (!isAuthenticated) return <Navigate to="/login" />;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) =>
      data.append(key, formData[key])
    );
    if (image) data.append("image", image);

    dispatch(updateProfile(data));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Update Profile
        </h2>

        {profile?.image && (
          <img
            src={profile.image}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
          />
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Name"
            className="w-full border p-2 rounded"
          />

          <input
            name="age"
            value={formData.age}
            onChange={onChange}
            placeholder="Age"
            type="number"
            className="w-full border p-2 rounded"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={onChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <input
            name="city"
            value={formData.city}
            onChange={onChange}
            placeholder="City"
            className="w-full border p-2 rounded"
          />

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
