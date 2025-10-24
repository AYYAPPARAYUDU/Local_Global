import React, { useEffect, useRef } from 'react';
import '../pages/styles/components/Map.css'; 

// --- IMPORTANT ---
// For this component to work, you MUST add the Leaflet map library to your main
// public/index.html file. Add these two lines inside the <head> section:
//
// <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
// <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
//
// --- --- --- --- ---

const Map = ({ lat, lng }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        // Check if Leaflet (L) is loaded and the map container exists
        if (window.L && mapRef.current) {
            // If a map instance doesn't exist, create one
            if (!mapInstance.current) {
                mapInstance.current = window.L.map(mapRef.current).setView([lat, lng], 14);
                
                // Add the tile layer (the map 'skin')
                window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(mapInstance.current);

                // Add the pin/marker
                window.L.marker([lat, lng]).addTo(mapInstance.current);
            } else {
                // If map already exists, just move the view
                mapInstance.current.setView([lat, lng], 14);
            }
        }

        // Cleanup function to remove the map when the component unmounts
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [lat, lng]); // Re-run this effect if the lat/lng props change

    // The mapRef is attached to this div
    return <div id="map-container" ref={mapRef}></div>;
};

export default Map;