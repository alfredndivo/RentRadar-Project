import express from 'express';
import {
  getAllUsers,
  toggleUserStatus,
  getReports,
  deleteListing,
  setAdminRole,
  getAnalytics,
} from '../controllers/adminController.js';

import { authorize } from '../middleware/authMiddleware.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

// 🧑‍⚖️ SuperAdmin Only
router.get('/users', authorize, roleCheck(['superadmin']), getAllUsers);
router.post('/set-role', authorize, roleCheck(['superadmin']), setAdminRole);

// 👮 Admin and SuperAdmin
router.get('/reports', authorize, roleCheck(['admin', 'superadmin']), getReports);
router.put('/users/:id/toggle', authorize, roleCheck(['admin', 'superadmin']), toggleUserStatus);
router.delete('/listings/:id', authorize, roleCheck(['admin', 'superadmin']), deleteListing);
router.get('/analytics', authorize, roleCheck(['admin', 'superadmin']), getAnalytics);

export default router;
