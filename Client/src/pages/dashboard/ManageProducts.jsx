import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiUploadCloud, FiX } from 'react-icons/fi';
import Spinner from '../../components/Spinner';
import apiService from '../../services/api';
import './ManageProducts.css';

const emptyProduct = { _id: null, name: '', description: '', price: '', stock: '', category: 'electronics', brand: '', image: null };
const PRODUCTS_PER_PAGE = 7;

const ManageProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const constraintsRef = useRef(null);
    const dragControls = useDragControls();

    const fetchProducts = async () => {
        try {
            const res = await apiService.getShopkeeperProducts();
            setProducts(res.data);
        } catch (error) { console.error("Failed to fetch products:", error); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, []);

    const paginatedProducts = useMemo(() => {
        const filtered = products
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
        return filtered.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
    }, [products, searchTerm, currentPage]);

    const totalPages = Math.ceil(products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).length / PRODUCTS_PER_PAGE);

    const handleOpenEditModal = (product) => { setEditingProduct({ ...product }); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setEditingProduct(null); setImageFile(null); };
    const handleFormChange = (e) => setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
    const handleFileChange = (e) => { if (e.target.files[0]) setImageFile(e.target.files[0]); };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData();
        Object.keys(editingProduct).forEach(key => { if (key !== '_id' && editingProduct[key] !== null) formData.append(key, editingProduct[key]); });
        if (imageFile) formData.append('image', imageFile);

        try {
            await apiService.updateProduct(editingProduct._id, formData);
            await fetchProducts();
        } catch (error) {
            alert("Error: Could not update product.");
        } finally {
            setIsSaving(false);
            handleCloseModal();
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure?")) {
            try {
                await apiService.deleteProduct(productId);
                await fetchProducts();
            } catch (error) {
                alert("Error: Could not delete product.");
            }
        }
    };
    
    if (loading) return <Spinner />;

    return (
        <>
            <motion.header className="dashboard-header" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
                <h1>Manage Products</h1>
                <div className="header-controls">
                    <div className="dashboard-search">
                        <span className="icon"><FiSearch /></span>
                        <input type="text" placeholder="Search products..." onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}/>
                    </div>
                    <button className="add-btn btn btn-primary" onClick={() => navigate('/dashboard/add-product')}>
                        <FiPlus /> Add Product
                    </button>
                </div>
            </motion.header>

            <motion.div className="product-list-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {paginatedProducts.map((p) => (
                    <motion.div className="product-list-item" key={p._id} layout>
                        <img src={p.image} alt={p.name} className="product-list-image" />
                        <div className="product-list-info">
                            <h3>{p.name}</h3>
                            <p>{p.category} • {p.brand}</p>
                        </div>
                        <div className="list-item-price">₹{p.price.toFixed(2)}</div>
                        <div className="list-item-stock">
                            <span className={`badge ${p.stock === 0 ? 'bg-danger' : 'bg-success'}`}>{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</span>
                        </div>
                        <div className="product-list-actions">
                            <button className="edit-btn" title="Edit" onClick={() => handleOpenEditModal(p)}><FiEdit /></button>
                            <button className="delete-btn" title="Delete" onClick={() => handleDeleteProduct(p._id)}><FiTrash2 /></button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
            
            {products.length > 0 && paginatedProducts.length === 0 && (
                <p className="no-products">No products found matching your search.</p>
            )}
            {products.length === 0 && (
                <p className="no-products">You have no products yet. Click "Add Product" to start.</p>
            )}

            {totalPages > 1 && (
                 <div className="pagination-container">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
                    <span className="page-info">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        ref={constraintsRef}
                        className="modal-overlay" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                    >
                        <motion.div 
                            className="product-modal" 
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.9, opacity: 0 }}
                            drag
                            dragListener={false}
                            dragControls={dragControls}
                            dragConstraints={constraintsRef}
                            dragMomentum={false}
                        >
                            <motion.div 
                                className="modal-header"
                                onPointerDown={(event) => dragControls.start(event)}
                            >
                                <h3>Edit Product</h3>
                                <button className="btn-close" onClick={handleCloseModal}><FiX /></button>
                            </motion.div>
                            <form id="product-form" onSubmit={handleFormSubmit}>
                                <div className="modal-body">
                                    <div className="modal-form">
                                        <div className="form-group full-width"><label>Product Image</label><div className="file-input-wrapper" onClick={() => document.getElementById('imageUpload').click()}><FiUploadCloud size={24} className="mx-auto mb-2 text-muted"/><span>{imageFile ? imageFile.name : (editingProduct.image ? "Change Image" : "Click to upload an image")}</span></div><input type="file" id="imageUpload" name="image" onChange={handleFileChange} hidden accept="image/*" /></div>
                                        <div className="form-group full-width"><label htmlFor="name">Product Name</label><input type="text" id="name" name="name" value={editingProduct.name || ''} onChange={handleFormChange} required /></div>
                                        <div className="form-group full-width"><label htmlFor="description">Description</label><textarea id="description" name="description" value={editingProduct.description || ''} onChange={handleFormChange}></textarea></div>
                                        <div className="form-group"><label htmlFor="price">Price</label><input type="number" id="price" name="price" value={editingProduct.price || ''} onChange={handleFormChange} required min="0" step="0.01" /></div>
                                        <div className="form-group"><label htmlFor="stock">Stock</label><input type="number" id="stock" name="stock" value={editingProduct.stock || ''} onChange={handleFormChange} required min="0" /></div>
                                        <div className="form-group"><label htmlFor="category">Category</label><select id="category" name="category" value={editingProduct.category} onChange={handleFormChange}><option>men's clothing</option><option>women's clothing</option><option>electronics</option><option>jewelery</option></select></div>
                                        <div className="form-group"><label htmlFor="brand">Brand</label><input type="text" id="brand" name="brand" value={editingProduct.brand || ''} onChange={handleFormChange} /></div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal} disabled={isSaving}>Cancel</button>
                                    <button type="submit" form="product-form" className="btn btn-primary" disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ManageProducts;