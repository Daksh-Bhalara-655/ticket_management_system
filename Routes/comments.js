const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { postComment, getComments, patchComment, deleteComment } = require('../controller/commentsController');

// Post a comment on a ticket
router.post('/:ticketId/comments', auth, postComment);

// Get comments for a ticket
router.get('/:ticketId/comments', auth, getComments);

// Patch comment (MANAGER or author)
router.patch('/comments/:id', auth, patchComment);

// Delete comment (MANAGER or author)
router.delete('/comments/:id', auth, deleteComment);

module.exports = router;
