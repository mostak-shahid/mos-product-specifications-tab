<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://www.mdmostakshahid.com/
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
class Mos_Product_Specifications_Tab_Public {

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
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
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

		wp_enqueue_style('jquery-ui-css', plugin_dir_url( __FILE__ ) .'plugins/jquery-ui/jquery-ui.min.css', array(), $this->version, 'all');
		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/mos-product-specifications-tab-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
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
		wp_enqueue_script('jquery-ui-tooltip');
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/mos-product-specifications-tab-public.js', array( 'jquery','jquery-ui-tooltip' ), $this->version, false );

	}
	public function mos_product_specifications_tab_woo_new_product_tab( $tabs ) {
		// unset( $tabs['reviews'] );
		
		global $product;
		$data = get_post_meta( $product->get_id(), '_mos_specifications_data', true );
		if(isset($data) && is_array($data) && sizeof($data)) {
			$tabs['mos_specifications_tab'] = array(
				'title' 	=> esc_html__( 'Specifications', 'mos-product-specifications-tab' ),
				'priority' 	=> 20,
				//'callback'	=> 'mos_product_specifications_tab_woo_new_product_tab_content'
				'callback' 	=> function () use ($data) {
					// var_dump($data);
					// The new tab content		
					echo '<h2 class="tab-title">'.esc_html__( 'Specifications', 'mos-product-specifications-tab' ).'</h2>';
					echo '<div class="tab-intro">';
					
						echo '<table class="product-specifications-table"><tbody>';
						foreach($data as $row) {
							$tooltip = $class = '';
							echo '<tr class="woocommerce-product-attributes-item">';

							echo (isset($row['tooltip']) && $row['tooltip'])?'<th class="woocommerce-product-attributes-item__label tooltip" title="'.esc_html($row['tooltip']).'">'.esc_html($row['title']).'</th>':'<th class="woocommerce-product-attributes-item__label">'.esc_html($row['title']).'</th>';

							echo '<td class="woocommerce-product-attributes-item__value" data-title="'.esc_html($row['title']).'">'.wp_kses_post(wpautop(do_shortcode($row['editor']))).'</td>';
							echo '</tr>';
						}
						echo '</table></tbody></table>';
					echo '</div>';
				}
			);		
		}
		return $tabs;
	}
}
