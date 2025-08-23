// backend/middleware/authMiddleware.js
import Admin from '../models/Admin.js';

export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const admin = await Admin.findById(req.session.adminId);
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    req.admin = admin; // attach admin to request
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
