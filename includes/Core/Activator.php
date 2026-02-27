<?php

namespace MosPress\MosProductSpecificationsTab\Core;
use MosPress\MosProductSpecificationsTab\Helpers\CryptoHelper;
/**
 * Fired during plugin activation
 *
 * @link       https://mostak-shahid.github.io/
 * @since      1.0.0
 *
 * @package    Mos_Product_Specifications_Tab
 * @subpackage Mos_Product_Specifications_Tab/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Mos_Product_Specifications_Tab
 * @subpackage Mos_Product_Specifications_Tab/includes
 * @author     Programmelab <mostak.shahid@gmail.com>
 */
class Activator
{

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate()
	{
		$mos_product_specifications_tab_options = mos_product_specifications_tab_get_option();
		update_option('mos_product_specifications_tab_options', $mos_product_specifications_tab_options);
		add_option('mos_product_specifications_tab_do_activation_redirect', true);

		self::create_logs_table();

		// Check if OpenSSL is available
        if ( ! CryptoHelper::is_encryption_available() ) {
            wp_die(
                esc_html__( 'OpenSSL is required but not available on your server. Please contact your hosting provider.', 'mos-product-specifications-tab' ),
                esc_html__( 'Plugin Activation Error', 'mos-product-specifications-tab' ),
                array( 'back_link' => true )
            );
        }

        // Generate random 8-digit string
        $random_key = CryptoHelper::generate_random_string( 8 );

        // Encrypt the key
        $encrypted_key = CryptoHelper::encrypt( $random_key );

        if ( false === $encrypted_key ) {
            wp_die(
                esc_html__( 'Failed to generate secure deactivation key. Please try again.', 'mos-product-specifications-tab' ),
                esc_html__( 'Plugin Activation Error', 'mos-product-specifications-tab' ),
                array( 'back_link' => true )
            );
        }

        // Store the encrypted key in options
        update_option( 'mos_product_specifications_tab_deactive_key', $encrypted_key, false );

        // Log activation if debugging is enabled
        // if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
        //     error_log( 'Product specifications tab for WooCommerce activated with secure deactivation key' );
        // }

        // Flush rewrite rules
        flush_rewrite_rules();

        // Set activation flag for any one-time notices
        set_transient( 'mos_product_specifications_tab_activation_notice', true, 30 );
	}

	private static function create_logs_table()
	{
		global $wpdb;
		$table_name = $wpdb->prefix . 'mos_product_specifications_tab_logs';
		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE $table_name (
			ID bigint(20) NOT NULL AUTO_INCREMENT,
			user_id bigint(20) NOT NULL,
			ip varchar(45) NOT NULL,
			user_agent text NOT NULL,
			title varchar(255) NOT NULL,
			category varchar(45) NOT NULL,
			description longtext NOT NULL,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY  (ID)
		) $charset_collate;";

		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($sql);
	}
}



