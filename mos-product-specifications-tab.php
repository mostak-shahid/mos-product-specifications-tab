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
 * Plugin Name:       MOS Product Specifications for WooCommerce
 * Plugin URI:        https://mostak-shahid.github.io/plugins/mos-product-specifications-tab.html
 * Description:       Create professional, structured WooCommerce product specification tables with unlimited rows, drag & drop sorting, tooltips, and responsive design — lightweight and SEO-friendly.
 * Version:           1.0.2
 * Author:            Md. Mostak Shahid
 * Author URI:        https://mostak-shahid.github.io/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       mos-product-specifications-tab
 * Domain Path:       /languages
 */

defined('ABSPATH') || exit;
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

require_once MOS_PRODUCT_SPECIFICATIONS_TAB_PATH . '/vendor/autoload.php';
require_once MOS_PRODUCT_SPECIFICATIONS_TAB_PATH . '/mos-product-specifications-tab-functions.php';

/**
 * The code that runs during plugin activation.
 * This action is documented in src/Core/Activator.php
 */
function mos_product_specifications_tab_activate()
{
	\MosPress\MosProductSpecificationsTab\Core\Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in src/Core/Deactivator.php
 */
function mos_product_specifications_tab_deactivate()
{
	\MosPress\MosProductSpecificationsTab\Core\Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'mos_product_specifications_tab_activate');
register_deactivation_hook(__FILE__, 'mos_product_specifications_tab_deactivate');


/**
 * Register WP-CLI commands only if file exists
 */
if ( defined( 'WP_CLI' ) && WP_CLI && file_exists( plugin_dir_path( __FILE__ ) . 'includes/CLI/CLI_Command.php' ) ) {
    $cli_file = plugin_dir_path( __FILE__ ) . 'includes/CLI/CLI_Command.php';
    
    if ( file_exists( $cli_file ) ) {
        WP_CLI::add_command( 'mos-product-specifications-tab', 'MosPress\MosProductSpecificationsTab\CLI\CLI_Command' );
    }
}

use MosPress\MosProductSpecificationsTab\Plugin;

// Plugin::get_instance();
new Plugin();