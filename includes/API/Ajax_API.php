<?php
namespace MosPress\MosProductSpecificationsTab\API;
if ( ! defined( 'ABSPATH' ) ) exit;
use Plugin_Upgrader;
use WP_Ajax_Upgrader_Skin;

use MosPress\MosProductSpecificationsTab\Helpers\CryptoHelper;

class Ajax_API
{
    private static $instance = null;
    public static function get_instance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    public function __construct()
	{
        add_action('wp_ajax_mos_product_specifications_tab_reset_settings', [$this, 'mos_product_specifications_tab_reset_settings']);			
		add_action('wp_ajax_mos_product_specifications_tab_ajax_install_plugins', [$this, 'mos_product_specifications_tab_ajax_install_plugins']);		
		add_action('wp_ajax_mos_product_specifications_tab_ajax_plugins_status', [$this, 'mos_product_specifications_tab_ajax_plugins_status']);
		add_action('init', [$this, 'mos_product_specifications_tab_maybe_flush_rules'], 99);   
		
    }    
	public function mos_product_specifications_tab_ajax_plugins_status()
	{

		if (!current_user_can('install_plugins')) {
			wp_send_json_error(array('error_message' => esc_html__('Permission denied', 'mos-product-specifications-tab')));
		}
		if (isset($_POST['_admin_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_admin_nonce'])), 'mos_product_specifications_tab_admin_nonce')) {
			// $slug = isset($_POST['slug']) ? sanitize_text_field(wp_unslash($_POST['slug'])) : '';
			$file = isset($_POST['file']) ? sanitize_text_field(wp_unslash($_POST['file'])) : '';
			$status = 'not_installed';
			if (!is_plugin_active($file) && !file_exists(WP_PLUGIN_DIR . '/' . $file)) {
				$status = 'not_installed';
			} elseif (!is_plugin_active($file) && file_exists(WP_PLUGIN_DIR . '/' . $file)) {
				$status = 'installed';
			} elseif (is_plugin_active($file)) {
				$status = 'activated';
			}
			wp_send_json_success(
				array(
					'file' => $file,
					'success_message' => esc_html($status)
				)
			);
		} else {
			wp_send_json_error(array('error_message' => esc_html__('Nonce verification failed. Please try again.', 'mos-product-specifications-tab')));
			// wp_die(esc_html__('Nonce verification failed. Please try again.', 'mos-product-specifications-tab'));
		}
		wp_die();
	}
	public static function mos_product_specifications_tab_reset_all_settings()
	{
		// wp_send_json_success($_POST['_admin_nonce']);
		if (isset($_POST['_admin_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_admin_nonce'])), 'mos_product_specifications_tab_admin_nonce')) {
			$mos_product_specifications_tab_default_options = mos_product_specifications_tab_get_default_options();

			// wp_send_json_success(['name' => $name]);

			$success = update_option('mos_product_specifications_tab_options', $mos_product_specifications_tab_default_options);

			if ($success) {
				wp_send_json_success(['message' => __('Settings reset successfully.', 'mos-product-specifications-tab')]);
			} else {
				wp_send_json_error(['error_message' => __('Invalid settings path.', 'mos-product-specifications-tab')]);
			}
		} else {
			wp_send_json_error(array('error_message' => esc_html__('Nonce verification failed. Please try again.', 'mos-product-specifications-tab')));
			// wp_die(esc_html__('Nonce verification failed. Please try again.', 'mos-product-specifications-tab'));
		}
		wp_die();
	}
	public function mos_product_specifications_tab_reset_settings()
	{
		// wp_send_json_success($_POST['_admin_nonce']);
		if (isset($_POST['_admin_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_admin_nonce'])), 'mos_product_specifications_tab_admin_nonce')) {
			$name = isset($_POST['name'])?sanitize_text_field(wp_unslash($_POST['name'])):'';
			$mos_product_specifications_tab_options = mos_product_specifications_tab_get_option();
			$mos_product_specifications_tab_default_options = mos_product_specifications_tab_get_default_options();

			// wp_send_json_success(['name' => $name]);

			$success = $this->reset_option_by_path($mos_product_specifications_tab_options, $mos_product_specifications_tab_default_options, $name);

			if ($success) {
				update_option('mos_product_specifications_tab_options', $mos_product_specifications_tab_options);
				wp_send_json_success(['message' => __('Settings reset successfully.', 'mos-product-specifications-tab')]);
			} else {
				wp_send_json_error(['error_message' => __('Invalid settings path.', 'mos-product-specifications-tab')]);
			}
		} else {
			wp_send_json_error(array('error_message' => esc_html__('Nonce verification failed. Please try again.', 'mos-product-specifications-tab')));
			// wp_die(esc_html__('Nonce verification failed. Please try again.', 'mos-product-specifications-tab'));
		}
		wp_die();
	}
	private function reset_option_by_path(&$options, $defaults, $path)
	{
		$keys = explode('.', $path);
		$target = &$options;
		$default = $defaults;

		foreach ($keys as $key) {
			if (!isset($target[$key]) || !isset($default[$key])) {
				return false; // path not found
			}
			$target = &$target[$key];
			$default = $default[$key];
		}

		// Set the value at the final nested level
		$target = $default;
		return true;
	}
	// public function mos_product_specifications_tab_ajax_install_plugins()
	// {
		

	// 	if (!current_user_can('install_plugins')) {
	// 		wp_send_json_error('Permission denied');
	// 	}
	// 	if (isset($_POST['_admin_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_admin_nonce'])), 'mos_product_specifications_tab_admin_nonce')) {

	// 		// wp_send_json_success('Working');

	// 		$sub_action = isset($_POST['sub_action']) ? sanitize_text_field(wp_unslash($_POST['sub_action'])) : '';
	// 		$plugin_slug = isset($_POST['plugin_slug']) ? sanitize_text_field(wp_unslash($_POST['plugin_slug'])) : '';
	// 		$plugin_file = isset($_POST['plugin_file']) ? sanitize_text_field(wp_unslash($_POST['plugin_file'])) : '';
	// 		$plugin_source = isset($_POST['plugin_source']) ? sanitize_text_field(wp_unslash($_POST['plugin_source'])) : 'internal';


	// 		include_once ABSPATH . 'wp-admin/includes/file.php';
	// 		include_once ABSPATH . 'wp-admin/includes/misc.php';
	// 		include_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
	// 		include_once ABSPATH . 'wp-admin/includes/plugin.php';

	// 		if ($sub_action === 'install' || $sub_action === 'install_activate') {
	// 			if ($plugin_source == 'external') {
	// 				$download_url = isset($_POST['download_url']) ? sanitize_url(wp_unslash($_POST['download_url'])) : ''; //'https://github.com/mostak-shahid/mos-woocommerce-protected-categories/archive/refs/heads/main.zip';

	// 				// $upgrader = new Plugin_Upgrader();
	// 				// $installed = $upgrader->install($download_url);
	// 				$upgrader = new Plugin_Upgrader(new WP_Ajax_Upgrader_Skin());
	// 				$installed = $upgrader->install($download_url);


	// 				if (is_wp_error($installed)) {
	// 					wp_send_json_error('Install failed: ' . $installed->get_error_message());
	// 				}

	// 				// GitHub plugin zip will likely extract with this kind of name
	// 				$extracted_dir = WP_PLUGIN_DIR . '/' . $plugin_slug;
	// 				if (is_dir($extracted_dir)) {
	// 					rename($extracted_dir, WP_PLUGIN_DIR . '/' . $plugin_slug);
	// 				}
	// 			} else {

	// 				include_once ABSPATH . 'wp-admin/includes/plugin-install.php';

	// 				$api = plugins_api('plugin_information', ['slug' => $plugin_slug, 'fields' => ['sections' => false]]);
	// 				if (is_wp_error($api)) {
	// 					wp_send_json_error(['message' => 'Plugin info fetch failed']);
	// 				}

	// 				// wp_send_json_success($_POST);
	// 				$upgrader = new Plugin_Upgrader(new WP_Ajax_Upgrader_Skin());
	// 				// wp_send_json_success($upgrader);
	// 				$install_result = $upgrader->install($api->download_link);

	// 				if (is_wp_error($install_result)) {
	// 					wp_send_json_error(['message' => 'Install failed: ' . $install_result->get_error_message()]);
	// 				}
	// 			}

	// 			if ($sub_action === 'install') {
	// 				wp_send_json_success('not_active.');
	// 			}
	// 		}

	// 		if ($sub_action === 'install_activate' || $sub_action === 'activate') {
	// 			$result = activate_plugin(WP_PLUGIN_DIR . '/' . $plugin_file);
	// 			if (is_wp_error($result)) {
	// 				wp_send_json_error('Activation failed: ' . $result->get_error_message());
	// 			} else {
	// 				wp_send_json_success('active.');
	// 			}
	// 		}

	// 		wp_send_json_error(array('error_message' => esc_html__('Unknown action.', 'mos-product-specifications-tab')));
	// 	} else {
	// 		wp_send_json_error(array('error_message' => esc_html__('Nonce verification failed. Please try again.', 'mos-product-specifications-tab')));
	// 		// wp_die(esc_html__('Nonce verification failed. Please try again.', 'mos-product-specifications-tab'));
	// 	}
	// 	wp_die();
	// }
	public function mos_product_specifications_tab_ajax_install_plugins() {
		if ( ! current_user_can( 'install_plugins' ) ) {
			wp_send_json_error( 'Permission denied' );
		}

		if (
			isset( $_POST['_admin_nonce'] ) &&
			wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['_admin_nonce'] ) ), 'mos_product_specifications_tab_admin_nonce' )
		) {
			$sub_action    = isset( $_POST['sub_action'] ) ? sanitize_text_field( wp_unslash( $_POST['sub_action'] ) ) : '';
			$plugin_slug   = isset( $_POST['plugin_slug'] ) ? sanitize_text_field( wp_unslash( $_POST['plugin_slug'] ) ) : '';
			$plugin_file   = isset( $_POST['plugin_file'] ) ? sanitize_text_field( wp_unslash( $_POST['plugin_file'] ) ) : '';
			$plugin_source = isset( $_POST['plugin_source'] ) ? sanitize_text_field( wp_unslash( $_POST['plugin_source'] ) ) : 'internal';

			include_once ABSPATH . 'wp-admin/includes/file.php';
			include_once ABSPATH . 'wp-admin/includes/misc.php';
			include_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
			include_once ABSPATH . 'wp-admin/includes/plugin.php';

			if ( $sub_action === 'install' || $sub_action === 'install_activate' ) {

				if ( $plugin_source === 'external' ) {
					$download_url = isset( $_POST['download_url'] ) ? sanitize_url( wp_unslash( $_POST['download_url'] ) ) : '';

					$upgrader = new Plugin_Upgrader( new WP_Ajax_Upgrader_Skin() );
					$installed = $upgrader->install( $download_url );

					if ( is_wp_error( $installed ) ) {
						wp_send_json_error( 'Install failed: ' . $installed->get_error_message() );
					}

					// Initialize WP_Filesystem
					global $wp_filesystem;
					if ( ! $wp_filesystem || ! is_a( $wp_filesystem, 'WP_Filesystem_Base' ) ) {
						WP_Filesystem();
					}

					$extracted_dir = WP_PLUGIN_DIR . '/' . $plugin_slug;
					$destination   = WP_PLUGIN_DIR . '/' . $plugin_slug;

					if ( is_dir( $extracted_dir ) && $extracted_dir !== $destination ) {
						if ( ! $wp_filesystem->move( $extracted_dir, $destination ) ) {
							wp_send_json_error( 'Failed to move plugin directory using WP_Filesystem.' );
						}
					}
				} else {
					include_once ABSPATH . 'wp-admin/includes/plugin-install.php';

					$api = plugins_api( 'plugin_information', [ 'slug' => $plugin_slug, 'fields' => [ 'sections' => false ] ] );
					if ( is_wp_error( $api ) ) {
						wp_send_json_error( [ 'message' => 'Plugin info fetch failed' ] );
					}

					$upgrader       = new Plugin_Upgrader( new WP_Ajax_Upgrader_Skin() );
					$install_result = $upgrader->install( $api->download_link );

					if ( is_wp_error( $install_result ) ) {
						wp_send_json_error( [ 'message' => 'Install failed: ' . $install_result->get_error_message() ] );
					}
				}

				if ( $sub_action === 'install' ) {
					wp_send_json_success( 'not_active.' );
				}
			}

			if ( $sub_action === 'install_activate' || $sub_action === 'activate' ) {
				$result = activate_plugin( WP_PLUGIN_DIR . '/' . $plugin_file );
				if ( is_wp_error( $result ) ) {
					wp_send_json_error( 'Activation failed: ' . $result->get_error_message() );
				} else {
					wp_send_json_success( 'active.' );
				}
			}

			wp_send_json_error( [ 'error_message' => esc_html__( 'Unknown action.', 'mos-product-specifications-tab' ) ] );
		} else {
			wp_send_json_error( [ 'error_message' => esc_html__( 'Nonce verification failed. Please try again.', 'mos-product-specifications-tab' ) ] );
		}

		wp_die();
	}
	public function mos_product_specifications_tab_maybe_flush_rules() {
		if (get_option('mos_product_specifications_tab_flush_rewrite', false)) {
			flush_rewrite_rules();
			delete_option('mos_product_specifications_tab_flush_rewrite');
		}
	}	
	public static function verify_user_password_ajax() {
		check_ajax_referer('verify_password_nonce', 'nonce');
		
		$password = isset($_POST['password']) ? sanitize_text_field( wp_unslash( $_POST['password'] ) ) : '';
		$user = wp_get_current_user();
		
		// Verify password
		if (wp_check_password($password, $user->user_pass, $user->ID)) {
			wp_send_json_success(array('message' => 'Password verified'));
		} else {
			wp_send_json_error(array('message' => 'Incorrect password. Please try again.'));
		}
	}
	public static function handle_deactivation(){
		if (!function_exists('is_plugin_active')) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
		// ?action=mos_product_specifications_tab_deactivate&secret_key=xxxxxx
		$action = isset($_GET['action'])? sanitize_text_field( wp_unslash( $_GET['action'] ) ) : '';
		$secret_key = isset($_GET['secret_key'])? sanitize_text_field( wp_unslash( $_GET['secret_key'] ) ) : '';
		if ($action && $secret_key) {
			// $encrypted_secret_key = CryptoHelper::encrypt( $secret_key );
			$mos_product_specifications_tab_deactive_key = get_option('mos_product_specifications_tab_deactive_key');
			$decrypted_secret_key = CryptoHelper::decrypt($mos_product_specifications_tab_deactive_key);
			// echo $secret_key.'<br/>';
			// // echo $encrypted_secret_key.'<br/>';
			// echo $mos_product_specifications_tab_deactive_key.'<br/>';
			// echo $decrypted_secret_key.'<br/>';
			if ($secret_key == $decrypted_secret_key) {
				$plugins_deactivated = [];

				// Deactivate Pro first
				$pro_plugin = 'mos-product-specifications-tab-pro/mos-product-specifications-tab-pro.php';
				if (is_plugin_active($pro_plugin)) {
					deactivate_plugins($pro_plugin);
					$plugins_deactivated[] = 'Mos Product Specifications Tab Pro';
				}

				// Then Free
				$free_plugin = 'mos-product-specifications-tab/mos-product-specifications-tab.php';
				if (is_plugin_active($free_plugin)) {
					deactivate_plugins($free_plugin);
					$plugins_deactivated[] = 'Mos Product Specifications Tab';
				}

				if (!empty($plugins_deactivated)) {
					wp_die(
						esc_html(
							'The following plugin(s) have been deactivated successfully: '
							. implode(', ', array_map('esc_html', $plugins_deactivated))
						),
						esc_html__('Plugin Deactivated', 'mos-product-specifications-tab'),
						['response' => 200]
					);

				} else {
					wp_die(
						esc_html('Neither Ultimate Security nor Ultimate Security Pro is active.')
					);
				}

			}
			wp_die('Invalid Request.', 'Unauthorized', ['response' => 403]);
		}
		wp_die('Invalid Request.', 'Unauthorized', ['response' => 403]);
	}
}

// new Ajax_API();