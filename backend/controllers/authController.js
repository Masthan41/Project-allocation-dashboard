// import User from '../models/User.js';
// import jwt from 'jsonwebtoken';

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
// };

// export const register = async (req, res) => {
//   try {
//     const { name, email, password, role = 'user' } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Create user
//     const user = await User.create({ name, email, password, role });
//     const token = generateToken(user._id);

//     res.status(201).json({
//       message: 'User registered successfully',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user and include password for comparison
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Check password
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const token = generateToken(user._id);

//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id)
//       .populate('currentBatch', 'name project status progress')
//       .select('-password');
    
//     res.json({ user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const updateProfile = async (req, res) => {
//   try {
//     const { profile } = req.body;
    
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { $set: { profile } },
//       { new: true, runValidators: true }
//     ).select('-password');

//     res.json({ message: 'Profile updated successfully', user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


import User from '../models/User.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// -------------------- USER CONTROLLERS --------------------

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ---------- SUPER ADMIN ----------
    const SUPER_ADMIN_EMAIL = 'superadmin@example.com';
    const SUPER_ADMIN_PASSWORD = 'SuperSecret123';
    if (email === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASSWORD) {
      const token = generateToken('superadmin'); // token with superadmin id
      return res.status(200).json({
        message: 'Super Admin logged in successfully',
        token,
        user: {
          id: 'superadmin',
          name: 'Super Admin',
          email: SUPER_ADMIN_EMAIL,
          role: 'admin'
        }
      });
    }

    // ---------- NORMAL ADMIN ----------
    const admin = await Admin.findOne({ email });
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = generateToken(admin._id);
      return res.status(200).json({
        message: 'Admin logged in successfully',
        token,
        user: {
          id: admin._id,
          name: admin.username,
          email: admin.email,
          role: 'admin'
        }
      });
    }

    // ---------- NORMAL USER ----------
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- USER PROFILE CONTROLLERS --------------------

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('currentBatch', 'name project status progress')
      .select('-password');
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profile } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { profile } },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
