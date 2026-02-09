<?php

namespace MosPress\MosProductSpecificationsTab\Public;
if ( ! defined( 'ABSPATH' ) ) exit;
/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://mostak-shahid.github.io/
 * @since      1.0.0
 *
 * @package    Mos_Product_Specifications_Tab
 * @subpackage Mos_Product_Specifications_Tab/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Mos_Product_Specifications_Tab
 * @subpackage Mos_Product_Specifications_Tab/public
 * @author     Md. Mostak Shahid <mostak.shahid@gmail.com>
 */
class Frontend
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
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct($plugin_name, $version)
	{

		$this->plugin_name = $plugin_name;
		$this->version = $version;
		// add_action('woocommerce_before_single_product_summary', array($this, 'mos_product_specifications_tab_output'));
		// add_action('woocommerce_after_single_product_summary', array($this, 'mos_product_specifications_tab_output'));
		add_filter( 'woocommerce_product_tabs', array($this, 'mos_add_custom_product_tab'));
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles()
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
		// jQuery UI CSS (theme)
		wp_enqueue_style(
			$this->plugin_name . '-jquery-ui',
			MOS_PRODUCT_SPECIFICATIONS_TAB_URL . 'assets/plugins/jquery-ui/jquery-ui.min.css',
			array(),
			$this->version,
		);
		wp_enqueue_style($this->plugin_name, MOS_PRODUCT_SPECIFICATIONS_TAB_URL . 'assets/css/style.css', array(), $this->version, 'all');
		// wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/mos-product-specifications-tab-public.css', array(), $this->version, 'all' );
		wp_enqueue_style($this->plugin_name . '-public', MOS_PRODUCT_SPECIFICATIONS_TAB_URL . 'public/css/public-style.css', array(), $this->version, 'all');
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts()
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

		// wp_enqueue_script($this->plugin_name, plugin_dir_url(__DIR__) . 'assets/js/script.js', array('jquery'), $this->version, false);
		// jQuery UI Tooltip
    	wp_enqueue_script('jquery-ui-tooltip');

		wp_enqueue_script($this->plugin_name, MOS_PRODUCT_SPECIFICATIONS_TAB_URL . 'assets/js/script.js', array('jquery'), $this->version, false);
		wp_enqueue_script($this->plugin_name . '-public-ajax', MOS_PRODUCT_SPECIFICATIONS_TAB_URL . 'public/js/public-ajax.js', array('jquery'), $this->version, false);
		wp_enqueue_script($this->plugin_name . '-public-script', MOS_PRODUCT_SPECIFICATIONS_TAB_URL . 'public/js/public-script.js', array('jquery'), $this->version, false);
		$ajax_params = array(
			'admin_url' => admin_url(),
			'ajax_url' => admin_url('admin-ajax.php'),
			'_wp_nonce' => esc_attr(wp_create_nonce('mos_product_specifications_tab_wp_nonce')),
			// 'install_plugin_wpnonce' => esc_attr(wp_create_nonce('updates')),
		);
		wp_localize_script($this->plugin_name . '-public-ajax', 'mos_product_specifications_tab_ajax_obj', $ajax_params);
	}
	public function mos_product_specifications_tab_ajax_callback()
	{
		if (isset($_POST['_wp_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_wp_nonce'])), 'mos_product_specifications_tab_wp_nonce')) {
			// wp_send_json_success(array('variation_id' => $variation_id, 'price' => $price));
			wp_send_json_success();
		} else {
			wp_send_json_error(array('error_message' => esc_html__('Nonce verification failed. Please try again.', 'mos-product-specifications-tab')));
			// wp_die(esc_html__('Nonce verification failed. Please try again.', 'mos-product-specifications-tab'));
		}
		wp_die();
	}
	function mos_add_custom_product_tab( $tabs ) {

		$tabs['mos_custom_tab'] = array(
			'title'    => esc_html__( 'Specifications', 'mos-product-specifications-tab' ),
			'priority' => 0,
			'callback' => array($this, 'mos_product_specifications_tab_output'),
		);

		return $tabs;
	}
	public function mos_product_specifications_tab_output(){
		$options = mos_product_specifications_tab_get_option();
		// var_dump($options);
		?>
			<?php if (isset($options['general']['enable']) && !empty($options['general']['enable'])) :
			global $post;
			$data = get_post_meta($post->ID, '_mos_specifications_data', true);
			if (is_array($data) && sizeof($data) > 0) : ?>
				<?php foreach($data as $group) :  ?>
					<div class="mos-product-specifications-group">
						<?php if (isset($options['general']['table_intro']) && !empty($options['general']['table_intro'])) : ?>
							<div class="mos-product-specifications-table-heading">
								<?php if (isset($options['general']['group_icon']) && !empty($options['general']['group_icon'])) : ?>
									<?php if (isset($group['group_icon']['url']) && !empty($group['group_icon']['url'])): ?>
										<div class="mos-product-specifications-group-image-wrapper">
											<img src="<?php echo esc_url($group['group_icon']['url']); ?>" alt="<?php echo esc_attr($group['group_title']); ?>" class="mos-product-specifications-group-icon" />
										</div>
									<?php endif?>
								<?php endif?>

								<div class="mos-product-specifications-group-content-wrapper">
									<div class="mos-product-specifications-group-title-wrapper">
										<?php echo isset($group['group_title']) ? '<h3 class="mos-product-specifications-group-title">' . esc_html($group['group_title']) . '</h3>' : ''; ?>
										<?php if (isset($options['general']['group_tooltip']) && !empty($options['general']['group_tooltip'])) : ?>
											<?php if (isset($group['group_tooltip']) && !empty($group['group_tooltip'])) : ?>
												<span class="mos-product-specifications-group-tooltip" title="<?php echo esc_attr($group['group_tooltip'])?>"><span class="dashicons dashicons-editor-help"></span></span>
											<?php endif?>
										<?php endif?>

									</div>
									<?php if (isset($options['general']['group_intro']) && !empty($options['general']['group_intro'])) : ?>
										<?php echo isset($group['group_description']) ? '<p class="mos-product-specifications-group-description">' . nl2br(esc_html($group['group_description'])) . '</p>' : ''; ?>
									<?php endif?>
								</div>
							</div>
						<?php endif; ?>
						<?php if (isset($group['specifications']) && is_array($group['specifications'])): ?>
							<table>
								<?php foreach ($group['specifications'] as $item): ?>
									<tr>
										<td>
											<div class="mos-product-specifications-spec-title-wrapper">
												<span class="mos-product-specifications-spec-title">
													<?php echo esc_html($item['title']); ?>
												</span>
												<?php if (isset($options['general']['spec_tooltip']) && !empty($options['general']['spec_tooltip'])) : ?>
													<?php if (isset($item['tooltip']) && !empty($item['tooltip'])) : ?>
														<span class="mos-product-specifications-spec-tooltip" title="<?php echo esc_attr($item['tooltip']); ?>">
															<span class="dashicons dashicons-editor-help"></span>
														</span>
													<?php endif?>
												<?php endif?>
											</div>
										</td>
										<td><?php echo nl2br(esc_html($item['description'])); ?></td>
									</tr>
								<?php endforeach; ?>
							</table>
						<?php endif; ?>
					</div>
				<?php endforeach;?>
			<?php endif;
		endif;	
	}
}



