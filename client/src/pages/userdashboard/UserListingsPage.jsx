import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Bed, Bath, Heart, Eye, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getAllListings, saveListing, unsaveListing } from '../../../api';
import ListingDetailsModal from './ListingDetailsModal';
import ContactLandlordModal from './ContactLandlordModal';

const UserListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    houseType: '',
    minPrice: '',
    maxPrice: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [savedListings, setSavedListings] = useState(new Set());

  const houseTypes = [
    'Single Room', 'Bedsitter', 'Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom',
    'Maisonette', 'Bungalow', 'Apartment', 'Penthouse', 'Hostel Room',
    'Servant Quarter', 'Shared Room', 'Townhouse', 'Villa'
  ];

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [listings, searchTerm, filters]);

  const fetchListings = async () => {
    try {
      const response = await getAllListings();
      setListings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load listings');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = listings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(listing =>
        listing.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // House type filter
    if (filters.houseType) {
      filtered = filtered.filter(listing => listing.houseType === filters.houseType);
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(listing => listing.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(listing => listing.price <= parseInt(filters.maxPrice));
    }

    setFilteredListings(filtered);
  };

  const handleSaveListing = async (listingId) => {
    try {
      if (savedListings.has(listingId)) {
        await unsaveListing(listingId);
        setSavedListings(prev => {
          const newSet = new Set(prev);
          newSet.delete(listingId);
          return newSet;
        });
        toast.success('Listing removed from saved');
      } else {
        await saveListing(listingId);
        setSavedListings(prev => new Set(prev).add(listingId));
        toast.success('Listing saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save listing');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Home</h1>
        <p className="text-gray-600">Discover amazing rental properties across Kenya</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by location, title, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-[#10B981] text-white rounded-xl hover:bg-[#0f766e] transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  value={filters.houseType}
                  onChange={(e) => setFilters(prev => ({ ...prev, houseType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {houseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price (KES)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (KES)</label>
                <input
                  type="number"
                  placeholder="100000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setFilters({ location: '', houseType: '', minPrice: '', maxPrice: '' })}
                className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-gray-600">
        Found {filteredListings.length} properties
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <div key={listing._id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={listing.images?.[0] || '/api/placeholder/400/300'}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => handleSaveListing(listing._id)}
                className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                  savedListings.has(listing._id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${savedListings.has(listing._id) ? 'fill-current' : ''}`} />
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

              <div className="flex items-center gap-1 text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{listing.location}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="bg-gray-100 px-2 py-1 rounded-lg">{listing.houseType}</span>
                {listing.bedrooms > 0 && (
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>{listing.bedrooms}</span>
                  </div>
                )}
                {listing.bathrooms > 0 && (
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    <span>{listing.bathrooms}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => openDetailsModal(listing)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button
                  onClick={() => openContactModal(listing)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#0f766e] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
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
          onSave={() => handleSaveListing(selectedListing._id)}
          isSaved={savedListings.has(selectedListing._id)}
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

export default UserListingsPage;