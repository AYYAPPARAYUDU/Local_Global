import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// A sub-schema for individual shipping addresses (for customers)
const AddressSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    type: { type: String, enum: ['Home', 'Work'], default: 'Home' },
    isDefault: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email' ]
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['customer', 'shopkeeper'], default: 'customer' },
    
    // --- Shopkeeper-specific fields ---
    shopName: { type: String },
    address: { type: String }, // The shop's main address
    phone: { type: String },
    description: { type: String },
    upiId: { type: String },
    returnPolicy: { type: String },
    location: {
        // GeoJSON Point for efficient location queries
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        }
    },

    // --- Customer-specific fields ---
    savedAddresses: [AddressSchema]

}, { timestamps: true });

// This hook automatically encrypts the password before saving a user.
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model('User', UserSchema);