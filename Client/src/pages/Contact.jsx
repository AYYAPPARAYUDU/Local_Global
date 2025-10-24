import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
// Navbar and Footer are handled by App.js and the Layout component

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would send data to your backend API
        console.log("Form submitted:", formData);
        alert("✅ Thank you for your message! We will get back to you soon.");
        setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
    };

    return (
        <div className="contact-page">
            <header className="page-header">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1>Get in Touch</h1>
                    <p>Have questions or feedback? Our team is here to help. Let's connect!</p>
                </motion.div>
            </header>

            <main className="container section-padding">
                <div className="row g-5">
                    {/* --- Left Column: Contact Form --- */}
                    <motion.div
                        className="col-lg-7"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="contact-form-section">
                            <h3>Send us a Message</h3>
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Full Name</label>
                                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email Address</label>
                                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Subject</label>
                                        <input type="text" className="form-control" name="subject" value={formData.subject} onChange={handleChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Message</label>
                                        <textarea className="form-control" name="message" value={formData.message} onChange={handleChange} required></textarea>
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary">Send Message</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>

                    {/* --- Right Column: Contact Info --- */}
                    <motion.div
                        className="col-lg-5"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="contact-info-section">
                            <h3>Contact Information</h3>
                            <div className="info-item">
                                <div className="info-icon"><FiMapPin /></div>
                                <div>
                                    <h5>Head Office</h5>
                                    <p>8-14 Murikipudi, Chilakaluripeta, Andhra Pradesh, India</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon"><FiMail /></div>
                                <div>
                                    <h5>Email Us</h5>
                                    <a href="mailto:support@localglobalshops.com">support@localglobalshops.com</a>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon"><FiPhone /></div>
                                <div>
                                    <h5>Call Us</h5>
                                    <a href="tel:+911234567890">+91 12345 67890</a>
                                </div>
                            </div>
                            <div className="contact-map">
                                <a href="#" target="_blank" rel="noopener noreferrer">
                                    <img src="https://www.e-world-energy-water.com/media/2023/presse/anreise/gmaps.jpg" alt="Our Location on Map" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Contact;