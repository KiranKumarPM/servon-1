const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

router.post('/', auth, chatController.getOrCreateChat);
router.get('/my', auth, chatController.getMyChats);
router.post('/:chatId/message', auth, chatController.sendMessage);

module.exports = router;
