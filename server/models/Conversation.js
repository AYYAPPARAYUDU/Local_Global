import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const ConversationSchema = new mongoose.Schema({
    // Link the conversation to a specific product
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    
    // An array containing the IDs of the two users in the chat
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    
    // An array that holds all messages in this conversation
    messages: [MessageSchema],

    // A preview of the last message for efficiency
    lastMessage: {
        text: String,
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date }
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

export default mongoose.model('Conversation', ConversationSchema);