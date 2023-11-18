// components/Layout.js
import React from 'react';

const Layout = ({ children }) => {
    return (
        <div style={{ padding: '20px' }}> {/* Adjust the padding value as needed */}
            {children}
        </div>
    );
};

export default Layout;
