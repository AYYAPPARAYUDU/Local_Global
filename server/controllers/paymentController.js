import Order from '../models/Order.js';
import User from '../models/User.js';
import axios from 'axios';
import crypto from 'crypto';

// --- THIS IS A SIMULATION of a PhonePe/Paytm integration ---
// A real integration would be much more complex and require a merchant account.

/**
 * @desc    Create a new payment intent
 * @route   POST /api/payment/create-intent
 * @access  Private
 */
export const createPaymentIntent = async (req, res) => {
    const { amount, email, phone } = req.body;

    try {
        // In a real-world app, you would use an SDK from PhonePe or Paytm here.
        // This is a complex process involving:
        // 1. Creating a unique merchantTransactionId.
        // 2. Creating a 'payload' object with amount, user details, and redirect URLs.
        // 3. Creating a SHA-256 hash of the payload (the 'checksum').
        // 4. Sending this payload to the PhonePe/Paytm API.

        // --- SIMULATION ---
        // We will simulate a successful API call to the payment gateway.
        console.log("Simulating call to payment gateway (PhonePe/Paytm)...");

        // The gateway would return a redirect URL.
        const simulatedPaymentGatewayUrl = "https://www.phonepe.com/pay/mock-payment-page";
        
        // We send this URL back to the frontend.
        res.json({
            success: true,
            message: "Payment intent created successfully.",
            paymentUrl: simulatedPaymentGatewayUrl
        });

    } catch (error) {
        console.error("Payment Intent Error:", error);
        res.status(500).send('Server Error: Could not initiate payment.');
    }
};

/**
 * @desc    Handle the payment gateway callback/webhook (Not built in this example)
 * @route   POST /api/payment/webhook
 * @access  Public
 */
export const paymentWebhook = async (req, res) => {
    // In a real app, the payment gateway (PhonePe) would send a POST request here
    // to confirm the payment was successful.
    
    // You would then:
    // 1. Verify the 'checksum' from the gateway to ensure it's a real request.
    // 2. Find the order in your database.
    // 3. Update the order status to 'Processing' and paymentInfo to 'succeeded'.
    // 4. Send a confirmation email to the customer.
    
    res.status(200).send('Webhook received.');
};