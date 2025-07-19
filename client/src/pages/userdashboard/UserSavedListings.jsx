import React, { useState, useEffect } from 'react';
import { Heart, Eye, MessageCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getUserSavedListings, unsaveListing } from '../../../api';
import ListingDetailsModal from './ListingDetailsModal';
import ContactLandlordModal from './ContactLandlordModal';

const UserSavedListings = () => {
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchSavedListings();
  }, []);

  const fetchSavedListings = async () => {
    try {
      const response = await getUserSavedListings();
      setSavedListings(response.data);
    } catch (error) {
      console.error('Error fetching saved listings:', error);
      toast.error('Failed to load saved listings');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveListing = async (listingId) => {
    try {
      await unsaveListing(listingId);
      setSavedListings(prev => prev.filter(listing => listing._id !== listingId));
      toast.success('Listing removed from saved');
    } catch (error) {
      toast.error('Failed to remove listing');
    }
  };

  const openDetailsModal = (listing) => {
    setSelectedListing(listing);
    setShowDetailsModal(true);
  };

  const openContactModal = (listing) => {
    setSelectedListing(listing);
    setShowContactModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Listings</h1>
        <p className="text-gray-600">Properties you've saved for later</p>
      </div>

      {/* Saved Listings */}
      {savedListings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved listings yet</h3>
          <p className="text-gray-600 mb-6">Start browsing properties and save your favorites</p>
          <button
            onClick={() => window.location.href = '/user/dashboard'}
            className="bg-[#10B981] text-white px-6 py-3 rounded-xl hover:bg-[#0f766e] transition-colors"
          >
            Browse Properties
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedListings.map((listing) => (
            <div key={listing._id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={listing.images?.[0] || '/api/placeholder/400/300'}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => handleUnsaveListing(listing._id)}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{listing.title}</h3>
                  <span className="text-xl font-bold text-[#10B981]">
                    KES {listing.price?.toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3">{listing.location}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openDetailsModal(listing)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => openContactModal(listing)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#0f766e] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contact
                  </button>
                  <button
                    onClick={() => handleUnsaveListing(listing._id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showDetailsModal && selectedListing && (
        <ListingDetailsModal
          listing={selectedListing}
          onClose={() => setShowDetailsModal(false)}
          onContact={() => {
            setShowDetailsModal(false);
            openContactModal(selectedListing);
          }}
          onSave={() => handleUnsaveListing(selectedListing._id)}
          isSaved={true}
        />
      )}

      {showContactModal && selectedListing && (
        <ContactLandlordModal
          listing={selectedListing}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
};

export default UserSavedListings;