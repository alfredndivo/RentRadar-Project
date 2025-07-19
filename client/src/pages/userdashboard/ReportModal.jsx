import React, { useState } from "react";
import axios from "axios";

const ReportModal = ({ isOpen, onClose, userId, landlordId, listingId, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title || !description) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/reports", {
        user: userId,
        landlord: landlordId,
        listing: listingId,
        title,
        description,
      });
      setTitle("");
      setDescription("");
      setError("");
      onSuccess?.();
      onClose();
    } catch (err) {
      setError("Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-xl relative">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Submit a Report</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 mb-3 rounded-md"
        />
        <textarea
          placeholder="Describe the issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 h-28 mb-3 rounded-md resize-none"
        />
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="text-white bg-gradient-to-r from-blue-500 to-green-500 px-4 py-2 rounded-md text-sm hover:opacity-90"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
