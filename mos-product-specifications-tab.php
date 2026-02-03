<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://mostak-shahid.github.io/
 * @since             1.0.0
 * @package           MosProductSpecificationsTab
 *
 * @wordpress-plugin
 * Plugin Name:       Product specifications tab for WooCommerce
 * Plugin URI:        https://mostak-shahid.github.io/mos-product-specifications-tab/
 * Description:       You can add an infinite number of specs to any or all of your products using the Product specifications tab for WooCommerce plugin. You can add any kind of information to the product using the WYSIWYG editor available to each group. The options are unlimited.
 * Version:           1.0.2
 * Author:            Md. Mostak Shahid
 * Author URI:        https://mostak-shahid.github.io/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       mos-product-specifications-tab
 * Domain Path:       /languages
 *
 * Requires Plugins: woocommerce
 * WC requires at least: 7.0
 * WC tested up to: 9.0
 *
 * Requires PHP: 7.4
 * Requires at least: 6.0
 */

// If this file is called directly, abort.
if (!defined('ABSPATH')) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define('MOS_PRODUCT_SPECIFICATIONS_TAB_VERSION', '1.0.2');
define('MOS_PRODUCT_SPECIFICATIONS_TAB_NAME', 'Product specifications tab for WooCommerce');
define('MOS_PRODUCT_SPECIFICATIONS_TAB_PATH', plugin_dir_path(__FILE__));
define('MOS_PRODUCT_SPECIFICATIONS_TAB_URL', plugin_dir_url(__FILE__));
define('MOS_PRODUCT_SPECIFICATIONS_TAB_MAIN_FILE', __FILE__);
/**
 * The code that runs during plugin activation.
 * This action is documented in src/Core/Activator.php
 */
function mos_product_specifications_tab_activate()
{
	require_once MOS_PRODUCT_SPECIFICATIONS_TAB_PATH . '/vendor/autoload.php';
	\MosPress\MosProductSpecificationsTab\Core\Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in src/Core/Deactivator.php
 */
function mos_product_specifications_tab_deactivate()
{
	require_once MOS_PRODUCT_SPECIFICATIONS_TAB_PATH . '/vendor/autoload.php';
	\MosPress\MosProductSpecificationsTab\Core\Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'mos_product_specifications_tab_activate');
register_deactivation_hook(__FILE__, 'mos_product_specifications_tab_deactivate');

require_once MOS_PRODUCT_SPECIFICATIONS_TAB_PATH . '/vendor/autoload.php';
require_once MOS_PRODUCT_SPECIFICATIONS_TAB_PATH . '/includes/mos-product-specifications-tab-functions.php';

/**
 * Register WP-CLI commands only if file exists
 */
if ( defined( 'WP_CLI' ) && WP_CLI ) {
    $cli_file = plugin_dir_path( __FILE__ ) . 'php/CLI/CLI_Command.php';
    
    if ( file_exists( $cli_file ) ) {
        WP_CLI::add_command( 'mos-product-specifications-tab', 'MosPress\MosProductSpecificationsTab\CLI\CLI_Command' );
    }
}

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function mos_product_specifications_tab_run()
{
	$plugin = new \MosPress\MosProductSpecificationsTab\Core\MosProductSpecificationsTab();
	// $plugin->run();
}
mos_product_specifications_tab_run();

// For WooCommerce Compatibility
/* Check if WooCommerce is active */
add_action( 'plugins_loaded', function () {
	if ( ! class_exists( 'WooCommerce' ) ) {
		add_action( 'admin_notices', function () {
			echo '<div class="notice notice-error"><p>';
			echo esc_html__( 'Product specifications tab for WooCommerce requires WooCommerce to be installed and active.', 'mos-product-specifications-tab' );
			echo '</p></div>';
		} );
		return;
	}
} );
/* Declare compatibility with WooCommerce Custom Order Tables feature */
add_action( 'before_woocommerce_init', function () {
	if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
		\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility(
			'custom_order_tables',
			__FILE__,
			true
		);
	}
} );
/* Declare compatibility with WooCommerce Custom Order Tables feature */
add_action( 'before_woocommerce_init', function () {
	if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
		\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility(
			'cart_checkout_blocks',
			__FILE__,
			true
		);
	}
} );

register_activation_hook( __FILE__, function () {
	if ( ! class_exists( 'WooCommerce' ) ) {
		deactivate_plugins( plugin_basename( __FILE__ ) );
		wp_die(
			esc_html__( 'This plugin requires WooCommerce to be installed and active.', 'your-plugin-textdomain' ),
			'Plugin dependency check',
			[ 'back_link' => true ]
		);
	}
} );

