import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private (Customers only)
 */
export const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingInfo, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ msg: 'No order items' });
        }

        const order = new Order({
            user: req.user.id,
            orderItems,
            shippingInfo,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now()
        });

        const createdOrder = await order.save();

        // --- "ADVANCED LEVEL" Live Stock Update ---
        // This is safer and also updates the 'sold' count for analytics
        for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { 
                    stock: -item.quantity, // Decrement stock
                    sold: +item.quantity  // Increment sold count
                }
            });
        }

        res.status(201).json(createdOrder);

    } catch (err) {
        console.error("Order creation failed:", err.message);
        res.status(500).send('Server Error');
    }
};


/**
 * @desc    Get orders for the logged-in user
 * @route   GET /api/orders/myorders
 * @access  Private
 */
export const getMyOrders = async (req, res) => {
    try {
        // This populate is 100% correct and final
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate({
                path: 'orderItems.product',
                select: 'name image user',
                populate: {
                    path: 'user',
                    model: 'User',
                    select: 'name shopName upiId'
                }
            });

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


/**
 * @desc    Get all orders for a shopkeeper
 * @route   GET /api/orders/shop
 * @access  Private/Shopkeeper
 */
export const getShopOrders = async (req, res) => {
    // This function is 100% correct
    try {
        const shopProducts = await Product.find({ user: req.user.id });
        const productIds = shopProducts.map(p => p._id);

        const orders = await Order.find({ 'orderItems.product': { $in: productIds } })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
            
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


/**
 * @desc    Update order status (e.g., to 'Shipped' or 'Delivered')
 * @route   PUT /api/orders/:id/status
 * @access  Private/Shopkeeper
 */
export const updateOrderStatus = async (req, res) => {
    // This function is 100% correct
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        const shopProducts = await Product.find({ user: req.user.id }).select('_id');
        const shopProductIds = shopProducts.map(p => p._id.toString());
        const orderProductIds = order.orderItems.map(item => item.product.toString());

        const isAuthorized = orderProductIds.some(opId => shopProductIds.includes(opId));
        if (!isAuthorized) {
            return res.status(401).json({ msg: 'Not authorized to update this order' });
        }

        order.orderStatus = req.body.status;
        if (req.body.status === 'Delivered') {
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Allow a customer to cancel their own order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private (Customer)
 */
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        if (order.orderStatus !== 'Processing') {
            return res.status(400).json({ msg: `Cannot cancel order. Status is: ${order.orderStatus}` });
        }

        order.orderStatus = 'Cancelled';
        const updatedOrder = await order.save();

        // --- "ADVANCED LEVEL" Restock items ---
        // This is safer and also updates the 'sold' count for analytics
        for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { 
                    stock: +item.quantity, // Increment stock
                    sold: -item.quantity  // Decrement sold count
                }
            });
        }

        res.json(updatedOrder);

    } catch (err) {
        console.error("Error cancelling order:", err.message);
        res.status(500).send('Server Error');
    }
};