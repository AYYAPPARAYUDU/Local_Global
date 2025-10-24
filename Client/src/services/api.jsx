import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. Request Interceptor: Adds the auth token to every secure request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Response Interceptor: Handles expired tokens and logs user out
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('userToken');
            window.location.href = '/login';
            return Promise.reject(new Error("Session expired. Please log in again."));
        }
        return Promise.reject(error);
    }
);

const apiService = {
    // === AUTHENTICATION ===
    login: (credentials) => apiClient.post('/auth/login', credentials),
    signup: (userData) => apiClient.post('/auth/register', userData),
    getMe: () => apiClient.get('/auth/me'),
    updateShopLocation: (locationData) => apiClient.put('/auth/updatelocation', locationData),

    // === SHOP SETTINGS ===
    getShopProfile: () => apiClient.get('/auth/shopprofile'),
    updateShopProfile: (profileData) => apiClient.put('/auth/shopprofile', profileData),

    // === PRODUCTS ===
    getAllProducts: (params) => apiClient.get('/products', { params }),
    getProductById: (id) => apiClient.get(`/products/${id}`),
    createProductReview: (productId, reviewData) => apiClient.post(`/products/${productId}/reviews`, reviewData),

    // === DASHBOARDS & ANALYTICS ===
    getDashboardStats: () => apiClient.get('/dashboard/stats'), // For Shopkeeper Dashboard
    getCustomerDashboard: () => apiClient.get('/users/dashboard'), // For Customer Profile
    getAnalytics: () => apiClient.get('/analytics'), // For Shopkeeper Analytics Page

    // === USER ADDRESSES ===
    getSavedAddresses: () => apiClient.get('/users/addresses'),
    saveNewAddress: (addressData) => apiClient.post('/users/addresses', addressData),

    // === SHOPKEEPER ACTIONS ===
    getShopkeeperProducts: () => apiClient.get('/products/mine'),
    createProduct: (formData) => apiClient.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateProduct: (id, formData) => apiClient.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteProduct: (id) => apiClient.delete(`/products/${id}`),

    // === ORDERS ===
    createOrder: (orderData) => apiClient.post('/orders', orderData),
    getMyOrders: () => apiClient.get('/orders/myorders'),
    getShopOrders: () => apiClient.get('/orders/shop'),
    updateOrderStatus: (id, status) => apiClient.put(`/orders/${id}/status`, { status }),
    cancelOrder: (id) => apiClient.put(`/orders/${id}/cancel`), // Added for customer order cancellation

    // === PAYMENT (NEW) ===
    initiatePayment: (paymentData) => apiClient.post('/payment/create-intent', paymentData),

    // === CHAT ===
    getConversation: (otherUserId, productId) => apiClient.get(`/chat/${otherUserId}/${productId}`),
    sendMessage: (otherUserId, productId, messageData) => apiClient.post(`/chat/${otherUserId}/${productId}`, messageData),
};

export default apiService;