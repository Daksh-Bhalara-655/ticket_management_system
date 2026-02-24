const mongoose = require('mongoose');

const TicketCommentSchema = new mongoose.Schema({
  ticket_id: 
  {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'Ticket', required: true 
},
  user_id: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true 
},
  comment: { 
    type: String, 
    required: true 
},
  created_at: { 
    type: Date, 
    default: Date.now 
},
});

module.exports = mongoose.model('TicketComment', TicketCommentSchema);
