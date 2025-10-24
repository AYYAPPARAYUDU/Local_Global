import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import io from 'socket.io-client';
import apiService from '../services/api';
import '../pages/styles/components/Chat.css';

const socket = io('http://localhost:5000');

const Chat = ({ shopkeeper, product, onClose }) => {
    const { user: currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversationId, setConversationId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!shopkeeper?._id || !product?._id) return;

        let currentConvId = null;

        const fetchConversation = async () => {
            try {
                const res = await apiService.getConversation(shopkeeper._id, product._id);
                if (res.data) {
                    setMessages(res.data.messages);
                    currentConvId = res.data._id;
                    setConversationId(currentConvId);
                    socket.emit('joinConversation', currentConvId);
                } else {
                    setMessages([]);
                    setConversationId(null);
                }
            } catch (error) {
                console.error("Failed to fetch conversation:", error);
            }
        };

        const handleMessageReceived = (updatedConversation) => {
            if (!currentConvId && updatedConversation.product._id === product._id) {
                currentConvId = updatedConversation._id;
                setConversationId(currentConvId);
                socket.emit('joinConversation', currentConvId);
            }
            
            if (updatedConversation._id === currentConvId) {
                setMessages(updatedConversation.messages);
            }
        };

        fetchConversation();
        socket.on('messageReceived', handleMessageReceived);

        return () => {
            socket.off('messageReceived', handleMessageReceived);
        };
    }, [shopkeeper, product]);

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser || !shopkeeper?._id || !product?._id) return;
        
        const messageData = {
            senderId: currentUser.id,
            receiverId: shopkeeper._id,
            productId: product._id,
            text: newMessage
        };

        socket.emit('sendMessage', messageData);
        setNewMessage('');
    };

    return (
        <motion.div 
            className="chat-widget" 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
            <div className="chat-header">
                <div className="chat-header-info">
                    <span className="shop-name">{shopkeeper.name}</span>
                    <span className="status">Online</span>
                </div>
                <button onClick={onClose} className="btn-close">&times;</button>
            </div>

            <div className="chat-product-context">
                <img src={product.image} alt={product.name} />
                <div className="info">
                    <p className="name">{product.name}</p>
                    <p className="price">₹{product.price.toFixed(2)}</p>
                </div>
            </div>

            <div className="chat-body">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`message ${msg.sender._id === currentUser.id ? 'sent' : 'received'}`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            
            <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input 
                    type="text" 
                    placeholder="Type your message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit"><FiSend /></button>
            </form>
        </motion.div>
    );
};

export default Chat;