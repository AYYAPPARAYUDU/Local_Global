import express from 'express';
import { 
    createProduct, 
    getProducts, 
    getShopProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    createProductReview
} from '../controllers/productController.js';
import { protect, isShopkeeper } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// --- Public Routes ---
router.get('/', getProducts);

// --- Correct Route Order ---
router.get('/mine', protect, isShopkeeper, getShopProducts); 
router.get('/:id', getProductById);

// --- Protected Route for Customers ---
router.post('/:id/reviews', protect, createProductReview);

// --- Protected Routes for Shopkeepers ---
router.post('/', protect, isShopkeeper, upload.single('image'), createProduct);
router.put('/:id', protect, isShopkeeper, upload.single('image'), updateProduct);
router.delete('/:id', protect, isShopkeeper, deleteProduct);

export default router;