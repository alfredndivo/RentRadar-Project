// src/pages/UserDashboard/UserListingsPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import ListingDetailsModal from "../userdashboard/ListingDetailsModal";

const UserListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get("/api/listings/verified");
        setListings(res.data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    fetchListings();
  }, []);

  const openModal = (listing) => {
    setSelectedListing(listing);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedListing(null);
    setShowModal(false);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Verified Listings</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition"
          >
            <img
              src={listing.images?.[0] || "/placeholder.jpg"}
              alt="House"
              className="w-full h-48 object-cover rounded-lg mb-3"
            />
            <h3 className="text-lg font-semibold text-gray-700">{listing.title}</h3>
            <p className="text-sm text-gray-500">{listing.location}</p>
            <p className="text-green-600 font-bold mt-1">KES {listing.price}</p>

            <button
              onClick={() => openModal(listing)}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {showModal && selectedListing && (
        <ListingDetailsModal
          listing={selectedListing}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default UserListingsPage;
