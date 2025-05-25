const Chat = require('../models/Chat');

exports.getOrCreateChat = async (req, res) => {
  try {
    const { participantId } = req.body;

    // Find existing chat
    let chat = await Chat.findOne({
      participants: {
        $all: [req.user._id, participantId]
      }
    }).populate('participants', 'name');

    // If no chat exists, create new one
    if (!chat) {
      chat = new Chat({
        participants: [req.user._id, participantId],
        messages: []
      });
      await chat.save();
      chat = await chat.populate('participants', 'name');
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error accessing chat' });
  }
};

exports.getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id
    })
      .populate('participants', 'name')
      .sort({ 'messages.timestamp': -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user._id
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    chat.messages.push({
      sender: req.user._id,
      message
    });

    await chat.save();

    // Emit socket event for real-time update
    req.app.get('io').to(chatId).emit('new_message', {
      chatId,
      message: {
        sender: req.user._id,
        message,
        timestamp: new Date()
      }
    });

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
};
