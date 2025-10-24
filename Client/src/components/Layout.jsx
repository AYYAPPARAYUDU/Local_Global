import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    return (
        <>
            <Navbar />
            <main>
                {/* The <Outlet /> renders the specific page component for the current route */}
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default Layout;