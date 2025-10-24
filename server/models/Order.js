import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    // Link to the user (customer) who placed the order
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // An array of the products that were ordered
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: { // Link to the actual product in the database
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            }
        }
    ],
    // Shipping information provided at checkout
    shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    // Payment information (we don't store card details, only the result)
    paymentInfo: {
        id: { type: String }, // Transaction ID from payment gateway
        status: { type: String } // e.g., 'succeeded'
    },
    // Order totals
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    // Order status, managed by the shopkeeper
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing'
    },
    paidAt: {
        type: Date
    },
    deliveredAt: {
        type: Date
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

export default mongoose.model('Order', OrderSchema);