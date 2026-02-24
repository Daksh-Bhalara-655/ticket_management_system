const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/roles');
const User = require('../Models/User');
const Role = require('../Models/Role');

// Create user (MANAGER only)
router.post('/', auth, allowRoles('MANAGER'), async (req, res) => {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password || !role) return res.status(400).json({ message: 'Missing fields' });
  const roleName = String(role).toUpperCase();
  const roleDoc = await Role.findOne({ name: roleName });
  if (!roleDoc) return res.status(400).json({ message: 'Invalid role' });
  try {
    const user = await User.create({ name, email, password, role: roleDoc._id });
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// List users (MANAGER only)
router.get('/', auth, allowRoles('MANAGER'), async (req, res) => {
  const users = await User.find().populate('role', 'name').select('-password');
  res.json(users);
});

module.exports = router;
