const Ticket = require('../Models/Ticket');
const TicketComment = require('../Models/TicketComment');


async function postComment(req, res) {
  const { ticketId } = req.params;
  const { comment } = req.body;
  if (!comment || comment.length < 1) 
    return res.status(400).json({ message: 'Comment required' });

  const ticket = await Ticket.findById(ticketId).populate('assigned_to created_by');

  if (!ticket) 
    return res.status(404).json({ message: 'Ticket not found' });

  const role = req.user.role.name;
  const isOwner = ticket.created_by && ticket.created_by._id.equals(req.user._id);

  const isAssignedSupport = ticket.assigned_to && ticket.assigned_to._id.equals(req.user._id)
   && req.user.role.name === 'SUPPORT';

  if (role === 'MANAGER' || isOwner || isAssignedSupport) {
    const c = await TicketComment.create({ ticket_id: ticket._id, user_id: req.user._id, comment });
    return res.status(201).json(c);
  }
  
  return res.status(403).json({ message: 'Forbidden' });
}


async function getComments(req, res) {
  const { ticketId } = req.params;
  const ticket = await Ticket.findById(ticketId).populate('assigned_to created_by');
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
  const role = req.user.role.name;
  const isOwner = ticket.created_by && ticket.created_by._id.equals(req.user._id);
  const isAssignedSupport = ticket.assigned_to 
    && ticket.assigned_to._id.equals(req.user._id) 
    && req.user.role.name === 'SUPPORT';

  if (role === 'MANAGER' || isOwner || isAssignedSupport) {
    const comments = await TicketComment.find({ ticket_id: ticket._id }).populate('user_id', 'name email');
    return res.json(comments);
  }
  return res.status(403).json({ message: 'Forbidden' });
}

async function patchComment(req, res) {
  const { id } = req.params;
  const { comment } = req.body;
  const c = await TicketComment.findById(id);
  if (!c) return res.status(404).json({ message: 'Comment not found' });
  if (req.user.role.name !== 'MANAGER' && !c.user_id.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
  c.comment = comment || c.comment;
  await c.save();
  res.json(c);
}


async function deleteComment(req, res) {
  const { id } = req.params;
  const c = await TicketComment.findById(id);
  if (!c) return res.status(404).json({ message: 'Comment not found' });
  if (req.user.role.name !== 'MANAGER' && !c.user_id.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
  await c.deleteOne();
  res.status(204).send();
}

module.exports = { postComment, getComments, patchComment, deleteComment };
