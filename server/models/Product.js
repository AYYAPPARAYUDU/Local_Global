import mongoose from 'mongoose';

// A sub-schema for individual reviews
const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: { type: String, required: true }, // Reviewer's name
    rating: { type: Number, required: true },
    comment: { type: String, required: true }
}, {
    timestamps: true
});

const ProductSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    
    // --- THIS IS THE FIX ---
    // We must provide a default value for an empty array
    reviews: {
        type: [reviewSchema],
        default: []
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    
    price: { type: Number, required: true, default: 0 },
    originalPrice: { type: Number },
    stock: { type: Number, required: true, default: 0, min: 0 },
    
    // --- THIS IS THE FIX ---
    // We add a default value to the 'sold' field
    sold: { 
        type: Number, 
        default: 0 
    },
    
    specifications: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

export default mongoose.model('Product', ProductSchema);