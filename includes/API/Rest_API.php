<?php
namespace MosPress\MosProductSpecificationsTab\API;
if ( ! defined( 'ABSPATH' ) ) exit;
use MosPress\MosProductSpecificationsTab\API\LogsController;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_Query;
use WP_REST_Server;

use MosPress\MosProductSpecificationsTab\Helpers\CryptoHelper;
/**
 * Rest API Router
 *
 * Registers all REST API endpoints and routes them to appropriate controllers
 */
class Rest_API
{
    
    private const NAMESPACE = 'mos-product-specifications-tab/v1';
    private static $instance = null;
    /**
     * Table name
     *
     * @var string
     */
    public static function get_instance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    public function __construct()
    {
        
        add_action('rest_api_init', [$this, 'rest_api_init']);
    }
    public function rest_api_init()
    {        
        register_rest_route(self::NAMESPACE, '/plugins', [
            'methods' => 'GET',
            'callback' => function () {
                $response = wp_remote_get('https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[author]=mostakshahid&request[per_page]=24');
                if (is_wp_error($response)) {
                    return new WP_Error('api_error', 'Failed to fetch plugins', ['status' => 500]);
                }
                return json_decode(wp_remote_retrieve_body($response), true);
            },
			'permission_callback' => function () {
				return current_user_can('manage_options');
			},
        ]);
        
        // // ✅ Get posts (with embed info)
        // // GET /wp-json/mos-product-specifications-tab/v1/posts?page=1&per_page=10&status=publish&search=hello
        // register_rest_route( self::NAMESPACE, '/posts', [
        //     'methods'  => 'GET',
        //     'callback' => [$this, 'get_posts'],
        //     'permission_callback' => function () {
        //         return current_user_can( 'edit_posts' );
        //     },
        //     'args' => [
        //         'page'     => ['type' => 'integer'],
        //         'per_page' => ['type' => 'integer'],
        //         'status'   => ['type' => 'string'],
        //         'search'   => ['type' => 'string'],
        //         'orderby'  => ['type' => 'string'], // title|date
        //         'order'    => ['type' => 'string'], // asc|desc
        //     ],
        // ]);

        // // ✅ Change status of a single post
        // // POST /wp-json/mos-product-specifications-tab/v1/post/123/status
        // // { "status": "draft" }
        // register_rest_route( self::NAMESPACE, '/post/(?P<id>\d+)/status', [
        //     'methods'  => 'POST',
        //     'callback' => [$this, 'change_post_status'],
        //     'permission_callback' => function () {
        //         return current_user_can( 'edit_posts' );
        //     },
        //     'args' => [
        //         'status' => [
        //             'required' => true,
        //             'type'     => 'string',
        //             'enum'     => [ 'publish', 'draft', 'trash' ],
        //         ],
        //     ],
        // ]);

        // // ✅ Bulk status change
        // // POST /wp-json/mos-product-specifications-tab/v1/posts/status
        // // { "ids": [1,2,3], "status": "trash" }

        // register_rest_route( self::NAMESPACE, '/posts/status', [
        //     'methods'  => 'POST',
        //     'callback' => [$this, 'bulk_change_status'],
        //     'permission_callback' => function () {
        //         return current_user_can( 'edit_posts' );
        //     },
        //     'args' => [
        //         'ids' => [
        //             'required' => true,
        //             'type'     => 'array',
        //             'items'    => [ 'type' => 'integer' ],
        //         ],
        //         'status' => [
        //             'required' => true,
        //             'type'     => 'string',
        //             'enum'     => [ 'publish', 'draft', 'trash' ],
        //         ],
        //     ],
        // ]);

        
		register_rest_route( self::NAMESPACE, '/options',
			array(
				'methods'  => 'GET',
				'callback' => [$this, 'get_settings'],
				// 'permission_callback' => '__return_true', // Allow public access
				'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
			)
		);

		//Add the POST 'mos-product-specifications-tab/v1/options' endpoint to the Rest API
		register_rest_route( self::NAMESPACE, '/options',
			array(
				'methods'             => 'POST',
				'callback'            => [$this, 'update_settings'],
				// 'permission_callback' => '__return_true'
				'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
			)
		);

		register_rest_route( self::NAMESPACE,'/options/reset-settings',
            array(
                'methods' => 'POST',
                'callback' => [$this, 'reset_settings'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            )
        );

		register_rest_route( self::NAMESPACE,'/options/reset-settings-all',
            array(
                'methods' => 'POST',
                'callback' => [$this, 'reset_settings_all'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            )
        );
        
		register_rest_route( self::NAMESPACE,'/options/import-settings', [
                'methods' => 'POST',
                'callback' => function ($request) {
                    $data = $request->get_json_params();
                    update_option('mos_product_specifications_tab_options', $data);
                    return rest_ensure_response(['success' => true]);
                },
                // 'permission_callback' => '__return_true',
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ]
        );

		register_rest_route( self::NAMESPACE, '/feedback',
            array(
                'methods' => 'POST',
                'callback' => [$this, 'rest_feedback'],
				// 'permission_callback' => '__return_true'
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            )
        );

		register_rest_route( self::NAMESPACE, '/set-settings-theme',
			array(
				'methods'  => 'GET',
				'callback' => [$this, 'rest_set_settings_theme'],
				// 'permission_callback' => '__return_true', // Allow public access
				'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
                'args' => [
                    'id' => [
                        'required' => true,
                        'type'     => 'string',
                        'items'    => [ 'type' => 'integer' ],
                    ],
                    'settings_theme' => [
                        'required' => true,
                        'type'     => 'string',
                        'enum'     => [ 'light', 'dark' ],
                    ],
                ],
			)
		);
        register_rest_route( self::NAMESPACE, '/get-settings-theme',
			array(
				'methods'  => 'GET',
				'callback' => [$this, 'rest_get_settings_theme'],
				'permission_callback' => '__return_true', // Allow public access
				// 'permission_callback' => function () {
                //     return current_user_can('manage_options');
                // },
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/get-option',
			array(
				'methods'  => 'GET',
				'callback' => [$this, 'rest_get_option'],
				'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
                'args' => [
                    'option_name' => [
                        'required' => true,
                        'type'     => 'string',
                    ],
                ],
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/set-option',
			array(
				'methods'  => 'POST',
				'callback' => [$this, 'rest_set_option'],
				'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
			)
		);
        
        register_rest_route( self::NAMESPACE, '/deactivation-link',
            array(
                'methods' => 'GET',
                'callback' => array( $this, 'get_deactivation_link' ),
                'permission_callback' => array( $this, 'check_permission' ),
            )
        );

        //Log table REST routes
        /**
         * Register REST API routes
         */
        // Get logs with filters
        register_rest_route( self::NAMESPACE, '/logs',
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( LogsController::class, 'get_logs' ),
                'permission_callback' => array( $this, 'check_permission' ),
                'args' => [
                    'page' => ['sanitize_callback' => 'absint', 'default' => 1],
                    'per_page' => ['sanitize_callback' => 'absint', 'default' => 5],
                    'search' => ['sanitize_callback' => 'sanitize_text_field'],
                    'sort_field' => ['sanitize_callback' => 'sanitize_text_field'],
                    'sort_order' => ['sanitize_callback' => 'sanitize_text_field'],
                    'filter' => ['sanitize_callback' => 'sanitize_text_field'],
                    'date_from' => ['sanitize_callback' => 'sanitize_text_field'],
                    'date_to' => ['sanitize_callback' => 'sanitize_text_field'],
                ],
            )
        );

        // Search logs
        register_rest_route( self::NAMESPACE, '/logs/search',
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( LogsController::class, 'search_logs' ),
                'permission_callback' => array( $this, 'check_permission' ),
                'args'                => array(
                    'q'        => array(
                        'required'          => true,
                        'sanitize_callback' => 'sanitize_text_field',
                    ),
                    'page'     => array(
                        'default'           => 1,
                        'sanitize_callback' => 'absint',
                    ),
                    'per_page' => array(
                        'default'           => 10,
                        'sanitize_callback' => 'absint',
                    ),
                ),
            )
        );

        // Insert new log
        register_rest_route( self::NAMESPACE, '/logs',
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array( LogsController::class, 'create_log' ),
                'permission_callback' => array( $this, 'check_permission' ),
                'args'                => array(
                    'user_id'     => array(
                        'required'          => true,
                        'sanitize_callback' => 'absint',
                    ),
                    'ip'          => array(
                        'required'          => true,
                        'sanitize_callback' => 'sanitize_text_field',
                    ),
                    'user_agent'  => array(
                        'required'          => true,
                        'sanitize_callback' => 'sanitize_text_field',
                    ),
                    'title'       => array(
                        'required'          => true,
                        'sanitize_callback' => 'sanitize_text_field',
                    ),
                    'description' => array(
                        'required'          => true,
                        'sanitize_callback' => 'sanitize_textarea_field',
                    ),
                    'data'        => array(
                        'required'          => true,
                        'sanitize_callback' => 'sanitize_textarea_field',
                    ),
                ),
            )
        );

        // Update log by ID
        register_rest_route( self::NAMESPACE, '/logs/(?P<id>\d+)',
            array(
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => array( LogsController::class, 'update_log' ),
                'permission_callback' => array( $this, 'check_permission' ),
                'args'                => array(
                    'id'          => array(
                        'required'          => true,
                        'sanitize_callback' => 'absint',
                    ),
                    'user_id'     => array(
                        'sanitize_callback' => 'absint',
                    ),
                    'ip'          => array(
                        'sanitize_callback' => 'sanitize_text_field',
                    ),
                    'user_agent'  => array(
                        'sanitize_callback' => 'sanitize_text_field',
                    ),
                    'title'       => array(
                        'sanitize_callback' => 'sanitize_text_field',
                    ),
                    'description' => array(
                        'sanitize_callback' => 'sanitize_textarea_field',
                    ),
                    'data'        => array(
                        'sanitize_callback' => 'sanitize_textarea_field',
                    ),
                ),
            )
        );

        // Delete log by ID
        register_rest_route( self::NAMESPACE, '/logs/(?P<id>\d+)',
            array(
                'methods'             => WP_REST_Server::DELETABLE,
                'callback'            => array( LogsController::class, 'delete_log' ),
                'permission_callback' => array( $this, 'check_permission' ),
                'args'                => array(
                    'id' => array(
                        'required'          => true,
                        'sanitize_callback' => 'absint',
                    ),
                ),
            )
        );

        // Delete all logs
        register_rest_route( self::NAMESPACE, '/logs/delete-all',
            array(
                'methods'             => WP_REST_Server::DELETABLE,
                'callback'            => array( LogsController::class, 'delete_all_logs' ),
                'permission_callback' => array( $this, 'check_permission' ),
            )
        );

        // Get single log by ID
        register_rest_route( self::NAMESPACE,'/logs/(?P<id>\d+)',
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( LogsController::class, 'get_log' ),
                'permission_callback' => array( $this, 'check_permission' ),
                'args'                => array(
                    'id' => array(
                        'required'          => true,
                        'sanitize_callback' => 'absint',
                    ),
                ),
            )
        );

        // Logs Over Time Chart
        register_rest_route( self::NAMESPACE,'/logs/stats/over-time',
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( LogsController::class, 'get_logs_over_time' ),
                'permission_callback' => array( $this, 'check_permission' ),
            )
        );

        // Logs by Category Chart
        register_rest_route( self::NAMESPACE,'/logs/stats/by-category',
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( LogsController::class, 'get_logs_by_category' ),
                'permission_callback' => array( $this, 'check_permission' ),
            )
        );

        // Logs by User (Top Users) Chart
        register_rest_route( self::NAMESPACE,'/logs/stats/top-users',
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( LogsController::class, 'get_logs_top_users' ),
                'permission_callback' => array( $this, 'check_permission' ),
            )
        );

        // Logs by IP Address (Top IPs) Chart
        register_rest_route( self::NAMESPACE,'/logs/stats/top-ips',
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( LogsController::class, 'get_logs_top_ips' ),
                'permission_callback' => array( $this, 'check_permission' ),
            )
        );

        // Hourly Activity Chart
        register_rest_route( self::NAMESPACE,'/logs/stats/hourly-activity',
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( LogsController::class, 'get_logs_hourly_activity' ),
                'permission_callback' => array( $this, 'check_permission' ),
            )
        );

        // Bulk Delete Logs
        register_rest_route( self::NAMESPACE,'/logs/bulk-delete',
            array(
                'methods'             => WP_REST_Server::DELETABLE,
                'callback'            => array( LogsController::class, 'bulk_delete_logs' ),
                'permission_callback' => array( $this, 'check_permission' ),
                'args'                => array(
                    'ids' => array(
                        'required'          => true,
                        'type'     => 'array',
                        'items'    => array( 'type' => 'integer' ),
                    ),
                ),
            )
        );

        // Get specifications for a product
        register_rest_route( self::NAMESPACE,'/product/(?P<product_id>\d+)/specifications',
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_product_specifications' ),
                'permission_callback' => function () {
                    return current_user_can( 'edit_posts' );
                },
                'args'                => array(
                    'product_id' => array(
                        'required'          => true,
                        'sanitize_callback' => 'absint',
                    ),
                ),
            )
        );

        // Save specifications for a product
        register_rest_route( self::NAMESPACE,'/product/(?P<product_id>\d+)/specifications',
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array( $this, 'save_product_specifications' ),
                'permission_callback' => function () {
                    return current_user_can( 'edit_posts' );
                },
                'args'                => array(
                    'product_id' => array(
                        'required'          => true,
                        'sanitize_callback' => 'absint',
                    ),
                ),
            )
        );
    }

    public function get_product_specifications( WP_REST_Request $request ) {
        $product_id = intval( $request->get_param( 'product_id' ) );

        if ( ! $product_id ) {
            return new WP_Error(
                'invalid_product_id',
                __( 'Invalid product ID', 'mos-product-specifications-tab' ),
                array( 'status' => 400 )
            );
        }

        $specifications_data = get_post_meta( $product_id, '_mos_specifications_data', true );

        if ( empty( $specifications_data ) ) {
            $specifications_data = array();
        }

        return rest_ensure_response( array(
            'success' => true,
            'data'    => $specifications_data,
        ) );
    }

    public function save_product_specifications( WP_REST_Request $request ) {
        $product_id = intval( $request->get_param( 'product_id' ) );

        if ( ! $product_id ) {
            return new WP_Error(
                'invalid_product_id',
                __( 'Invalid product ID', 'mos-product-specifications-tab' ),
                array( 'status' => 400 )
            );
        }

        $data = $request->get_json_params();

        if ( ! isset( $data['specifications'] ) ) {
            return new WP_Error(
                'missing_data',
                __( 'Missing specifications data', 'mos-product-specifications-tab' ),
                array( 'status' => 400 )
            );
        }

        $updated = update_post_meta( $product_id, '_mos_specifications_data', $data['specifications'] );

        return rest_ensure_response( array(
            'success' => true,
            'message' => __( 'Specifications saved successfully', 'mos-product-specifications-tab' ),
        ) );
    }
    /**
     * Check permission for API access
     *
     * @param WP_REST_Request $request Request object.
     * @return bool
     */
    // public function check_permission( $request ) {
    //     // Change this based on your requirements
    //     // For development, you might want to allow all users
    //     // For production, restrict to specific capabilities
    //     return current_user_can( 'manage_options' );
    // }
    /**
     * Check if user has permission to access the endpoint.
     *
     * @param WP_REST_Request $request The request object.
     * @return bool|WP_Error True if user has permission, WP_Error otherwise.
     */
    public function check_permission( WP_REST_Request $request ) {

        // Check if user has capability to manage options (typically administrators)
        if ( ! current_user_can( 'manage_options' ) ) {
            return new WP_Error(
                'rest_forbidden',
                __( 'You do not have permission to access this endpoint.', 'mos-product-specifications-tab' ),
                array( 'status' => 403 )
            );
        }

        return true;
    }
    
    // /**
    //  * Return posts for DataTables (server-side).
    //  */
    // public function get_posts( WP_REST_Request $request ) {
    //     $page     = max( 1, intval( $request->get_param('page') ?: 1 ) );
    //     $per_page = max( 1, intval( $request->get_param('per_page') ?: 10 ) );
    //     $status   = sanitize_text_field( $request->get_param('status') ?: 'publish' );
    //     $search   = sanitize_text_field( $request->get_param('search') ?: '' );

    //     // Sorting
    //     $orderby_param = strtolower( sanitize_text_field( $request->get_param('orderby') ?: '' ) );
    //     $order_param   = strtoupper( sanitize_text_field( $request->get_param('order') ?: 'ASC' ) );
    //     $allowed_orderby = [
    //         'title' => 'title',
    //         'date'  => 'date',
    //         'id'    => 'ID',
    //     ];
    //     $orderby = isset( $allowed_orderby[ $orderby_param ] ) ? $allowed_orderby[ $orderby_param ] : 'date';
    //     $order   = in_array( $order_param, [ 'ASC', 'DESC' ], true ) ? $order_param : 'DESC';

    //     $args = [
    //         'post_type'      => 'post',
    //         'post_status'    => $status, // publish|draft|trash|etc
    //         'posts_per_page' => $per_page,
    //         'paged'          => $page,
    //         'orderby'        => $orderby,
    //         'order'          => $order,
    //         's'              => $search,
    //         'no_found_rows'  => false, // we need totals for DataTables
    //     ];

    //     $query = new WP_Query( $args );

    //     $rows = [];
    //     foreach ( $query->posts as $post ) {
    //         $author_id  = $post->post_author;
    //         $categories = wp_get_post_terms( $post->ID, 'category', [ 'fields' => 'names' ] );
    //         $tags       = wp_get_post_terms( $post->ID, 'post_tag', [ 'fields' => 'names' ] );

    //         $rows[] = [
    //             'id'    => $post->ID,
    //             'title' => get_the_title( $post ),
    //             'date'  => get_the_date( '', $post ),
    //             'author'=> [
    //                 'id'     => $author_id,
    //                 'name'   => get_the_author_meta( 'display_name', $author_id ),
    //                 'avatar' => get_avatar_url( $author_id, [ 'size' => 24 ] ),
    //             ],
    //             'categories' => $categories ?: [],
    //             'tags'       => $tags ?: [],
    //             'status'       => get_post_status($post),
    //         ];
    //     }

    //     return [
    //         'data'  => $rows,
    //         'total' => (int) $query->found_posts,
    //         'page'  => (int) $page,
    //     ];
    // }

    // /**
    //  * Change status for a single post.
    //  */
    // public function change_post_status( WP_REST_Request $request ) {
    //     $post_id = (int) $request['id'];
    //     $status  = sanitize_text_field( $request['status'] );

    //     $updated = wp_update_post([
    //         'ID'          => $post_id,
    //         'post_status' => $status,
    //     ], true );

    //     if ( is_wp_error( $updated ) ) {
    //         return new WP_Error( 'update_failed', __( 'Failed to update post status', 'mos-product-specifications-tab' ), [ 'status' => 500 ] );
    //     }

    //     return [ 'success' => true, 'post_id' => $post_id, 'status' => $status ];
    // }

    // /**
    //  * Bulk change status of posts.
    //  */
    // public function bulk_change_status( WP_REST_Request $request ) {
    //     $ids    = $request['ids'];
    //     $status = sanitize_text_field( $request['status'] );

    //     $updated = [];
    //     foreach ( $ids as $id ) {
    //         $result = wp_update_post([
    //             'ID'          => (int) $id,
    //             'post_status' => $status,
    //         ], true );

    //         if ( ! is_wp_error( $result ) ) {
    //             $updated[] = (int) $id;
    //         }
    //     }

    //     return [ 'success' => true, 'updated' => $updated, 'status' => $status ];
    // }
    
	public function get_settings(WP_REST_Request $request)
	{
		if (!current_user_can('manage_options')) {
			return new WP_Error(
				'rest_update_error',
				'Sorry, you are not allowed to update the DAEXT UI Test options.',
				array('status' => 403)
			);
		}
		$mos_product_specifications_tab_options = mos_product_specifications_tab_get_option();
		return new WP_REST_Response($mos_product_specifications_tab_options, 200);
	}
	public function update_settings(WP_REST_Request $request) //WP_REST_Request $request
	{
		if (!current_user_can('manage_options')) {
			return new WP_Error(
				'rest_update_error',
				'Sorry, you are not allowed to update options.'.get_current_user_id(),
				array('status' => 403)
			);
		}
		$mos_product_specifications_tab_options_old = mos_product_specifications_tab_get_option();

		$mos_product_specifications_tab_options = map_deep(wp_unslash($request->get_param('mos_product_specifications_tab_options')), 'wp_kses_post');

		$mos_product_specifications_tab_options ? update_option('mos_product_specifications_tab_options', $mos_product_specifications_tab_options) : '';

		LogsController::log_settings_change($mos_product_specifications_tab_options_old, $mos_product_specifications_tab_options);

		$response = [
			'success' => true,
			'msg'	=> esc_html__('Data successfully added.', 'mos-product-specifications-tab')
		];

		// return $response;
		return new WP_REST_Response($response, 200);

		/*

		return new WP_REST_Response([
			'success' => true,
			'message' => 'Plugin installed successfully.'
		], 200);


		return new WP_REST_Response([
			'success' => false,
			'message' => 'Installed plugin could not be identified'
		], 404);
		*/
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
    public function reset_settings(WP_REST_Request $request)
	{
        if (!current_user_can('manage_options')) {
            return new WP_Error(
                'rest_update_error',
                'Sorry, you are not allowed to reset the settings.',
                array('status' => 403)
            );
        }
        $name = sanitize_text_field(wp_unslash($request->get_param('name')));
        $mos_product_specifications_tab_options_old = mos_product_specifications_tab_get_option();
        $mos_product_specifications_tab_options = mos_product_specifications_tab_get_option();
        $mos_product_specifications_tab_default_options = mos_product_specifications_tab_get_default_options();

        $success = $this->reset_option_by_path($mos_product_specifications_tab_options, $mos_product_specifications_tab_default_options, $name);

        if ($success) {
            update_option('mos_product_specifications_tab_options', $mos_product_specifications_tab_options);
            LogsController::log_settings_reset($name, $mos_product_specifications_tab_options_old[$name] ?? null, $mos_product_specifications_tab_options[$name] ?? null);
            wp_send_json_success(['message' => __('Settings reset successfully.', 'mos-product-specifications-tab')]);
        } else {
            wp_send_json_error(['error_message' => __('Invalid settings path.', 'mos-product-specifications-tab')]);
        }

		$response = [
			'success' => true,
			'msg'	=> esc_html__('Data successfully added.', 'mos-product-specifications-tab')
		];

		// return $response;
		return new WP_REST_Response($response, 200);
	}
    public function reset_settings_all(WP_REST_Request $request)
	{
        if (!current_user_can('manage_options')) {
            return new WP_Error(
                'rest_update_error',
                'Sorry, you are not allowed to reset the settings.',
                array('status' => 403)
            );
        }
        $mos_product_specifications_tab_default_options = mos_product_specifications_tab_get_default_options();

        update_option('mos_product_specifications_tab_options', $mos_product_specifications_tab_default_options);
        // $this->log_settings_reset($name, $mos_product_specifications_tab_options_old[$name] ?? null, $mos_product_specifications_tab_options[$name] ?? null);
        wp_send_json_success(['message' => __('Settings reset successfully.', 'mos-product-specifications-tab')]);

		$response = [
			'success' => true,
			'msg'	=> esc_html__('Data successfully added.', 'mos-product-specifications-tab')
		];

		// return $response;
		return new WP_REST_Response($response, 200);
	}
	
    public static function rest_feedback($request)
    {
        $subject = sanitize_text_field(wp_unslash($request->get_param('subject')));
        $message = sanitize_textarea_field(wp_unslash($request->get_param('message')));
        $user_email = sanitize_email(wp_unslash($request->get_param('email')));
        $phone = sanitize_text_field(wp_unslash($request->get_param('phone')));
        $admin_email = 'mostak.shahid@gmail.com';

        if (empty($message)) {
            return new WP_Error('empty_message', __('Message cannot be empty.', 'mos-product-specifications-tab'), array('status' => 400));
        }

        if (empty($subject)) {
            return new WP_Error('empty_subject', __('Subject cannot be empty.', 'mos-product-specifications-tab'), array('status' => 400));
        }

        $site_name = get_bloginfo('name');
        $site_url = get_home_url();
        $admin_wp_email = get_option('admin_email');
        $timestamp = current_time('mysql');

        $email_success = true;

        $headers = array(
            'From: ' . $site_name . ' <' . $admin_wp_email . '>',
            'Content-Type: text/html; charset=UTF-8'
        );

        $user_email_to_send = !empty($user_email) ? $user_email : $admin_wp_email;

        $thank_you_email_body = self::get_email_template('thank_you', array(
            'site_name' => $site_name,
            'site_url' => $site_url,
            'subject' => $subject,
            'message' => $message,
            'email' => $user_email,
            'phone' => $phone,
            'timestamp' => $timestamp
        ));

        $admin_email_body = self::get_email_template('admin_notification', array(
            'site_name' => $site_name,
            'site_url' => $site_url,
            'subject' => $subject,
            'message' => $message,
            'user_email' => $user_email,
            'phone' => $phone,
            'timestamp' => $timestamp
        ));

        $thank_you_sent = wp_mail($user_email_to_send, __('Thank You for Your Feedback', 'mos-product-specifications-tab') . ' - ' . $site_name, $thank_you_email_body, $headers);
        $admin_notification_sent = wp_mail($admin_email, __('New Feedback Received', 'mos-product-specifications-tab') . ' - ' . $site_name, $admin_email_body, $headers);

        if (!$thank_you_sent || !$admin_notification_sent) {
            $email_success = false;
        }

        // self::send_to_third_party(array(
        //     'site_name' => $site_name,
        //     'site_url' => $site_url,
        //     'subject' => $subject,
        //     'message' => $message,
        //     'user_email' => $user_email,
        //     'phone' => $phone,
        //     'timestamp' => $timestamp
        // ));

        $response = array(
            'success' => true,
            'msg' => $email_success ? esc_html__('Feedback submitted successfully.', 'mos-product-specifications-tab') : esc_html__('Feedback submitted, but there was an issue sending emails.', 'mos-product-specifications-tab'),
            'subject' => $subject,
            'message' => $message,
            'email_sent' => $email_success
        );
        return new WP_REST_Response($response, 200);
    }

    private static function get_email_template($template_type, $data)
    {
        ob_start();
        if ($template_type === 'thank_you') {
            ?>
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title><?php esc_html_e('Thank You', 'mos-product-specifications-tab'); ?></title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 20px;">
                    <tr>
                        <td align="center">
                            <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;"><?php esc_html_e('Thank You!', 'mos-product-specifications-tab'); ?></h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                            <?php esc_html_e('Dear User,', 'mos-product-specifications-tab'); ?>
                                        </p>
                                        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                            <?php esc_html_e('Thank you for your valuable feedback! We appreciate you taking the time to share your thoughts with us. Your feedback helps us improve our products and services.', 'mos-product-specifications-tab'); ?>
                                        </p>
                                        <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0;">
                                            <h3 style="color: #667eea; margin: 0 0 15px 0; font-size: 18px;"><?php esc_html_e('Your Feedback', 'mos-product-specifications-tab'); ?></h3>
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td style="padding: 8px 0; color: #666666; font-weight: bold; width: 100px;"><?php esc_html_e('Subject:', 'mos-product-specifications-tab'); ?></td>
                                                    <td style="padding: 8px 0; color: #333333;"><?php echo esc_html($data['subject']); ?></td>
                                                </tr>
                                                <?php if (!empty($data['message'])): ?>
                                                <tr>
                                                    <td style="padding: 8px 0; color: #666666; font-weight: bold; vertical-align: top;"><?php esc_html_e('Message:', 'mos-product-specifications-tab'); ?></td>
                                                    <td style="padding: 8px 0; color: #333333;"><?php echo nl2br(esc_html($data['message'])); ?></td>
                                                </tr>
                                                <?php endif; ?>
                                                <?php if (!empty($data['phone'])): ?>
                                                <tr>
                                                    <td style="padding: 8px 0; color: #666666; font-weight: bold;"><?php esc_html_e('Phone:', 'mos-product-specifications-tab'); ?></td>
                                                    <td style="padding: 8px 0; color: #333333;"><?php echo esc_html($data['phone']); ?></td>
                                                </tr>
                                                <?php endif; ?>
                                            </table>
                                        </div>
                                        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                                            <?php esc_html_e('We will review your feedback and get back to you if necessary.', 'mos-product-specifications-tab'); ?>
                                        </p>
                                        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0;">
                                            <?php esc_html_e('Best regards,', 'mos-product-specifications-tab'); ?><br>
                                            <?php echo esc_html($data['site_name']); ?> <?php esc_html_e('Team', 'mos-product-specifications-tab'); ?>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                                        <p style="color: #999999; font-size: 12px; margin: 0;">
                                            <?php printf(esc_html__('This email was sent from %1$s', 'mos-product-specifications-tab'), '<a href="' . esc_url($data['site_url']) . '" style="color: #667eea; text-decoration: none;">' . esc_html($data['site_name']) . '</a>'); ?>
                                        </p>
                                        <p style="color: #999999; font-size: 12px; margin: 5px 0 0 0;">
                                            <?php esc_html_e('Submitted on:', 'mos-product-specifications-tab'); ?> <?php echo esc_html($data['timestamp']); ?>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            <?php
        } elseif ($template_type === 'admin_notification') {
            ?>
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title><?php esc_html_e('New Feedback', 'mos-product-specifications-tab'); ?></title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 20px;">
                    <tr>
                        <td align="center">
                            <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 <?php esc_html_e('New Feedback Received!', 'mos-product-specifications-tab'); ?></h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                            <?php esc_html_e('You have received new feedback from your website.', 'mos-product-specifications-tab'); ?>
                                        </p>
                                        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0;">
                                            <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px;"><?php esc_html_e('Feedback Details', 'mos-product-specifications-tab'); ?></h3>
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td style="padding: 8px 0; color: #666666; font-weight: bold; width: 120px;"><?php esc_html_e('Website:', 'mos-product-specifications-tab'); ?></td>
                                                    <td style="padding: 8px 0; color: #333333;"><?php echo esc_html($data['site_name']); ?></td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; color: #666666; font-weight: bold;"><?php esc_html_e('Site URL:', 'mos-product-specifications-tab'); ?></td>
                                                    <td style="padding: 8px 0; color: #333333;"><a href="<?php echo esc_url($data['site_url']); ?>" style="color: #f5576c; text-decoration: none;"><?php echo esc_url($data['site_url']); ?></a></td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; color: #666666; font-weight: bold;"><?php esc_html_e('Subject:', 'mos-product-specifications-tab'); ?></td>
                                                    <td style="padding: 8px 0; color: #333333; font-weight: bold;"><?php echo esc_html($data['subject']); ?></td>
                                                </tr>
                                                <?php if (!empty($data['user_email'])): ?>
                                                <tr>
                                                    <td style="padding: 8px 0; color: #666666; font-weight: bold;"><?php esc_html_e('User Email:', 'mos-product-specifications-tab'); ?></td>
                                                    <td style="padding: 8px 0; color: #333333;"><a href="mailto:<?php echo esc_attr($data['user_email']); ?>" style="color: #f5576c; text-decoration: none;"><?php echo esc_html($data['user_email']); ?></a></td>
                                                </tr>
                                                <?php endif; ?>
                                                <?php if (!empty($data['phone'])): ?>
                                                <tr>
                                                    <td style="padding: 8px 0; color: #666666; font-weight: bold;"><?php esc_html_e('Phone:', 'mos-product-specifications-tab'); ?></td>
                                                    <td style="padding: 8px 0; color: #333333;"><?php echo esc_html($data['phone']); ?></td>
                                                </tr>
                                                <?php endif; ?>
                                                <?php if (!empty($data['message'])): ?>
                                                <tr>
                                                    <td style="padding: 8px 0; color: #666666; font-weight: bold; vertical-align: top;"><?php esc_html_e('Message:', 'mos-product-specifications-tab'); ?></td>
                                                    <td style="padding: 8px 0; color: #333333; background-color: #f8f9fa; padding: 10px; border-radius: 4px;"><?php echo nl2br(esc_html($data['message'])); ?></td>
                                                </tr>
                                                <?php endif; ?>
                                                <tr>
                                                    <td style="padding: 8px 0; color: #666666; font-weight: bold;"><?php esc_html_e('Submitted:', 'mos-product-specifications-tab'); ?></td>
                                                    <td style="padding: 8px 0; color: #333333;"><?php echo esc_html($data['timestamp']); ?></td>
                                                </tr>
                                            </table>
                                        </div>
                                        <p style="color: #333333; font-size: 14px; line-height: 1.6; margin: 0;">
                                            <strong><?php esc_html_e('Plugin:', 'mos-product-specifications-tab'); ?></strong> Mos Product Specifications Tab
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                                        <p style="color: #999999; font-size: 12px; margin: 0;">
                                            <?php esc_html_e('This is an automated notification. Please do not reply to this email.', 'mos-product-specifications-tab'); ?>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            <?php
        }
        return ob_get_clean();
    }

    private static function send_to_third_party($data)
    {
        $webhook_url = apply_filters('mos_product_specifications_tab_feedback_webhook_url', '');

        if (empty($webhook_url)) {
            return false;
        }

        $payload = json_encode($data);

        $args = array(
            'body' => $payload,
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'timeout' => 30
        );

        $response = wp_remote_post($webhook_url, $args);

        if (is_wp_error($response)) {
            error_log(sprintf(__('Mos Product Specifications Tab - Failed to send feedback to webhook: %s', 'mos-product-specifications-tab'), $response->get_error_message()));
            return false;
        }

        return true;
    }
    public function rest_set_settings_theme(WP_REST_Request $request)
    {
        $user_id = sanitize_text_field(wp_unslash($request->get_param('id')));
        // $user_id = get_current_user_id();
        $settings_theme = sanitize_text_field(wp_unslash($request->get_param('settings_theme')));
        // get_user_meta($user_id, 'mos_product_specifications_tab_settings_theme', $settings_theme);
        update_user_meta( $user_id, 'mos_product_specifications_tab_settings_theme', $settings_theme );
                
        $response = [
            'success' => true,
            'msg' => esc_html__('Theme set successfully.', 'mos-product-specifications-tab'),
        ];

        return new WP_REST_Response($response, 200);
    }
    public function rest_get_settings_theme(WP_REST_Request $request)
    {
        $user_id = sanitize_text_field(wp_unslash($request->get_param('id')));
        $settings_theme = get_user_meta($user_id, 'mos_product_specifications_tab_settings_theme', true);
        // return $settings_theme??'light';
        return $settings_theme?$settings_theme:'light';
    }
    public function rest_get_option(WP_REST_Request $request)
	{
		$option_name = sanitize_text_field(wp_unslash($request->get_param('option_name')));
		$option_value = get_option($option_name);

		if ($option_value === false) {
			return [];
		}

		return new WP_REST_Response($option_value, 200);
	}

	public function rest_set_option(WP_REST_Request $request)
	{
		$option_name = sanitize_text_field(wp_unslash($request->get_param('option_name')));
		$option_value = $request->get_param('option_value');

		if (empty($option_name)) {
			return new WP_Error(
				'rest_invalid_param',
				__('Option name is required.', 'mos-product-specifications-tab'),
				array('status' => 400)
			);
		}

		$updated = update_option($option_name, $option_value);

		if ($updated === false) {
			return new WP_Error(
				'rest_update_failed',
				__('Failed to update option.', 'mos-product-specifications-tab'),
				array('status' => 500)
			);
		}

		$response = [
			'success' => true,
			'msg' => esc_html__('Option updated successfully.', 'mos-product-specifications-tab'),
		];

		return new WP_REST_Response($response, 200);
	}
    /**
     * Get the deactivation link.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response|WP_Error The response or error.
     */
    public function get_deactivation_link( WP_REST_Request $request ) {
        // Get the encrypted key from options
        $encrypted_key = get_option( 'mos_product_specifications_tab_deactive_key' );

        if ( false === $encrypted_key ) {
            return new WP_Error(
                'key_not_found',
                __( 'Deactivation key not found. Please reactivate the plugin.', 'mos-product-specifications-tab' ),
                array( 'status' => 404 )
            );
        }

        // Decrypt the key
        $decrypted_key = CryptoHelper::decrypt( $encrypted_key );

        if ( false === $decrypted_key ) {
            return new WP_Error(
                'decryption_failed',
                __( 'Failed to decrypt deactivation key. Please contact support.', 'mos-product-specifications-tab' ),
                array( 'status' => 500 )
            );
        }

        // Build the deactivation URL
        $deactivation_url = add_query_arg(
            array(
                'action' => 'mos_product_specifications_tab_deactivate',
                'secret_key' => $decrypted_key,
            ),
            admin_url( 'admin-post.php' )
        );

        // Return the response
        return new WP_REST_Response(
            array(
                'success' => true,
                'deactivation_url' => $deactivation_url,
                'message' => __( 'Deactivation link generated successfully.', 'mos-product-specifications-tab' ),
                'warning' => __( 'This link will only work once. After deactivation, a new link will be generated on reactivation.', 'mos-product-specifications-tab' ),
            ),
            200
        );
    }

}
// new Rest_Api();