import React from 'react';
import apiFetch from '@wordpress/api-fetch';
import { LocaleProvider } from '@douyinfe/semi-ui';
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
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
const rootElement = document.getElementById('mos-product-specifications-tab-groups');

// Check if the root element exists before rendering
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement); // Create a root
    root.render(
        <LocaleProvider locale={en_US}>
            <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, quasi nesciunt, tempora dolorum amet quae temporibus veniam ratione assumenda est praesentium aperiam laudantium voluptatum maiores magnam commodi dolor iure illum vero voluptate illo. Hic, possimus? Nihil, voluptatibus quia. Earum eligendi laudantium nisi accusantium quas repellendus fuga minus nobis expedita molestiae.</div>
        </LocaleProvider>
    ); // Render the App component
} else {
    console.error("Target container '#mos-product-specifications-tab-groups' not found in the DOM.");
}