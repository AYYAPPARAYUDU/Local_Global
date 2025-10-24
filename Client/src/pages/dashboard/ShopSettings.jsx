import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../../services/api';
import Spinner from '../../components/Spinner';
import { FiUser, FiMapPin, FiFileText, FiCreditCard, FiSave, FiTarget } from 'react-icons/fi';
import './ShopSettings.css';
// Note: This component also requires the Leaflet CSS/JS to be added to your main index.html
// <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
// <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>

const ShopSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    const [profile, setProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [coords, setCoords] = useState({ lat: 20.5937, lng: 78.9629 }); // Default to center of India

    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        const fetchShopData = async () => {
            try {
                const res = await apiService.getShopProfile();
                if (res.data) {
                    setProfile(res.data);
                    if (res.data.location?.coordinates?.length === 2) {
                        // Coordinates are [lng, lat] in GeoJSON, but Leaflet needs [lat, lng]
                        setCoords({ lat: res.data.location.coordinates[1], lng: res.data.location.coordinates[0] });
                    }
                }
            } catch (err) { setError("Failed to load shop data."); } 
            finally { setLoading(false); }
        };
        fetchShopData();
    }, []);

    useEffect(() => {
        if (activeTab !== 'location' || !window.L) return;
        
        const initMap = () => {
            setTimeout(() => {
                if (document.getElementById('map') && !mapRef.current) {
                    mapRef.current = window.L.map('map').setView([coords.lat, coords.lng], 14);
                    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
                    markerRef.current = window.L.marker([coords.lat, coords.lng], { draggable: true }).addTo(mapRef.current);
                    markerRef.current.on('dragend', (e) => setCoords({ lat: e.target.getLatLng().lat, lng: e.target.getLatLng().lng }));
                }
            }, 100); // Small delay to ensure the map div is rendered
        };
        initMap();

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [activeTab, coords.lat, coords.lng]);

    const handleProfileChange = (e) => setProfile({...profile, [e.target.name]: e.target.value });

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true); setMessage(''); setError('');
        try {
            const res = await apiService.updateShopProfile(profile);
            setProfile(res.data); // Update state with the saved data
            setMessage('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) { setError('Failed to save changes.'); } 
        finally { setIsSaving(false); }
    };
    
    const handleSaveLocation = async () => {
        setIsSaving(true); setMessage(''); setError('');
        try {
            await apiService.updateShopLocation({ latitude: coords.lat, longitude: coords.lng });
            setMessage('Location updated successfully!');
        } catch (err) { setError('Failed to save location.'); } 
        finally { setIsSaving(false); }
    };

    const handleFindMyLocation = () => {
        navigator.geolocation.getCurrentPosition(pos => {
            const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setCoords(newCoords);
            if (mapRef.current) {
                mapRef.current.setView(newCoords, 16);
                markerRef.current.setLatLng(newCoords);
            }
        }, () => setError('Could not get your location.'));
    };
    
    if(loading) return <Spinner />;

    return (
        <div className="settings-page">
            <motion.header className="dashboard-header" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}><h1>Shop Settings</h1></motion.header>
            <div className="settings-layout">
                <motion.nav className="tabs-nav" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                    <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><FiUser/> Shop Profile</button>
                    <button className={`tab-btn ${activeTab === 'location' ? 'active' : ''}`} onClick={() => setActiveTab('location')}><FiMapPin/> Location</button>
                    <button className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}><FiCreditCard/> Payments</button>
                    <button className={`tab-btn ${activeTab === 'policies' ? 'active' : ''}`} onClick={() => setActiveTab('policies')}><FiFileText/> Policies</button>
                </motion.nav>
                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} className="tab-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        {activeTab === 'profile' && (
                            <form onSubmit={handleSaveProfile}>
                                <h5>Edit Your Shop Profile</h5>
                                <div className="form-group"><label>Shop Name</label><input name="shopName" value={profile.shopName || ''} onChange={handleProfileChange} disabled={!isEditing} /></div>
                                <div className="form-group"><label>Contact Email</label><input type="email" name="email" value={profile.email || ''} onChange={handleProfileChange} disabled={!isEditing} /></div>
                                <div className="form-group"><label>Contact Phone</label><input name="phone" value={profile.phone || ''} onChange={handleProfileChange} disabled={!isEditing} /></div>
                                <div className="form-group"><label>Shop Description</label><textarea name="description" value={profile.description || ''} onChange={handleProfileChange} disabled={!isEditing}></textarea></div>
                                {isEditing ? (
                                    <div className="d-flex gap-2">
                                        <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary" disabled={isSaving}>{isSaving ? <Spinner size="sm"/> : <><FiSave/> Save Changes</>}</button>
                                    </div>
                                ) : ( <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button> )}
                            </form>
                        )}
                        {activeTab === 'location' && (
                            <div>
                                <h5>Set Your Shop's Location</h5>
                                <p className="text-muted">Drag the pin on the map to the exact location of your storefront.</p>
                                <div id="map" className="my-4"></div>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-secondary" onClick={handleFindMyLocation}><FiTarget/> Find My Location</button>
                                    <button type="button" className="btn btn-primary" onClick={handleSaveLocation} disabled={isSaving}>{isSaving ? <Spinner size="sm"/> : <><FiSave/> Save Location</>}</button>
                                </div>
                            </div>
                        )}
                        {activeTab === 'payments' && (
                             <form onSubmit={handleSaveProfile}>
                                <h5>Payment Information</h5>
                                <p className="text-muted">Enter the details for receiving payments from your sales.</p>
                                <div className="form-group"><label>Your UPI ID</label><input name="upiId" value={profile.upiId || ''} onChange={handleProfileChange} placeholder="your-vpa@okhdfcbank" /></div>
                                <button type="submit" className="btn btn-primary" disabled={isSaving}>{isSaving ? <Spinner size="sm"/> : <><FiSave/> Save Payment Details</>}</button>
                            </form>
                        )}
                        {activeTab === 'policies' && (
                            <form onSubmit={handleSaveProfile}>
                                <h5>Manage Your Shop Policies</h5>
                                <div className="form-group"><label>Return Policy</label><textarea name="returnPolicy" value={profile.returnPolicy || ''} onChange={handleProfileChange}></textarea></div>
                                <button type="submit" className="btn btn-primary" disabled={isSaving}>{isSaving ? <Spinner size="sm"/> : <><FiSave/> Save Policy</>}</button>
                            </form>
                        )}
                        <AnimatePresence>
                            {message && <motion.div className="alert alert-success">{message}</motion.div>}
                            {error && <motion.div className="alert alert-danger">{error}</motion.div>}
                        </AnimatePresence>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ShopSettings;