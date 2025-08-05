const express = require('express');

const router = express.Router();
const mongoose = require("mongoose");

const { isLoggedIn } = require('../middleware');
const User = require('../models/user');
const Listing = require('../models/listing');
const Chat = require('../models/chat');

// Helper to generate consistent roomId
function getRoomId(listingId, userId1, userId2) {
  const ids = [userId1.toString(), userId2.toString()].sort();
  return `${listingId}-${ids[0]}-${ids[1]}`;
}

// 📥 GET /chat/inbox — All unique conversations for current user
router.get('/inbox', isLoggedIn, async (req, res) => {
  const currentUserId = res.locals.currUser._id;

  try {
    const chats = await Chat.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }]
    })
      .sort({ timestamp: -1 })
      .populate('sender receiver listing');

    const conversationsMap = new Map();

    chats.forEach(chat => {
      const isSender = chat.sender && chat.sender._id.toString() === currentUserId.toString();
      const otherUser = isSender ? chat.receiver : chat.sender;

      // Skip if either user or listing is missing
      if (!otherUser || !chat.listing) return;

      const key = `${otherUser._id}-${chat.listing._id}`;

      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          user: otherUser,
          listing: chat.listing,
          lastMessage: chat.content,
          time: chat.timestamp,
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());
    res.render('chat/inbox', { conversations });

  } catch (err) {
    req.flash('error', 'Could not load inbox.');
    res.redirect('/listings');
  }
});


// 💬 GET /chat/:listingId/:otherUserId — Chatroom between two users
router.get('/:listingId/:otherUserId', isLoggedIn, async (req, res) => {
  const { listingId, otherUserId } = req.params;
  const currentUser = res.locals.currUser;

  try {
    const listing = await Listing.findById(listingId).populate('owner');
    const otherUser = await User.findById(otherUserId);

    if (!listing || !otherUser) {
      req.flash("error", "Invalid listing or user.");
      return res.redirect('/listings');
    }

    const messages = await Chat.find({
      listing: listingId,
      $or: [
        { sender: currentUser._id, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUser._id }
      ]
    })
      .sort({ timestamp: 1 })
      .populate('sender receiver');

    res.render('chat/chatroom', {
      listing,
      otherUser,
      currentUser,
      messages
    });

  } catch (err) {
    req.flash("error", "Could not load chatroom.");
    res.redirect('/listings');
  }
});

// 📤 POST /chat/:listingId/:otherUserId — Send a new message
// POST message to DB and emit via socket
router.post("/:listingId/:otherUserId", isLoggedIn, async (req, res) => {
  try {
    const { listingId, otherUserId } = req.params;
    const { message } = req.body;

    const newMessage = new Chat({
      listing: listingId,
      sender: req.user._id,
      receiver: otherUserId,
      content: message,
      timestamp: new Date()
    });

    await newMessage.save();

    // Notify both clients via Socket.IO using consistent roomId
    const io = req.app.get("socketio");
    const roomId = getRoomId(listingId, req.user._id, otherUserId);

    const payload = {
      content: message,
      senderId: String(req.user._id),
      timestamp: new Date().toLocaleString('en-IN', { hour12: true })
    };

    io.to(roomId).emit("message", payload);

    res.status(200).end(); // no page reload
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Delete all messages in a conversation
router.delete("/:listingId/:otherUserId", isLoggedIn, async (req, res) => {
  const { listingId, otherUserId } = req.params;
  const currentUserId = req.user._id;

  await Chat.deleteMany({
    listing: listingId,
    $or: [
      { sender: currentUserId, receiver: otherUserId },
      { sender: otherUserId, receiver: currentUserId }
    ]
  });

  req.flash("success", "Conversation deleted successfully.");
  res.redirect("/chat/inbox");
});


router.post('/delete-messages', isLoggedIn, async (req, res) => {
  const { messageIds } = req.body;
  try {
    // ✅ Validate it's an array
    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({ error: "Invalid or empty messageIds" });
    }

    // ✅ Filter only valid ObjectIds
    const validIds = messageIds.filter(id => mongoose.Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      return res.status(400).json({ error: "No valid message IDs provided." });
    }

    const result = await Chat.deleteMany({ _id: { $in: validIds } });
    res.status(200).json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete messages" });
  }
});

module.exports = router;
