const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const Role = require('../Models/Role');

async function register(req, res) {
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
}

async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  const user = await User.findOne({ email }).populate('role');
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const match = await user.comparePassword(password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role.name } });
}

module.exports = { register, login };
