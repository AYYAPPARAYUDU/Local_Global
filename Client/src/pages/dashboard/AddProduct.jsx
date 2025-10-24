import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiSave } from 'react-icons/fi';
import apiService from '../../services/api';
import './ManageProducts.css'; // We reuse the same CSS for a consistent look

const emptyProduct = { name: '', description: '', price: '', stock: '', category: 'electronics', brand: '' };

const AddProduct = () => {
    const [formData, setFormData] = useState(emptyProduct);
    const [imageFile, setImageFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const productData = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key]) productData.append(key, formData[key]);
        });
        if (imageFile) {
            productData.append('image', imageFile);
        }

        try {
            await apiService.createProduct(productData);
            alert('Product created successfully!');
            navigate('/dashboard/products'); // Redirect back to the main product list
        } catch (error) {
            console.error("Failed to create product:", error);
            alert("Error: Could not save product.");
            setIsSaving(false);
        }
    };

    return (
        <>
            <motion.header 
                className="dashboard-header" 
                initial={{ opacity: 0, y: -30 }} 
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>Add a New Product</h1>
            </motion.header>

            <motion.div 
                className="product-form-container" // Use a more semantic class name
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <form id="add-product-form" onSubmit={handleFormSubmit}>
                    <div className="modal-body">
                        <div className="modal-form">
                            <div className="form-group full-width">
                                <label>Product Image</label>
                                <div className="file-input-wrapper" onClick={() => document.getElementById('imageUpload').click()}>
                                    <FiUploadCloud size={24} />
                                    <span>{imageFile ? imageFile.name : "Click to upload an image"}</span>
                                </div>
                                <input type="file" id="imageUpload" name="image" onChange={handleFileChange} hidden accept="image/*" />
                            </div>
                            <div className="form-group full-width"><label htmlFor="name">Product Name</label><input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} required /></div>
                            <div className="form-group full-width"><label htmlFor="description">Description</label><textarea id="description" name="description" value={formData.description} onChange={handleFormChange}></textarea></div>
                            <div className="form-group"><label htmlFor="price">Price (₹)</label><input type="number" id="price" name="price" value={formData.price} onChange={handleFormChange} required min="0" step="0.01" /></div>
                            <div className="form-group"><label htmlFor="stock">Stock</label><input type="number" id="stock" name="stock" value={formData.stock} onChange={handleFormChange} required min="0" /></div>
                            <div className="form-group"><label htmlFor="category">Category</label><select id="category" name="category" value={formData.category} onChange={handleFormChange}><option>electronics</option><option>accessories</option><option>men's clothing</option><option>women's clothing</option></select></div>
                            <div className="form-group"><label htmlFor="brand">Brand</label><input type="text" id="brand" name="brand" value={formData.brand} onChange={handleFormChange} /></div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/products')}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={isSaving}>
                            {isSaving ? <Spinner size="sm" /> : <FiSave className="me-2" />}
                            {isSaving ? "Saving..." : "Save Product"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </>
    );
};

export default AddProduct;