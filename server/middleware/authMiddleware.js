import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Landlord from '../models/Landlord.js';
import Admin from '../models/Admin.js';

export const protect = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies?.token;

      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user;
      if (requiredRole === 'user') {
        user = await User.findById(decoded.id).select('-password');
      } else if (requiredRole === 'landlord') {
        user = await Landlord.findById(decoded.id).select('-password');
      } else if (requiredRole === 'admin' || requiredRole === 'superadmin') {
        user = await Admin.findById(decoded.id).select('-password');
      } else {
        return res.status(403).json({ message: 'Invalid role access' });
      }

      if (!user || user.role !== requiredRole) {
        return res.status(403).json({ message: 'Not authorized for this role' });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('Protect middleware error:', err);
      res.status(401).json({ message: 'Token is invalid or expired' });
    }
  };
};
