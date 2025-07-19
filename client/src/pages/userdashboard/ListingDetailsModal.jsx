// src/components/User/ListingDetailsModal.js
import React from "react";
import { X } from "lucide-react";

const ListingDetailsModal = ({ listing, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto relative p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X size={24} />
        </button>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {listing.images?.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Listing ${idx}`}
              className="rounded-xl object-cover h-48 w-full"
            />
          ))}
        </div>

        {/* Title & Basic Info */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{listing.title}</h2>
        <p className="text-gray-600 mb-1">{listing.location}</p>
        <p className="text-green-600 font-bold mb-4">KES {listing.price}</p>

        {/* Description */}
        <p className="text-gray-700 mb-4">{listing.description}</p>

        {/* Optional Features */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-600">
          <p><strong>Type:</strong> {listing.type}</p>
          <p><strong>Bedrooms:</strong> {listing.bedrooms}</p>
          <p><strong>Bathrooms:</strong> {listing.bathrooms}</p>
          <p><strong>Furnished:</strong> {listing.furnished ? "Yes" : "No"}</p>
          <p><strong>Pets Allowed:</strong> {listing.petsAllowed ? "Yes" : "No"}</p>
          <p><strong>Availability:</strong> {listing.available ? "Available" : "Occupied"}</p>
        </div>

        {/* Future Buttons / Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            Contact Landlord
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition">
            Save Listing
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsModal;
