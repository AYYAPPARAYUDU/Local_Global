import Conversation from '../models/Conversation.js';
import mongoose from 'mongoose';

export default function(io) {
    io.on('connection', (socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);

        socket.on('joinConversation', (conversationId) => {
            socket.join(conversationId);
            console.log(`User ${socket.id} joined conversation room: ${conversationId}`);
        });

        socket.on('sendMessage', async (data) => {
            const { senderId, receiverId, productId, text } = data;
            
            if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId) || !mongoose.Types.ObjectId.isValid(productId)) {
                return console.error('Invalid ObjectId provided for sendMessage');
            }

            try {
                let conversation;

                // 1. Try to find the conversation
                conversation = await Conversation.findOne({
                    users: { $all: [senderId, receiverId] },
                    product: productId
                });

                const newMessage = {
                    sender: senderId,
                    text: text,
                    timestamp: new Date()
                };

                if (conversation) {
                    // 2. If conversation exists, push the message
                    conversation.messages.push(newMessage);
                    conversation.lastMessage = newMessage;
                    await conversation.save();
                } else {
                    // 3. If it doesn't exist, create a new one
                    conversation = await Conversation.create({
                        users: [senderId, receiverId],
                        product: productId,
                        messages: [newMessage],
                        lastMessage: newMessage
                    });
                }

                // 4. Populate and send the full conversation back
                const fullConversation = await Conversation.findById(conversation._id)
                    .populate('users', 'name')
                    .populate('product', 'name image price')
                    .populate('messages.sender', 'name');

                io.to(fullConversation._id.toString()).emit('messageReceived', fullConversation);

            } catch (error) {
                console.error('Socket.IO sendMessage error:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`🔌 Client disconnected: ${socket.id}`);
        });
    });
};