// This file is the single source of truth for all mock data.

// --- 1. DEFINE THE BASE 20 UNIQUE PRODUCTS ---
const baseProducts = [
    { id: 1, images: ["https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"], name: "Fjallraven Backpack", price: 109.95, originalPrice: 119.95, description: "Your perfect pack for everyday use and walks in the forest.", category: "men's clothing", rating: { rate: 3.9, count: 120 }, stock: 58, brand: "Fjallraven", seller: { name: "Urban Gear", location: "Mumbai, IN", phone: "+911234567890" }, specs: { material: "Canvas" }, options: { colors: ["Black", "Green", "Navy"], sizes: ["One Size"] }, distance: 15 },
    { id: 2, images: ["https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"], name: "Premium T-Shirt", price: 22.30, originalPrice: 25.00, description: "Slim-fitting style, contrast raglan long sleeve.", category: "men's clothing", rating: { rate: 4.1, count: 259 }, stock: 150, brand: "Generic", seller: { name: "Fashion Hub", location: "Delhi, IN", phone: "+919876543210" }, specs: { material: "Cotton Blend" }, options: { colors: ["White", "Gray", "Red"], sizes: ["S", "M", "L", "XL"] }, distance: 5 },
    { id: 3, images: ["https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg"], name: "Winter Cotton Jacket", price: 55.99, originalPrice: 65.50, description: "Great outerwear jackets for Spring/Autumn/Winter.", category: "men's clothing", rating: { rate: 4.7, count: 500 }, stock: 45, brand: "Roadster", seller: { name: "Local Threads", location: "Pune, IN", phone: "+911122334455" }, specs: { material: "100% Cotton" }, options: { colors: ["Khaki", "Black"], sizes: ["M", "L", "XL"] }, distance: 28 },
    { id: 4, images: ["https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg"], name: "Women's Pro Jacket", price: 56.99, originalPrice: 69.99, description: "Detachable inner jacket, waterproof outer shell.", category: "women's clothing", rating: { rate: 4.6, count: 235 }, stock: 88, brand: "BIYLACLESEN", seller: { name: "Adventure Co.", location: "Manali, IN", phone: "+912233445566" }, specs: { material: "Polyester" }, options: { colors: ["Black", "Red", "Blue"], sizes: ["S", "M", "L"] }, distance: 45 },
    { id: 5, images: ["https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg"], name: "Stylish Faux Leather Jacket", price: 29.95, originalPrice: 35.00, description: "Faux leather jacket with a removable hood.", category: "women's clothing", rating: { rate: 2.9, count: 340 }, stock: 120, brand: "Lock and Love", seller: { name: "Fashion Hub", location: "Delhi, IN", phone: "+919876543210" }, specs: { material: "Faux Leather" }, options: { colors: ["Black", "Brown", "Red"], sizes: ["XS", "S", "M", "L"] }, distance: 80 },
    { id: 6, images: ["https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg"], name: "Lightweight Rain Jacket", price: 39.99, originalPrice: 49.99, description: "Lightweight rain jacket with striped lining.", category: "women's clothing", rating: { rate: 3.8, count: 679 }, stock: 75, brand: "Generic", seller: { name: "Adventure Co.", location: "Manali, IN", phone: "+912233445566" }, specs: { material: "Polyester" }, options: { colors: ["Yellow", "Navy"], sizes: ["S", "M", "L", "XL"] }, distance: 12 },
    { id: 7, images: ["https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg"], name: "Boat Neck V-Neck Shirt", price: 9.85, originalPrice: 12.00, description: "95% RAYON 5% SPANDEX, Lightweight fabric.", category: "women's clothing", rating: { rate: 4.7, count: 130 }, stock: 250, brand: "MBJ", seller: { name: "Fashion Hub", location: "Delhi, IN", phone: "+919876543210" }, specs: { material: "Rayon/Spandex" }, options: { colors: ["Black", "White", "Red"], sizes: ["S", "M", "L"] }, distance: 150 },
    { id: 8, images: ["https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg"], name: "Moisture-Wicking Shirt", price: 7.95, originalPrice: 10.00, description: "100% Polyester, Machine wash.", category: "women's clothing", rating: { rate: 4.5, count: 146 }, stock: 180, brand: "Opna", seller: { name: "Sporty Styles", location: "Mumbai, IN", phone: "+913344556677" }, specs: { material: "Polyester" }, options: { colors: ["Blue", "Pink", "Purple"], sizes: ["XS", "S", "M", "L"] }, distance: 2 },
    { id: 9, images: ["https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg"], name: "Casual Cotton T-Shirt", price: 12.99, originalPrice: 15.00, description: "95%Cotton,5%Spandex, Casual, Short Sleeve.", category: "women's clothing", rating: { rate: 3.6, count: 145 }, stock: 200, brand: "DANVOUY", seller: { name: "Fashion Hub", location: "Delhi, IN", phone: "+919876543210" }, specs: { material: "Cotton/Spandex" }, options: { colors: ["Black", "White", "Gray"], sizes: ["S", "M", "L"] }, distance: 90 },
    { id: 10, images: ["https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg"], name: "WD 2TB Portable Hard Drive", price: 64.00, originalPrice: 80.00, description: "USB 3.0 and USB 2.0 Compatibility.", category: "electronics", rating: { rate: 3.3, count: 203 }, stock: 200, brand: "Western Digital", seller: { name: "Tech Hub", location: "Bangalore, IN", phone: "+915566778899" }, specs: { capacity: "2TB" }, options: { colors: ["Black"], sizes: ["One Size"] }, distance: 18 },
    { id: 11, images: ["https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg"], name: "SanDisk 1TB SSD", price: 109.00, originalPrice: 125.00, description: "Easy upgrade for faster boot-up.", category: "electronics", rating: { rate: 4.9, count: 470 }, stock: 95, brand: "SanDisk", seller: { name: "Gadget Galaxy", location: "Hyderabad, IN", phone: "+916677889900" }, specs: { capacity: "1TB" }, options: { colors: ["Black"], sizes: ["One Size"] }, distance: 35 },
    { id: 12, images: ["https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg"], name: "Silicon Power 256GB SSD", price: 109.00, originalPrice: 115.00, description: "3D NAND flash for high transfer speeds.", category: "electronics", rating: { rate: 4.8, count: 319 }, stock: 110, brand: "Silicon Power", seller: { name: "Tech Hub", location: "Bangalore, IN", phone: "+915566778899" }, specs: { capacity: "256GB" }, options: { colors: ["Black"], sizes: ["One Size"] }, distance: 22 },
    { id: 13, images: ["https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg"], name: "WD 4TB Gaming Drive", price: 114.00, originalPrice: 130.00, description: "Expand your PS4 gaming experience.", category: "electronics", rating: { rate: 4.8, count: 400 }, stock: 78, brand: "Western Digital", seller: { name: "Game On", location: "Chennai, IN", phone: "+914455667788" }, specs: { capacity: "4TB" }, options: { colors: ["Black"], sizes: ["One Size"] }, distance: 55 },
    { id: 14, images: ["https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg"], name: "Acer 21.5 inch IPS Monitor", price: 599.00, originalPrice: 650.00, description: "Widescreen IPS display with Radeon free Sync.", category: "electronics", rating: { rate: 2.9, count: 250 }, stock: 40, brand: "Acer", seller: { name: "Gadget Galaxy", location: "Hyderabad, IN", phone: "+916677889900" }, specs: { size: "21.5 inch" }, options: { colors: ["Black"], sizes: ["One Size"] }, distance: 40 },
    { id: 15, images: ["https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg"], name: "Samsung 49-Inch Curved Monitor", price: 999.99, originalPrice: 1099.99, description: "Super ultrawide 32:9 curved gaming monitor.", category: "electronics", rating: { rate: 2.2, count: 140 }, stock: 25, brand: "Samsung", seller: { name: "Game On", location: "Chennai, IN", phone: "+914455667788" }, specs: { size: "49 inch" }, options: { colors: ["Black"], sizes: ["One Size"] }, distance: 120 },
    { id: 16, images: ["https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg"], name: "Gold Micropave Ring", price: 168.00, originalPrice: 200.00, description: "Return or exchange any order within 30 days.", category: "jewelery", rating: { rate: 3.9, count: 70 }, stock: 30, brand: "Hafeez Center", seller: { name: "Global Gems", location: "Jaipur, IN", phone: "+917788990011" }, specs: { material: "Solid Gold" }, options: { colors: ["Gold"], sizes: ["6", "7", "8"] }, distance: 25 },
    { id: 17, images: ["https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg"], name: "Gold Plated Princess Ring", price: 9.99, originalPrice: 15.00, description: "Classic Created Wedding Engagement Ring.", category: "jewelery", rating: { rate: 3.0, count: 400 }, stock: 250, brand: "Generic", seller: { name: "The Jewel Box", location: "Surat, IN", phone: "+918899001122" }, specs: { material: "White Gold Plated" }, options: { colors: ["Silver"], sizes: ["5", "6", "7", "8", "9"] }, distance: 70 },
    { id: 18, images: ["https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg"], name: "Rose Gold Plated Earrings", price: 10.99, originalPrice: 14.99, description: "Rose Gold Plated Double Flared Tunnel Plug Earrings.", category: "jewelery", rating: { rate: 1.9, count: 100 }, stock: 100, brand: "Pierced Owl", seller: { name: "Body Artistry", location: "Goa, IN", phone: "+913344556677" }, specs: { material: "Stainless Steel" }, options: { colors: ["Rose Gold"], sizes: ["10mm", "12mm"] }, distance: 6 },
    { id: 19, images: ["https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg"], name: "My Passport 2TB Drive", price: 64.00, originalPrice: 80.00, description: "USB 3.0 and USB 2.0 Compatibility.", category: "electronics", rating: { rate: 3.3, count: 203 }, stock: 200, brand: "Western Digital", seller: { name: "Tech Hub", location: "Bangalore, IN", phone: "+915566778899" }, specs: { capacity: "2TB" }, options: { colors: ["Blue", "Red", "Black"], sizes: ["One Size"] }, distance: 48 },
    { id: 20, images: ["https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg"], name: "Men's Casual Slim Fit Shirt", price: 15.99, originalPrice: 20.00, description: "The color could be slightly different in practice.", category: "men's clothing", rating: { rate: 2.1, count: 430 }, stock: 150, brand: "Generic", seller: { name: "Fashion Hub", location: "Delhi, IN", phone: "+919876543210" }, specs: { material: "Polyester" }, options: { colors: ["Blue", "Black", "Charcoal"], sizes: ["S", "M", "L"] }, distance: 9 }
];

// --- 2. GENERATE THE REMAINING 80 PRODUCTS ---
const generatedProducts = [...Array(80)].map((_, i) => {
    const baseIndex = i % 20;
    const baseProduct = baseProducts[baseIndex];
    const newId = 21 + i;
    const newPrice = parseFloat((baseProduct.price * (0.95 + Math.random() * 0.1)).toFixed(2));
    
    return {
        ...baseProduct,
        id: newId,
        name: `${baseProduct.name} - ${baseProduct.options.colors[i % baseProduct.options.colors.length]} Edition`,
        price: newPrice,
        originalPrice: parseFloat((newPrice * 1.25).toFixed(2)),
        rating: {
            rate: parseFloat((3.0 + Math.random() * 2.0).toFixed(1)),
            count: Math.floor(50 + Math.random() * 500)
        },
        stock: Math.floor(10 + Math.random() * 200),
        distance: parseFloat((1 + Math.random() * 149).toFixed(1)),
    };
});

// --- 3. EXPORT THE COMBINED DATABASE OF 100 PRODUCTS ---
export const mockProductDatabase = [...baseProducts, ...generatedProducts];


// --- 4. EXPORT DATA FOR THE HOME PAGE ---
export const mockPopularStores = [
    { id: 1, image: "https://images.pexels.com/photos/5632403/pexels-photo-5632403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", title: "Sri Lakshmi Electronics - Local Store", rating: { rate: 4.8 } },
    { id: 2, image: "https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", title: "Amazon Global Deals", rating: { rate: 4.6 } },
    { id: 3, image: "https://images.pexels.com/photos/5632375/pexels-photo-5632375.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", title: "Kirana Mart - Local Shop", rating: { rate: 4.7 } },
    { id: 4, image: "https://images.pexels.com/photos/5650019/pexels-photo-5650019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", title: "Flipkart Exclusive Store", rating: { rate: 4.5 } },
];

export const mockCategories = [
    { name: "Local Shops", image: "https://images.pexels.com/photos/5650025/pexels-photo-5650025.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", path: "/products" },
    { name: "Global Stores", image: "https://images.pexels.com/photos/5632404/pexels-photo-5632404.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", path: "/products" },
    { name: "Grocery & Essentials", image: "https://images.pexels.com/photos/5632398/pexels-photo-5632398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", path: "/products" },
    { name: "Electronics", image: "https://images.pexels.com/photos/5632395/pexels-photo-5632395.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", path: "/products" },
    { name: "Fashion & Lifestyle", image: "https://images.pexels.com/photos/5632401/pexels-photo-5632401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", path: "/products" },
];

export const galleryImages = [
    "https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg",
    "https://images.pexels.com/photos/5632372/pexels-photo-5632372.jpeg",
    "https://images.pexels.com/photos/5632379/pexels-photo-5632379.jpeg",
    "https://images.pexels.com/photos/5632400/pexels-photo-5632400.jpeg",
];

export const testimonials = [
    { name: "Rahul Sharma", rating: 5, text: "Local Global Shops helped me compare prices between my nearby store and Amazon instantly! The negotiation feature is amazing.", image: "https://i.pravatar.cc/150?img=12" },
    { name: "Priya Verma", rating: 5, text: "Super-fast delivery and local support. I love that I can support small stores while still accessing global brands.", image: "https://i.pravatar.cc/150?img=5" },
    { name: "Rohit Kumar", rating: 4, text: "Clean UI, smart price suggestions, and trusted sellers. I’ve already switched to this app for all my home shopping!", image: "https://i.pravatar.cc/150?img=32" },
];