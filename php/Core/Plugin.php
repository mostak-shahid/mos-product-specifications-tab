<?php

namespace MosPress\MosProductSpecificationsTab\Core;
if ( ! defined( 'ABSPATH' ) ) exit;

use MosPress\MosProductSpecificationsTab\API\Ajax_API;
use MosPress\MosProductSpecificationsTab\API\Rest_API;
use MosPress\MosProductSpecificationsTab\Hook\Action_Hook;
use MosPress\MosProductSpecificationsTab\Hook\Filter_Hook;

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       http://wp-test.test/
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
 * @author     Programmelab <mostak.shahid@gmail.com>
 */
class Plugin
{

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Loader    $loader    Maintains and registers all hooks for the plugin.
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
	 * @var      string    $version    The version of the plugin.
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
	public function __construct()
	{

		if (defined('MOS_PRODUCT_SPECIFICATIONS_TAB_VERSION')) {
			$this->version = MOS_PRODUCT_SPECIFICATIONS_TAB_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'mos-product-specifications-tab';
		$this->define_admin_hooks();
		$this->define_public_hooks();

		Ajax_API::get_instance();
		Rest_API::get_instance();
		Action_Hook::get_instance();
		Filter_Hook::get_instance();
		
		// Instantiate additional core classes
		new ImportExport();
		new More();
		new Tools();
	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks()
	{
		$plugin_admin = new \MosPress\MosProductSpecificationsTab\Admin\Admin($this->get_plugin_name(), $this->get_version());
		add_action('admin_enqueue_scripts', [$plugin_admin, 'enqueue_styles'], 9999);
		add_action('admin_enqueue_scripts', [$plugin_admin, 'enqueue_scripts'], 9999);
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks()
	{

		$plugin_public = new \MosPress\MosProductSpecificationsTab\Public\PublicClass($this->get_plugin_name(), $this->get_version());
		add_action('wp_enqueue_scripts', [$plugin_public, 'enqueue_styles']);
		add_action('wp_enqueue_scripts', [$plugin_public, 'enqueue_scripts']);
		// Save settings by ajax
		add_action('wp_ajax_mos_product_specifications_tab_ajax_callback', [$plugin_public, 'mos_product_specifications_tab_ajax_callback']);
		add_action('wp_ajax_nopriv_mos_product_specifications_tab_ajax_callback', [$plugin_public, 'mos_product_specifications_tab_ajax_callback']);
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name()
	{
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader()
	{
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version()
	{
		return $this->version;
	}
}



