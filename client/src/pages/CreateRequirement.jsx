import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateRequirement() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    genderPreference: "female",
    minAge: "",
    maxAge: "",
    city: "",
    country: "",
    education: "",
    description: ""
  });

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/requirements", formData);
      navigate("/requirements");
    } catch (err) {
      alert(err.response?.data?.msg || "Error creating post");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-lg space-y-4"
      >
        <h2 className="text-xl font-bold text-center">
          Create Requirement Post
        </h2>

        <select
          name="genderPreference"
          onChange={onChange}
          className="w-full border p-2 rounded"
        >
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>

        <div className="flex gap-2">
          <input
            type="number"
            name="minAge"
            placeholder="Min Age"
            onChange={onChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            name="maxAge"
            placeholder="Max Age"
            onChange={onChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <input
          name="city"
          placeholder="City"
          onChange={onChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="country"
          placeholder="Country"
          onChange={onChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="education"
          placeholder="Education"
          onChange={onChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Describe your requirement"
          onChange={onChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}
