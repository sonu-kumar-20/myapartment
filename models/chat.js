const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listing: {
    type: Schema.Types.ObjectId,
    ref: 'Listing',
    required: false
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// ✅ Add index for performance (for querying chat between 2 people on a listing)
chatSchema.index({ sender: 1, receiver: 1, listing: 1, timestamp: 1 });

// ✅ Add a virtual to format timestamp
chatSchema.virtual('formattedTime').get(function () {
  return this.timestamp.toLocaleString('en-IN', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
});

// ✅ Ensure virtuals are included when using .toJSON() or .toObject()
chatSchema.set('toJSON', { virtuals: true });
chatSchema.set('toObject', { virtuals: true });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
