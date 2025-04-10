<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://www.mdmostakshahid.com/
 * @since             1.0.0
 * @package           Mos_Product_Specifications_Tab
 *
 * @wordpress-plugin
 * Plugin Name:       Mos Product Specifications Tab
 * Plugin URI:        https://www.mdmostakshahid.com/mos-product-specifications-tab/
 * Description:       You can add an infinite number of specs to any or all of your products using the Product specifications tab for WooCommerce plugin. You can add any kind of information to the product using the WYSIWYG editor available to each group. The options are unlimited.
 * Version:           1.0.0
 * Author:            Md. Mostak Shahid
 * Author URI:        https://www.mdmostakshahid.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       mos-product-specifications-tab
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'MOS_PRODUCT_SPECIFICATIONS_TAB_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-mos-product-specifications-tab-activator.php
 */
function mos_product_specifications_tab_activate() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-mos-product-specifications-tab-activator.php';
	Mos_Product_Specifications_Tab_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-mos-product-specifications-tab-deactivator.php
 */
function mos_product_specifications_tab_deactivate() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-mos-product-specifications-tab-deactivator.php';
	Mos_Product_Specifications_Tab_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'mos_product_specifications_tab_activate' );
register_deactivation_hook( __FILE__, 'mos_product_specifications_tab_deactivate' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-mos-product-specifications-tab.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function mos_product_specifications_tab_run() {

	$plugin = new Mos_Product_Specifications_Tab();
	$plugin->run();

}
mos_product_specifications_tab_run();
