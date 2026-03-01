<?php
namespace MosPress\MosProductSpecificationsTab\API;
if ( ! defined( 'ABSPATH' ) ) exit;

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
		add_action('init', [$this, 'mos_product_specifications_tab_maybe_flush_rules'], 99);   
		
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
}

// new Ajax_API();