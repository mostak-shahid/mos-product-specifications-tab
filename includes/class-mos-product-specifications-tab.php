<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://www.mdmostakshahid.com/
 * @since      1.0.0
 *
 * @package    Mos_Product_Specifications_Tab
 * @subpackage Mos_Product_Specifications_Tab/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Mos_Product_Specifications_Tab
 * @subpackage Mos_Product_Specifications_Tab/includes
 * @author     Md. Mostak Shahid <mostak.shahid@gmail.com>
 */
class Mos_Product_Specifications_Tab {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Mos_Product_Specifications_Tab_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'MOS_PRODUCT_SPECIFICATIONS_TAB_VERSION' ) ) {
			$this->version = MOS_PRODUCT_SPECIFICATIONS_TAB_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'mos-product-specifications-tab';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Mos_Product_Specifications_Tab_Loader. Orchestrates the hooks of the plugin.
	 * - Mos_Product_Specifications_Tab_i18n. Defines internationalization functionality.
	 * - Mos_Product_Specifications_Tab_Admin. Defines all hooks for the admin area.
	 * - Mos_Product_Specifications_Tab_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		require_once(ABSPATH . 'wp-admin/includes/plugin.php');

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-mos-product-specifications-tab-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-mos-product-specifications-tab-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-mos-product-specifications-tab-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-mos-product-specifications-tab-public.php';

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-class-mos-product-specifications-tab-simple-product-template.php';

		$this->loader = new Mos_Product_Specifications_Tab_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Mos_Product_Specifications_Tab_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Mos_Product_Specifications_Tab_i18n($this->get_plugin_name(), $this->get_version());

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Mos_Product_Specifications_Tab_Admin( $this->get_plugin_name(), $this->get_version() );
		
		if (!is_plugin_active('woocommerce/woocommerce.php')) {
			$this->loader->add_action('admin_notices', $plugin_admin, 'mos_product_specifications_tab_woocommerce_check');
			add_action("wp_ajax_woocommerce_ajax_install_plugin", "wp_ajax_install_plugin");
		}

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'mos_product_specifications_tab_enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'mos_product_specifications_tab_enqueue_scripts' );
		$this->loader->add_action( 'woocommerce_product_data_tabs', $plugin_admin, 'mos_product_specifications_tab_product_edit_tab', 10, 1 );
		$this->loader->add_action( 'woocommerce_product_data_panels', $plugin_admin, 'mos_product_specifications_tab_product_tab_field');
		$this->loader->add_action( 'save_post', $plugin_admin, 'mos_product_specifications_tab_save_product_tab_data', 10, 3 );

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Mos_Product_Specifications_Tab_Public( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'mos_product_specifications_tab_enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'mos_product_specifications_tab_enqueue_scripts' );		
		$this->loader->add_filter( 'woocommerce_product_tabs', $plugin_public, 'mos_product_specifications_tab_woo_new_product_tab' );

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Mos_Product_Specifications_Tab_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
