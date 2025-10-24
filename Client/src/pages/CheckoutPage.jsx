import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/Spinner';
import apiService from '../services/api';
import './styles/CheckoutPage.css';

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const SuccessIcon = () => <svg className="success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="success-icon--circle" cx="26" cy="26" r="25" fill="none"/><path className="success-icon--check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>;
const SmallSpinner = () => <div className="spinner"></div>;

// --- Address Modal Component ---
const AddressModal = ({ onClose, onSave, isProcessing }) => {
    const [formData, setFormData] = useState({ name: '', address: '', city: '', postalCode: '', type: 'Home' });
    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
            <motion.div className="modal-content" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-header">Add a New Address</h3>
                <form onSubmit={handleSubmit} className="modal-body">
                    <input name="name" onChange={handleChange} placeholder="Full Name" required/>
                    <input name="address" onChange={handleChange} placeholder="Full Address (House No, Street)" required/>
                    <div className="form-row">
                        <input name="city" onChange={handleChange} placeholder="City" required/>
                        <input name="postalCode" onChange={handleChange} placeholder="Postal Code" required/>
                    </div>
                    <select name="type" onChange={handleChange}><option>Home</option><option>Work</option></select>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={isProcessing}>{isProcessing ? <SmallSpinner/> : 'Save Address'}</button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

// --- Main Checkout Page Component ---
const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth(); // Get the logged-in user
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    
    const [utr, setUtr] = useState(''); // --- NEW: State for the UTR/Transaction ID ---

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await apiService.getSavedAddresses();
                const fetchedAddresses = Array.isArray(res.data) ? res.data : [];
                setAddresses(fetchedAddresses);
                const defaultAddress = fetchedAddresses.find(a => a.isDefault);
                if (defaultAddress) {
                    setSelectedAddressId(defaultAddress._id);
                } else if (fetchedAddresses.length > 0) {
                    setSelectedAddressId(fetchedAddresses[0]._id);
                }
            } catch (error) {
                console.error("Failed to fetch addresses:", error);
                setAddresses([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAddresses();
    }, []);

    // --- Order Totals ---
    const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0), [cartItems]);
    const shippingCost = useMemo(() => subtotal > 500 ? 0.00 : 50.00, [subtotal]);
    const taxes = useMemo(() => subtotal * 0.18, [subtotal]);
    const total = useMemo(() => subtotal + shippingCost + taxes, [subtotal, shippingCost, taxes]);

    // --- Dynamic QR Code Generation ---
    // This correctly gets the REAL UPI ID from the cart items
    const shopkeeperUpiId = cartItems[0]?.user?.upiId || "default@upi";
    const shopkeeperName = cartItems[0]?.user?.shopName || "LocalGlobal Store";
    const qrData = `upi://pay?pa=${shopkeeperUpiId}&pn=${encodeURIComponent(shopkeeperName)}&am=${total.toFixed(2)}&cu=INR&tn=Order${Date.now()}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;

    // This function will ONLY place the order
    const handlePlaceOrder = async () => {
        // --- NEW: UTR Validation ---
        if (selectedPaymentMethod === 'UPI / QR Code' && !utr.trim()) {
            alert("Please enter the UTR / Transaction ID to confirm your payment.");
            return;
        }

        setIsProcessing(true);
        const shippingInfo = addresses.find(a => a._id === selectedAddressId);
        const orderData = {
            orderItems: cartItems.map(item => ({ product: item._id, name: item.name, image: item.image, price: item.price, quantity: item.quantity })),
            shippingInfo: { address: shippingInfo.address, city: shippingInfo.city, postalCode: shippingInfo.postalCode },
            paymentMethod: selectedPaymentMethod,
            itemsPrice: subtotal,
            taxPrice: taxes,
            shippingPrice: shippingCost,
            totalPrice: total,
            // --- NEW: Send the UTR to the backend ---
            paymentInfo: { 
                id: utr || `COD_${Date.now()}`, 
                status: selectedPaymentMethod === 'Cash on Delivery' ? 'Pending' : 'Pending Verification'
            }
        };

        try {
            await apiService.createOrder(orderData);
            setOrderSuccess(true);
            clearCart();
            setTimeout(() => navigate('/my-orders'), 4000);
        } catch (error) {
            alert("Order failed. Please try again.");
            setIsProcessing(false);
        }
    };

    // --- NEW: This function decides WHERE to go after Step 2 ---
    const handlePaymentStep = () => {
        if (selectedPaymentMethod === 'Cash on Delivery') {
            handlePlaceOrder(); // Place order directly
        } else if (selectedPaymentMethod === 'UPI / QR Code') {
            // This check is now correct because the backend is sending the upiId
            if (!cartItems[0]?.user?.upiId) {
                alert("The seller for this item has not provided a UPI ID. Please select Cash on Delivery.");
                return;
            }
            setStep(3); // Go to QR code screen
        } else {
            // For other methods like 'Credit / Debit Card'
            // This is where you would call a real payment gateway (PhonePe, etc.)
            // For now, we will simulate it.
            console.log("Simulating real payment gateway...");
            handlePlaceOrder();
        }
    };

    const handleSaveAddress = async (newAddress) => {
        setIsProcessing(true);
        try {
            const res = await apiService.saveNewAddress(newAddress);
            setAddresses(res.data);
            setSelectedAddressId(res.data[res.data.length - 1]._id);
        } catch (error) {
            alert("Failed to save address.");
        }
        setIsProcessing(false);
        setShowAddressModal(false);
    };
    
    if (loading) return <Spinner />;

    if (orderSuccess) return (
        <div className="checkout-page">
            <div className="d-flex align-items-center justify-content-center vh-100">
                <motion.div className="text-center" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <SuccessIcon />
                    <h1 className="h2 fw-bold mt-4">Order Placed Successfully!</h1>
                    <p className="lead text-muted">Thank you for your purchase. You'll be redirected shortly.</p>
                </motion.div>
            </div>
        </div>
    );
    
    return (
        <div className="checkout-page">
            <AnimatePresence>
                {showAddressModal && <AddressModal onSave={handleSaveAddress} onClose={() => setShowAddressModal(false)} isProcessing={isProcessing} />}
            </AnimatePresence>
            <header className="checkout-header"><h1>Secure Checkout</h1></header>
            <div className="container py-5">
                {/* --- UPDATED: 3-Step Stepper --- */}
                <div className="stepper">
                    <div className={`stepper-item ${step >= 1 ? 'completed' : ''}`}><div className="stepper-icon">{step > 1 ? <CheckIcon/> : '1'}</div><div className="stepper-label">Shipping</div></div>
                    <div className={`stepper-item ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}><div className="stepper-icon">{step > 2 ? <CheckIcon/> : '2'}</div><div className="stepper-label">Select Method</div></div>
                    <div className={`stepper-item ${step === 3 ? 'active' : ''}`}><div className="stepper-icon">3</div><div className="stepper-label">Pay</div></div>
                </div>
                <div className="row g-5">
                    <div className="col-lg-8">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div key="address" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="checkout-card">
                                        <h3 className="card-header">Select Delivery Address</h3>
                                        <div className="d-grid gap-3 mt-4">
                                            {addresses.map(addr => <div key={addr._id} className={`address-card ${selectedAddressId === addr._id ? 'selected' : ''}`} onClick={() => setSelectedAddressId(addr._id)}><span className="badge bg-secondary mb-2">{addr.type}</span><p className="fw-bold mb-1">{addr.name}</p><p className="text-muted mb-0">{addr.address}, {addr.city}, {addr.postalCode}</p></div>)}
                                            <button className="btn btn-secondary mt-2" onClick={() => setShowAddressModal(true)}>Add New Address</button>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end align-items-center mt-4"><button className="btn btn-primary" onClick={() => setStep(2)} disabled={!selectedAddressId}>Proceed to Payment</button></div>
                                </motion.div>
                            )}
                            {step === 2 && (
                                <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="checkout-card">
                                        <h3 className="card-header">Choose Payment Method</h3>
                                        <div className="d-grid gap-3 mt-4">
                                            {[ 'UPI / QR Code', 'Credit / Debit Card', 'Cash on Delivery' ].map(method => <div key={method} className={`payment-method ${selectedPaymentMethod === method ? 'selected' : ''}`} onClick={() => setSelectedPaymentMethod(method)}><span className="fw-bold flex-grow-1">{method}</span></div>)}
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-4"><button className="btn btn-light" onClick={() => setStep(1)}>Back to Address</button></div>
                                </motion.div>
                            )}
                            {/* --- NEW: STEP 3 for QR CODE & UTR --- */}
                            {step === 3 && (
                                <motion.div key="qrPayment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="checkout-card">
                                        <h3 className="card-header">Scan to Pay with UPI</h3>
                                        <div className="payment-qr-container">
                                            <p className="payment-instructions">Scan this QR with PhonePe, Google Pay, or any UPI app.</p>
                                            <div className="qr-code-wrapper">
                                                <img src={qrUrl} alt="UPI QR Code" />
                                            </div>
                                            <p className="amount-to-pay">Amount: <strong>₹{total.toFixed(2)}</strong></p>
                                            <p className="upi-id-info">Paying to: {shopkeeperName} ({shopkeeperUpiId})</p>
                                        </div>
                                        {/* --- NEW: UTR Input Field --- */}
                                        <div className="utr-input-group">
                                            <label htmlFor="utr">Enter UTR / Transaction ID</label>
                                            <input
                                                type="text"
                                                id="utr"
                                                value={utr}
                                                onChange={(e) => setUtr(e.target.value)}
                                                placeholder="Enter 12-digit transaction ID"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <button className="btn btn-light" onClick={() => setStep(2)}>Back to Methods</button>
                                        <button className="btn btn-primary btn-confirm-payment" onClick={handlePlaceOrder} disabled={isProcessing}>
                                            {isProcessing ? <SmallSpinner/> : 'Confirm Payment & Place Order'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="col-lg-4">
                        <div className="order-summary checkout-card">
                            <h4 className="card-header">Order Summary</h4><hr/>
                            {cartItems.map(item => <div key={item._id} className="d-flex justify-content-between align-items-center mb-2"><span className="text-muted small">{item.name} x {item.quantity}</span><span className="fw-bold">₹{item.price.toFixed(2)}</span></div>)}
                            <hr/>
                            <div className="d-flex justify-content-between mb-2"><span className="text-muted">Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                            <div className="d-flex justify-content-between mb-2"><span className="text-muted">Shipping</span><span>{shippingCost > 0 ? `₹${shippingCost.toFixed(2)}` : 'FREE'}</span></div>
                            <div className="d-flex justify-content-between mb-2"><span className="text-muted">Taxes (18%)</span><span>₹{taxes.toFixed(2)}</span></div>
                            <hr/>
                            <div className="d-flex justify-content-between fw-bold fs-5"><span >Total</span><span>₹{total.toFixed(2)}</span></div>
                            
                            {step === 2 && <button className="btn btn-primary w-100 mt-4" onClick={handlePaymentStep} disabled={!selectedPaymentMethod || isProcessing}>{isProcessing ? <SmallSpinner/> : `Proceed to Pay ₹${total.toFixed(2)}`}</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;

