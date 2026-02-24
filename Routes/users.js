const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/roles');
const { createUser, listUsers } = require('../controller/usersController');

// Create user (MANAGER only)
router.post('/', auth, allowRoles('MANAGER'), createUser);

// List users (MANAGER only)
router.get('/', auth, allowRoles('MANAGER'), listUsers);

module.exports = router;
