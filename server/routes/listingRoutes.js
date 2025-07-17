import express from 'express';
import {
  createListing,
  getAllListings,
  getSingleListing,
  getMyListings,
  updateListing,
  deleteListing,
} from '../controllers/listingController.js';

import { authorize } from '../middleware/authMiddleware.js';
import uploadListingImage from '../middleware/uploadListingImage.js';

const router = express.Router();

// 🔐 Landlord creates a listing with multiple images
router.post('/', authorize('landlord'), uploadListingImage.array('images', 6), createListing);

// 🌍 Get all listings (public or logged in)
router.get('/', getAllListings);

// 📌 Get one listing by ID (public)
router.get('/:id', getSingleListing);

// 🧑‍💼 Get listings by the logged-in landlord
router.get('/my/listings', authorize('landlord'), getMyListings);

// ✏️ Update listing
router.put('/:id', authorize('landlord'), updateListing);

// ❌ Delete listing
router.delete('/:id', authorize('landlord'), deleteListing);

export default router;
