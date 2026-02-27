<?php

namespace MosPress\MosProductSpecificationsTab\Core;

/**
 * Fired during plugin deactivation
 *
 * @link       https://mostak-shahid.github.io/
 * @since      1.0.0
 *
 * @package    Mos_Product_Specifications_Tab
 * @subpackage Mos_Product_Specifications_Tab/includes
 */

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.0
 * @package    Mos_Product_Specifications_Tab
 * @subpackage Mos_Product_Specifications_Tab/includes
 * @author     Programmelab <mostak.shahid@gmail.com>
 */
class Deactivator
{
    /**
     * Run on plugin deactivation.
     *
     * This function is called when the plugin is deactivated.
     * It handles cleanup of custom tables and options.
     */
    public static function deactivate() {
        $options = get_option('mos_product_specifications_tab_options', []);
        if (isset($options['tools']['delete_data_on']) && $options['tools']['delete_data_on'] == 'deactivate') {
            mos_product_specifications_tab_data_cleanup();
        }
        flush_rewrite_rules();
    }
}



