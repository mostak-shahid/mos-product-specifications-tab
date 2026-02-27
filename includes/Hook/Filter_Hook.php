<?php
namespace MosPress\MosProductSpecificationsTab\Hook;

if ( ! defined( 'ABSPATH' ) ) exit;

class Filter_Hook {

    private $plugin_slug;      // mos-product-specifications-tab
    private $plugin_basename;  // mos-product-specifications-tab/mos-product-specifications-tab.php
    private static $instance = null;

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __construct() {

        // Automatically detect plugin slug + basename
        $this->plugin_basename = plugin_basename( MOS_PRODUCT_SPECIFICATIONS_TAB_MAIN_FILE ); 
        $this->plugin_slug     = dirname( $this->plugin_basename );

        /**
         * Now supports:
         * plugin_action_links_mos-product-specifications-tab/mos-product-specifications-tab.php
         * WITHOUT hard-coding strings.
         */
        add_filter(
            "plugin_action_links_{$this->plugin_basename}",
            [ $this, 'mos_product_specifications_tab_add_action_links' ]
        );

        add_filter('admin_body_class', [ $this, 'mos_product_specifications_tab_admin_body_class' ]);

        add_filter('mos_product_specifications_tab_default_options_modify', [ $this, 'modify_mos_product_specifications_tab_default_options' ]);
        add_filter('mos_product_specifications_tab_default_colors_modify', [ $this, 'modify_mos_product_specifications_tab_default_colors' ]);
        add_filter('mos_product_specifications_tab_default_gradients_modify', [ $this, 'modify_mos_product_specifications_tab_default_gradients' ]);
        add_filter('mos_product_specifications_tab_default_tables_modify', [ $this, 'modify_mos_product_specifications_tab_default_tables' ]);

        /**
         * Allow PRO add-ons or Module Federation remotes to inject links dynamically
         */
        add_filter('mos_product_specifications_tab_action_links_extra', '__return_empty_array');

        

    }

    /**
     * Add Settings link + dynamic injected links
     */
    public function mos_product_specifications_tab_add_action_links( $links ) {

        $default_links = [
            '<a href="' . admin_url("admin.php?page={$this->plugin_slug}") . '">' .
                esc_html__('Settings', 'mos-product-specifications-tab') .
            '</a>',
            '<a href="https://mostak-shahid.github.io/plugins/mos-product-specifications-tab.html" target="_blank">' .
                esc_html__('Docs', 'mos-product-specifications-tab') .
            '</a>',
            '<a href="https://www.facebook.com/mospressbd" target="_blank">' .
                esc_html__('Community', 'mos-product-specifications-tab') .
            '</a>',
        ];

        /**
         * Dynamic links injected from PRO plugin or remote MF
         * Example:
         * add_filter( 'mos_product_specifications_tab_action_links_extra', function($links) {
         *     $links[] = '<a href="https://example.com/pro">Go Pro</a>';
         *     return $links;
         * });
         */
        $extra_links = apply_filters('mos_product_specifications_tab_action_links_extra', []);

        return array_merge( $default_links, $extra_links, $links );
    }

    /**
     * Add body classes on plugin pages
     */
    public function mos_product_specifications_tab_admin_body_class( $classes ) {
        // error_log("Filter_Hook constructor called");
        if (function_exists('mos_product_specifications_tab_is_plugin_page') && mos_product_specifications_tab_is_plugin_page()) {
            $classes .= ' ' . sanitize_html_class( $this->plugin_slug . '-settings-template' ) . ' ';
        }
        return $classes;
    }

    /**
     * Default options filter (still dynamic)
     */
    public function modify_mos_product_specifications_tab_default_options( $opts ) {
        $defaults = [            
            'general' => [
                'enable' => true,
                'table_intro' => true,
                'group_icon' => false,
                'group_tooltip' => false,
                'group_intro' => false,
                'spec_tooltip' => false,
                // 'table_position' => '',
            ],
            'more' => [
                'enable_scripts' => false,
                'css' => '/* CSS Code Here */',
                'js' => '// JavaScript Code Here',
                'header_content' => '<!-- Content inside HEAD tag -->',
                'footer_content' => '<!-- Content inside BODY tag -->',
            ],
            'tools' => [
                'hide_plugin' => false, // delete, uninstall, none
                'self_defense' => false, // delete, uninstall, none
                'delete_data_on' => 'none', // delete, uninstall, none
            ]
        ];
        return wp_parse_args( $opts, $defaults );
    }

    /**
     * Default options filter (still dynamic)
     */
    public function modify_mos_product_specifications_tab_default_colors( $opts ) {
        $defaults = [
            ['name' => esc_html__('Black', 'mos-product-specifications-tab'), 'color' => '#000000'],
            ['name' => esc_html__('Blue', 'mos-product-specifications-tab'), 'color' => '#0073AA'],
            ['name' => esc_html__('Cyan', 'mos-product-specifications-tab'), 'color' => '#00A0D2'],
            ['name' => esc_html__('Deep Blue', 'mos-product-specifications-tab'), 'color' => '#005075'],
            ['name' => esc_html__('Deep Purple', 'mos-product-specifications-tab'), 'color' => '#23036A'],
            ['name' => esc_html__('Gold', 'mos-product-specifications-tab'), 'color' => '#FFB900'],
            ['name' => esc_html__('Gray', 'mos-product-specifications-tab'), 'color' => '#888888'],
            ['name' => esc_html__('Green', 'mos-product-specifications-tab'), 'color' => '#008000'],
            ['name' => esc_html__('Light Gray', 'mos-product-specifications-tab'), 'color' => '#E6E6E6'],
            ['name' => esc_html__('Lime Green', 'mos-product-specifications-tab'), 'color' => '#82C91E'],
            ['name' => esc_html__('Navy Blue', 'mos-product-specifications-tab'), 'color' => '#001F3F'],
            ['name' => esc_html__('Orange', 'mos-product-specifications-tab'), 'color' => '#FF6600'],
            ['name' => esc_html__('Pink', 'mos-product-specifications-tab'), 'color' => '#FF4081'],
            ['name' => esc_html__('Purple', 'mos-product-specifications-tab'), 'color' => '#800080'],
            ['name' => esc_html__('Red', 'mos-product-specifications-tab'), 'color' => '#FF0000'],
            ['name' => esc_html__('Silver', 'mos-product-specifications-tab'), 'color' => '#C0C0C0'],
            ['name' => esc_html__('White', 'mos-product-specifications-tab'), 'color' => '#FFFFFF'],
            ['name' => esc_html__('Yellow', 'mos-product-specifications-tab'), 'color' => '#FFFF00'],
        ];
        return wp_parse_args( $opts, $defaults );
    }

    /**
     * Default options filter (still dynamic)
     */
    public function modify_mos_product_specifications_tab_default_gradients( $opts ) {
        $defaults = [
            ['name' => esc_html__('Blue to Purple', 'mos-product-specifications-tab'), 'gradient' => 'linear-gradient(135deg, #0064fa 0%, #800080 100%)'],
            ['name' => esc_html__('Pink to Orange', 'mos-product-specifications-tab'), 'gradient' => 'linear-gradient(135deg, #ff4081 0%, #ff6600 100%)'],
            ['name' => esc_html__('Cyan to Blue', 'mos-product-specifications-tab'), 'gradient' => 'linear-gradient(135deg, #00a0d2 0%, #0073aa 100%)'],
            ['name' => esc_html__('Lime Green to Green', 'mos-product-specifications-tab'), 'gradient' => 'linear-gradient(135deg, #82c91e 0%, #008000 100%)'],
            ['name' => esc_html__('Gold to Orange', 'mos-product-specifications-tab'), 'gradient' => 'linear-gradient(135deg, #ffb900 0%, #ff6600 100%)'],
            ['name' => esc_html__('Red to Deep Purple', 'mos-product-specifications-tab'), 'gradient' => 'linear-gradient(135deg, #ff0000 0%, #23036a 100%)'],
            ['name' => esc_html__('Yellow to Lime Green', 'mos-product-specifications-tab'), 'gradient' => 'linear-gradient(135deg, #ffff00 0%, #82c91e 100%)'],
            ['name' => esc_html__('Silver to Gray', 'mos-product-specifications-tab'), 'gradient' => 'linear-gradient(135deg, #c0c0c0 0%, #888888 100%)'],
	    ];
        return wp_parse_args( $opts, $defaults );
    }

    /**
     * Default options filter (still dynamic)
     */
    public function modify_mos_product_specifications_tab_default_tables( $opts ) {
        $defaults = [
            ['mos_product_specifications_tab_logs'],
	    ];
        return wp_parse_args( $opts, $defaults );
    }
}
