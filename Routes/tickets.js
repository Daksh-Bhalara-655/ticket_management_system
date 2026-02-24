const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/roles');
const {
  createTicket,
  listTickets,
  assignTicket,
  changeStatus,
  deleteTicket,
  getTicket,
} = require('../controller/ticketsController');

// Create ticket (USER, MANAGER)
router.post('/', auth, allowRoles('USER', 'MANAGER'), createTicket);

// Get tickets
router.get('/', auth, listTickets);

// Assign ticket (MANAGER, SUPPORT)
router.patch('/:id/assign', auth, allowRoles('MANAGER', 'SUPPORT'), assignTicket);

// Change status (MANAGER, SUPPORT)
router.patch('/:id/status', auth, allowRoles('MANAGER', 'SUPPORT'), changeStatus);

// Delete ticket (MANAGER)
router.delete('/:id', auth, allowRoles('MANAGER'), deleteTicket);

// Get single ticket
router.get('/:id', auth, getTicket);

module.exports = router;
