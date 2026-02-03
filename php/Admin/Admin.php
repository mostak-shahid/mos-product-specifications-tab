<?php

namespace MosPress\MosProductSpecificationsTab\Admin;

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://mostak-shahid.github.io/
 * @since      1.0.0
 *
 * @package    Mos_Product_Specifications_Tab
 * @subpackage Mos_Product_Specifications_Tab/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Mos_Product_Specifications_Tab
 * @subpackage Mos_Product_Specifications_Tab/admin
 * @author     Md. Mostak Shahid <mostak.shahid@gmail.com>
 */
class Admin
{

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct($plugin_name, $version)
	{

		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles($hook)
	{
		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		// $current_screen = get_current_screen();
		// if ($current_screen->id == 'toplevel_page_mos-product-specifications-tab') {
		// 	wp_enqueue_style($this->plugin_name . '-react', MOS_PRODUCT_SPECIFICATIONS_TAB_URL . 'build/index.css');
		// }

		if ($hook == 'toplevel_page_mos-product-specifications-tab') {
			wp_enqueue_style($this->plugin_name . '-react', MOS_PRODUCT_SPECIFICATIONS_TAB_URL . 'build/index.css');
		}
		// wp_enqueue_style($this->plugin_name . 'jquery-ui', MOS_PRODUCT_SPECIFICATIONS_TAB_URL . 'assets/css/jquery-ui.css', array(), $this->version, 'all');
		wp_enqueue_style($this->plugin_name, MOS_PRODUCT_SPECIFICATIONS_TAB_URL . 'assets/css/style.css', array(), $this->version, 'all');
		wp_enqueue_style($this->plugin_name . '-admin', MOS_PRODUCT_SPECIFICATIONS_TAB_URL . 'admin/css/admin-style.css', array(), $this->version, 'all');
		wp_enqueue_style( 'wp-components' );
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts($hook)
	{

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		wp_enqueue_script($this->plugin_name, MOS_PRODUCT_SPECIFICATIONS_TAB_URL . 'assets/js/script.js', array('jquery'), $this->version, false);
		wp_enqueue_script('jquery');
		wp_enqueue_media();
		if ($hook == 'toplevel_page_mos-product-specifications-tab') {
			wp_enqueue_script(
				$this->plugin_name . '-react',
				MOS_PRODUCT_SPECIFICATIONS_TAB_URL . 'build/index.js',
				array('wp-element', 'wp-components', 'wp-api-fetch', 'wp-i18n', 'wp-media-utils', 'wp-block-editor', 'react', 'react-dom'),
				$this->version,
				true
			);
			
			// Configure wp-api-fetch with proper settings before React loads
			wp_add_inline_script(
				$this->plugin_name . '-react',
				sprintf(
					'window.wpApiSettings = { root: "%s", nonce: "%s" };',
					esc_url_raw( rest_url() ),
					wp_create_nonce( 'wp_rest' )
				),
				'before'
			);
		}

		wp_enqueue_script($this->plugin_name . '-admin-ajax', MOS_PRODUCT_SPECIFICATIONS_TAB_URL . 'admin/js/admin-ajax.js', array('jquery'), $this->version, false);
		wp_enqueue_script($this->plugin_name . '-admin-script', MOS_PRODUCT_SPECIFICATIONS_TAB_URL . 'admin/js/admin-script.js', array('jquery'), $this->version, false);
		$ajax_params = [
			'admin_url' => admin_url(),
			'home_url' => home_url(),
			'ajax_url' => admin_url('admin-ajax.php'),
			'image_url' => MOS_PRODUCT_SPECIFICATIONS_TAB_URL . 'assets/images/',
			'_admin_nonce' => esc_attr(wp_create_nonce('mos_product_specifications_tab_admin_nonce')),
			'api_nonce' => esc_attr(wp_create_nonce('wp_rest')),
			'get_current_user_id' => get_current_user_id(),
			'root'  => esc_url_raw( rest_url() ),
    		'nonce' => wp_create_nonce('wp_rest'),
			'default_colors' => mos_product_specifications_tab_get_default_colors(),
			'default_gradients' => mos_product_specifications_tab_get_default_gradients(),
			// 'isPro' => is_plugin_active( 'mos-product-specifications-tab-pro/mos-product-specifications-tab-pro.php' ) ? true : false,
			// 'install_plugin_wpnonce' => esc_attr(wp_create_nonce('updates')),
		];
		if (is_plugin_active( 'mos-product-specifications-tab-pro/mos-product-specifications-tab-pro.php' )) {
			$plugins = get_plugins();
			$version = $plugins['mos-product-specifications-tab-pro/mos-product-specifications-tab-pro.php']['Version'];
			$ajax_params['isPro'] = true;
			$ajax_params['proVersion'] = $version;
		}
		wp_localize_script($this->plugin_name . '-admin-ajax', 'mos_product_specifications_tab_ajax_obj', $ajax_params);
	}
}



