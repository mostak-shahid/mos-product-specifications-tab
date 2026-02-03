import React from 'react';
import {
    //BrowserRouter,
    HashRouter
} from 'react-router-dom';
import App from './App';
import apiFetch from '@wordpress/api-fetch';
// Configure apiFetch with REST API settings
// WordPress automatically uses window.wpApiSettings if available
// Fallback to manual configuration if needed
if (typeof window.wpApiSettings === 'undefined' && typeof mos_product_specifications_tab_ajax_obj !== 'undefined') {
    window.wpApiSettings = {
        root: mos_product_specifications_tab_ajax_obj.root,
        nonce: mos_product_specifications_tab_ajax_obj.nonce
    };
}

// Ensure apiFetch uses the configured settings
if (typeof window.wpApiSettings !== 'undefined') {
    apiFetch.use(apiFetch.createRootURLMiddleware(window.wpApiSettings.root));
    apiFetch.use(apiFetch.createNonceMiddleware(window.wpApiSettings.nonce));
}
// Get the container element
const rootElement = document.getElementById('mos-product-specifications-tab-settings-react-app');

// Check if the root element exists before rendering
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement); // Create a root
    root.render(
        <HashRouter>
            <App />
        </HashRouter>
    ); // Render the App component
} else {
    console.error("Target container '#mos-product-specifications-tab-settings-react-app' not found in the DOM.");
}
