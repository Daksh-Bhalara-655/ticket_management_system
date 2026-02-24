const Ticket = require('../Models/Ticket');
const TicketStatusLog = require('../Models/TicketStatusLog');
const User = require('../Models/User');


function validStatusTransition(oldS, newS) {
  const order = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  return order.indexOf(newS) === order.indexOf(oldS) + 1;
}

// Only USER can create tickets

async function createTicket(req, res) {
  const { title, description, priority } = req.body;
  if (!title || title.length < 5) 
    return res.status(400).json({ message: 'Title too short' });

  if (!description || description.length < 10) 
    return res.status(400).json({ message: 'Description too short' });

  if (priority && !['LOW', 'MEDIUM', 'HIGH'].includes(priority)) 
    return res.status(400).json({ message: 'Invalid priority' });

  const ticket = await Ticket.create({ title, description, priority: priority || 'MEDIUM', created_by: req.user._id });
  res.status(201).json(ticket);
}



async function listTickets(req, res) {
  const role = req.user.role.name;
  if (role === 'MANAGER') {
    const tickets = await Ticket.find().populate('created_by assigned_to', 'name email role');
    return res.json(tickets);
  }
  if (role === 'SUPPORT') {
    const tickets = await Ticket.find({ assigned_to: req.user._id }).populate('created_by assigned_to', 'name email');
    return res.json(tickets);
  }
  const tickets = await Ticket.find({ created_by: req.user._id }).populate('created_by assigned_to', 'name email');
  return res.json(tickets);
}

// Only MANAGER can assign tickets to SUPPORT users
// assigneeId == SUPPORT user ID or MANAGER user ID 
// id = ticket ID

async function assignTicket(req, res) {
  const { id } = req.params;
  const { assigneeId } = req.body;
  const user = await User.findById(assigneeId).populate('role');

  if (!user) 
    return res.status(404).json({ message: 'User not found' });

  if (user.role.name === 'USER') 
    return res.status(400).json({ message: 'Cannot assign to USER role' });

  const ticket = await Ticket.findById(id);

  if (!ticket) 
    return res.status(404).json({ message: 'Ticket not found' });

  ticket.assigned_to = user._id;
  await ticket.save();
  res.status(200).json(ticket);
}



async function changeStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(status)) 
    return res.status(400).json({ message: 'Invalid status' });

  const ticket = await Ticket.findById(id);

  if (!ticket) 
    return res.status(404).json({ message: 'Ticket not found' });

  if (!validStatusTransition(ticket.status, status)) 
    return res.status(400).json({ message: 'Invalid transition' });

  const old = ticket.status;
  ticket.status = status;
  await ticket.save();
  await TicketStatusLog.create({ ticket_id: ticket._id, old_status: old, new_status: status, changed_by: req.user._id });
  res.status(200).json(ticket);
}


async function deleteTicket(req, res) {
  const { id } = req.params;
  const ticket = await Ticket.findByIdAndDelete(id);

  if (!ticket) 
    return res.status(404).json({ message: 'Ticket not found' });
  res.status(204).send();
}


async function getTicket(req, res) {
  const { id } = req.params;
  const ticket = await Ticket.findById(id).populate('created_by assigned_to', 'name email role');

  if (!ticket) 
    return res.status(404).json({ message: 'Ticket not found' });
  const role = req.user.role.name;

  if (role === 'MANAGER') 
    return res.json(ticket);

  if (role === 'SUPPORT' && ticket.assigned_to && (ticket.assigned_to._id ? ticket.assigned_to._id.equals(req.user._id) : false)) 
    return res.json(ticket);

  if (role === 'USER' && ticket.created_by && ticket.created_by._id.equals(req.user._id)) return res.json(ticket);
  return res.status(403).json({ message: 'Forbidden' });
}

module.exports = {
  createTicket,
  listTickets,
  assignTicket,
  changeStatus,
  deleteTicket,
  getTicket,
};
