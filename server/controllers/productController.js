import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js'; // 1. Import the User model
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';

// Configure Cloudinary from your .env file
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to handle the image upload
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream({ folder: "local_global_products" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Shopkeeper
 */
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, originalPrice, category, stock, brand } = req.body;
        let imageUrl = '';

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            imageUrl = result.secure_url;
        }

        const product = new Product({
            user: req.user.id,
            name, description, price, originalPrice, category, stock, brand,
            image: imageUrl,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Fetch all products with filtering AND location
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res) => {
    try {
        // --- 1. Get all filters and new location data from query ---
        const { keyword, category, minPrice, maxPrice, minRating, lat, lng } = req.query;

        // Build the basic filter object
        const filter = {};
        if (keyword) { filter.name = { $regex: keyword, $options: 'i' }; }
        if (category) { filter.category = category; }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (minRating) { filter.rating = { $gte: Number(minRating) }; }

        let products;

        // --- 2. Check if customer location is provided ---
        if (lat && lng) {
            // --- ADVANCED LOCATION QUERY ---
            // A. Find shopkeepers near the customer
            const userLocations = await User.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: 'Point',
                            coordinates: [parseFloat(lng), parseFloat(lat)]
                        },
                        distanceField: "distance", // This field will be added to each user
                        distanceMultiplier: 0.001, // Convert meters to kilometers
                        query: { role: 'shopkeeper' }, // Only find shopkeepers
                        spherical: true
                    }
                },
                { $project: { _id: 1, distance: 1 } } // We only need the User ID and the calculated distance
            ]);

            // B. Create a Map for easy lookup of (userId -> distance)
            const distanceMap = new Map(userLocations.map(user => [user._id.toString(), user.distance]));

            // C. Find all products that match our filters AND are sold by a shopkeeper we found
            products = await Product.find({ 
                ...filter,
                user: { $in: Array.from(distanceMap.keys()) } 
            }).populate('user', 'shopName phone location');

            // D. Manually add the calculated distance to each product
            products = products.map(product => {
                const distance = distanceMap.get(product.user._id.toString());
                return { ...product.toObject(), distance }; 
            });

            // E. Sort by the new distance field
            products.sort((a, b) => a.distance - b.distance);

        } else {
            // --- 3. Fallback: If no location, just find products by filter ---
            products = await Product.find(filter).populate('user', 'shopName phone location');
        }

        res.json(products);

    } catch (err) { 
        console.error("getProducts Error:", err.message);
        res.status(500).send('Server Error'); 
    }
};

/**
 * @desc    Get all products for a specific logged-in shopkeeper
 * @route   GET /api/products/mine
 * @access  Private/Shopkeeper
 */
export const getShopProducts = async (req, res) => {
    try {
        const products = await Product.find({ user: req.user.id });
        res.json(products);
    } catch (err) { res.status(500).send('Server Error'); }
};

/**
 * @desc    Get a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        
        const product = await Product.findById(req.params.id).populate('user', 'shopName phone location upiId returnPolicy');

        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) { res.status(500).send('Server Error'); }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Shopkeeper
 */
export const updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        
        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        const updateData = { ...req.body };
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            updateData.image = result.secure_url;
        }
        
        product = await Product.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
        res.json(product);
    } catch (err) { 
        console.error(err.message);
        res.status(500).send('Server Error'); 
    }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Shopkeeper
 */
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        
        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        
        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Product removed' });
    } catch (err) { res.status(500).send('Server Error'); }
};

/**
 * @desc    Create a new review for a product
 * @route   POST /api/products/:id/reviews
 * @access  Private
 */
export const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user.id.toString());
        if (alreadyReviewed) {
            return res.status(400).json({ msg: 'Product already reviewed' });
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user.id
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ msg: 'Review added successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

