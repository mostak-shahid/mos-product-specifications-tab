<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://www.mdmostakshahid.com/
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
class Mos_Product_Specifications_Tab_Admin {

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
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function mos_product_specifications_tab_enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Mos_Product_Specifications_Tab_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Mos_Product_Specifications_Tab_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/mos-product-specifications-tab-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function mos_product_specifications_tab_enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Mos_Product_Specifications_Tab_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Mos_Product_Specifications_Tab_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		wp_enqueue_script('jquery-ui-sortable');
		wp_enqueue_script('jquery-ui-accordion');
		wp_enqueue_editor();

		wp_enqueue_script($this->plugin_name . '-ajax', plugin_dir_url(__DIR__) . 'assets/js/mos-product-specifications-tab-ajax.js', array('jquery'), $this->version, false);

		$mos_product_specifications_tab_ajax_params = array(
			'ajax_url' => admin_url('admin-ajax.php'),
			'mos_product_specifications_tab_security' => esc_attr(wp_create_nonce('mos_product_specifications_tab_security_nonce')),
			'mos_product_specifications_tab_install_plugin_wpnonce' => esc_attr(wp_create_nonce('updates')),
		);
		wp_localize_script($this->plugin_name . '-ajax', 'mos_product_specifications_tab_ajax_obj', $mos_product_specifications_tab_ajax_params);

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/mos-product-specifications-tab-admin.js', array( 'jquery','jquery-ui-sortable', 'jquery-ui-accordion' ), $this->version, false );

	}
	public function mos_product_specifications_tab_woocommerce_check()
	{

		if (current_user_can('activate_plugins')) {
			if (!is_plugin_active('woocommerce/woocommerce.php') && !file_exists(WP_PLUGIN_DIR . '/woocommerce/woocommerce.php')) {
?>
				<div id="message" class="error">
					<?php /* translators: %1$s: WooCommerce plugin url start, %2$s: WooCommerce plugin url end */ ?>
					<p>
						<?php printf(
						esc_html__('%1$s requires %2$s WooCommerce %3$s to be activated.', 'mos-product-specifications-tab'), 
						'Product specifications tab for WooCommerce',
						'<strong><a href="https://wordpress.org/plugins/woocommerce/" target="_blank">', 
						'</a></strong>'
						); ?>
					</p>
					<p><a id="woocommerce_install" class="install-now button" data-plugin-slug="woocommerce"><?php echo esc_html__('Install Now', 'mos-product-specifications-tab'); ?></a></p>
				</div>

			<?php
			} elseif (!is_plugin_active('woocommerce/woocommerce.php') && file_exists(WP_PLUGIN_DIR . '/woocommerce/woocommerce.php')) {
			?>

				<div id="message" class="error">
					<?php /* translators: %1$s: WooCommerce plugin url start, %2$s: WooCommerce plugin url end */ ?>
					<p>
						<?php printf(
							esc_html__('%1$s requires %2$s WooCommerce %3$s to be activated.', 'mos-product-specifications-tab'), 
							'Product specifications tab for WooCommerce',
							'<strong><a href="https://wordpress.org/plugins/woocommerce/" target="_blank">', 
							'</a></strong>'
							); 
						?>
					</p>
					<p><a href="<?php echo esc_url(get_admin_url()); ?>plugins.php?_wpnonce=<?php echo esc_attr(wp_create_nonce('activate-plugin_woocommerce/woocommerce.php')); ?>&action=activate&plugin=woocommerce/woocommerce.php" class="button activate-now button-primary"><?php echo esc_html__('Activate', 'mos-product-specifications-tab'); ?></a></p>
				</div>
			<?php
			} elseif (version_compare(get_option('woocommerce_db_version'), '2.5', '<')) {
			?>

				<div id="message" class="error">
					<?php /* translators: %1$s: strong tag start, %2$s: strong tag end, %3$s: plugin url start, %4$s: plugin url end */ ?>
					<p>
						<?php printf(
							esc_html__('%1$s%2$s is inactive.%3$s This plugin requires WooCommerce 2.5 or newer. Please %4$supdate WooCommerce to version 2.5 or newer%5$s', 'mos-product-specifications-tab'), 
							'<strong>', 
							'Product specifications tab for WooCommerce',
							'</strong>', 
							'<a href="' . esc_url(admin_url('plugins.php')) . '">', 
							'&nbsp;&raquo;</a>'
							); 
						?>
					</p>
				</div>

			<?php
			}
		}
	}
	
	/**
	 * Product Add/Edit custom tabs
	 *
	 * @param array $default_tabs tabs.
	 *
	 * @return array $default_tabs
	 */
	public function mos_product_specifications_tab_product_edit_tab( $default_tabs ) {
		global $post;
		$tabs = array(
			'mos_specifications_tab' => array(
				'label'       => esc_html__( 'Specifications', 'mos-product-specifications-tab' ),
				'target'      => 'mos_specifications_tab', // ID of tab field
				'priority'    => 60,
				'class'       => array(),
			),
		);
		$default_tabs = array_merge( $default_tabs, $tabs );
		return $default_tabs;
	}
	/**
	 * Product Add/Edit custom tab field
	 *
	 * @return void
	 */
	public function mos_product_specifications_tab_product_tab_field() {
		wp_nonce_field('mos_specifications_tab_action', 'mos_specifications_tab_field');
		$n = $size = 0;
		global $woocommerce, $post;
		$specifications_data = get_post_meta( $post->ID, '_mos_specifications_data', true );
		if (is_array($specifications_data)) ksort($specifications_data);
		?>
		<div id="mos_specifications_tab" class="panel woocommerce_options_panel mos_specification_options_panel">
		<div class="mos-specification-groups mos-specification-accordion">
		<?php if (isset($specifications_data) && is_array($specifications_data) && sizeof($specifications_data)) : ?>
			<?php $size = sizeof($specifications_data) ?>
				<?php foreach($specifications_data as $key => $data) : ?>
					<?php if ($key!='_nonce') :  ?>
						<div class="mos-specification-group">
							<h4 class="mos-specification-group-title"><span class="text"><?php echo (isset($data['title']))?esc_html($data['title']):esc_html__('Add', 'mos-product-specifications-tab') ?></span></h4>
							<div class="mos-specification-group-content">
								<fieldset class="form-field">
									<label for="mos-specifications-data-title-<?php echo esc_html($n) ?>"><?php echo esc_html__( 'Title', 'mos-product-specifications-tab' ); ?></label>
									<input class="mos-specifications-data-title" type="text" name="_mos_specifications_data[<?php echo esc_html($n) ?>][title]" id="mos-specifications-data-title-<?php echo esc_html($n) ?>" value="<?php echo isset($data['title'])?esc_html($data['title']):'' ?>" />
								</fieldset>
								<fieldset class="form-field">
									<label for="mos-specifications-data-tooltip-<?php echo esc_html($n) ?>"><?php echo esc_html__( 'Tooltip', 'mos-product-specifications-tab' ); ?></label>
									<input class="mos-specifications-data-tooltip" type="text" name="_mos_specifications_data[<?php echo esc_html($n) ?>][tooltip]" id="mos-specifications-data-tooltip-<?php echo esc_html($n) ?>" value="<?php echo isset($data['tooltip'])?esc_html($data['tooltip']):'' ?>" />
								</fieldset>
								<fieldset class="form-field">
									<label for="mos-specifications-data-editor-<?php echo esc_html($n) ?>"><?php echo esc_html__( 'Description', 'mos-product-specifications-tab' ); ?></label>
									
									<?php
									$content = (@$data['editor'])?$data['editor']:'';
									$custom_editor_id = "mos-specifications-data-editor-".esc_html($n);
									$custom_editor_name = "editorname";
									$args = array(
											'media_buttons' => false, // This setting removes the media button.
											'textarea_name' => "_mos_specifications_data[{$n}][editor]", // Set custom name.
											// 'textarea_rows' => get_option('default_post_edit_rows', 10), //Determine the number of rows.
											'quicktags' => false, // Remove view as HTML button.
											'tinymce'       => array(
												'toolbar1'      => 'bold,italic,underline,separator,bullist,numlist,separator,alignleft,aligncenter,alignright,separator,link,unlink,undo,redo',
												'toolbar2'      => '',
												'toolbar3'      => '',
											),
										);
									wp_editor( $content, $custom_editor_id, $args );

									?>
								</fieldset>
								<fieldset class="form-field mos-specification-remove"><a href="#" class="button button-warning mos-specification-remove-group"><?php echo esc_html__('Remove', 'mos-product-specifications-tab')?></a></fieldset>
							</div>	
						</div>
					<?php endif?>
					<?php $n++?>
				<?php endforeach?>
		<?php endif?>
		</div>
		<input type="hidden" class="total-count" value="<?php echo esc_html($size) ?>" data-add="<?php echo esc_html__( 'Add', 'mos-product-specifications-tab' ); ?>" data-title="<?php echo esc_html__( 'Title', 'mos-product-specifications-tab' ); ?>" data-tooltip="<?php echo esc_html__( 'Tooltip', 'mos-product-specifications-tab' ); ?>" data-description="<?php echo esc_html__( 'Description', 'mos-product-specifications-tab' ); ?>">
		<a href="#" class="button mos-specification-add-group"><?php echo esc_html__('Add more', 'mos-product-specifications-tab')?></a>
		</div>
		<?php
	}
	/**
	 * Save custom data
	 *
	 * @return boolean
	 */
	public function mos_product_specifications_tab_save_product_tab_data( $post_id, $post, $update ) {
		global $post;
			
		if (isset($_POST['mos_specifications_tab_field']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['mos_specifications_tab_field'])), 'mos_specifications_tab_action')) {
			if(isset($_POST['_mos_specifications_data'])) {

				$mos_specifications_data = $this->mos_product_specifications_tab_recursive_sanitize_array_field($_POST['_mos_specifications_data']);
				update_post_meta( $post->ID, '_mos_specifications_data', $mos_specifications_data );
			}
			else {
				update_post_meta( $post->ID, '_mos_specifications_data', '' );
			}
		}
	}
	
	/**
	 * Recursive sanitation for an array
	 * 
	 * @param $array
	 *
	 * @return mixed
	 */
	public function mos_product_specifications_tab_recursive_sanitize_array_field($array)
	{
		foreach ($array as $key => &$value) {
			if (is_array($value)) {
				$value = $this->mos_product_specifications_tab_recursive_sanitize_array_field($value);
			} else {
				if ($key == 'editor')
					$value = wp_kses_post($value);
				elseif ($key == 'url')
					$value = sanitize_url($value);
				elseif ($key == 'id')
					$value = sanitize_text_field(filter_var($value, FILTER_SANITIZE_NUMBER_INT));
				else
					$value = sanitize_text_field($value);
			}
		}

		return $array;
	}
	

}
