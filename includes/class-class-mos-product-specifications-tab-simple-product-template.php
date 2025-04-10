<?php

use Automattic\WooCommerce\Admin\BlockTemplates\BlockInterface;
use Automattic\WooCommerce\Admin\Features\ProductBlockEditor\ProductTemplates\ProductFormTemplateInterface;

add_action(
    'rest_api_init',
    function () {
        /*
		* Add a new group (tab) only if the `general` group is present.
		*
		* This is a common pattern when adding new groups that depend on another group.
		*
		* - Group will be added to all `product-form` templates
		* - There is no need to check if the template exists, since this action is
		*  only triggered when the `general` group is present (which means the template is present too)
		*/
        add_action(
            'woocommerce_block_template_area_product-form_after_add_block_general',
            function (BlockInterface $general_group) {
                $template = $general_group->get_root_template();

                // We do this check to allow VSCode to provide autocomplete for the specific
                // methods of the ProductFormTemplateInterface, such as `add_group`.
                if (!$template instanceof ProductFormTemplateInterface) {
                    return;
                }

                $group = $template->add_group(
                    array(
                        'id'         => 'example-group-1',
                        // Position the group after the general group;
                        // This does not guarantee that the group will be placed directly after the general group,
                        // as other extensions could have also added groups after the general group.
                        'order'      => $general_group->get_order() + 1,
                        'attributes' => array(
                            'title' => __('My Dependent Group', 'mos-product-specifications-tab'),
                        ),
                    )
                );

                $section = $group->add_section(
                    array(
                        'id'         => 'example-section-1',
                        'attributes' => array(
                            'title' => __('My Section One', 'mos-product-specifications-tab'),
                        ),
                    )
                );

                $section->add_block(
                    array(
                        'id'         => 'example-block-1',
                        'blockName'  => 'woocommerce/product-text-field',
                        'attributes' => array(
                            'label'    => __('My Block One', 'mos-product-specifications-tab'),
                            'property' => 'meta_data.example_field_1',
                        ),
                    )
                );
            }
        );

        /*
		* Add a new group (tab) to all `product-form` templates.
		*
		* This is a common pattern when adding new groups that do not depend on another group.
		*
		* - Group will be added to all `product-form` templates
		* - There is no need to check if the template exists, since this action is
		* only triggered when the template is instantiated
		*/
        add_action(
            'woocommerce_layout_template_after_instantiation',
            function ($layout_template_id, $layout_template_area, $layout_template) {
                // We only want to add the group to templates for the product editor.
                if ('product-form' !== $layout_template_area) {
                    return;
                }

                // Add the group to the template.
                $group = $layout_template->add_group(
                    array(
                        'id'         => 'mos-product-specifications-tab-group',
                        // We don't specify an order, so the group will be added at the end.
                        'attributes' => array(
                            'title' => __('Speficications', 'mos-product-specifications-tab'),
                        ),
                    )
                );

                $product_tabs_section = $group->add_section(
                    array(
                        'id'         => 'mos-product-specifications-tab-product-tabs-section',
                        'attributes' => array(
                            'title' => __('Product Tabs', 'mos-product-specifications-tab'),
                            'description' => __('This info will be displayed on the product page, category pages, social media, and search results.', 'woocommerce'),
                        ),
                    )
                );

                $product_tabs_section->add_block(
                    array(
                        'id'         => 'mos-product-specifications-tab-product-tabs-dummy-block',
                        'blockName'  => 'woocommerce/product-text-field',
                        'attributes' => array(
                            'label'    => __('My Block Two', 'mos-product-specifications-tab'),
                            'property' => 'meta_data.example_field_2',
                        ),
                    )
                );
                // 
                $product_attachments_section = $group->add_section(
                    array(
                        'id'         => 'mos-product-specifications-tab-product-attachments-section',
                        'attributes' => array(
                            'title' => __('Product Attachments', 'mos-product-specifications-tab'),
                        ),
                    )
                );
                $product_attachments_section->add_block(
                    array(
                        'id'         => 'mos-product-specifications-tab-product-attachments-dummy-block',
                        'blockName'  => 'woocommerce/product-text-field',
                        'attributes' => array(
                            'label'    => __('Product Attachments field', 'mos-product-specifications-tab'),
                            'property' => 'meta_data.example_field_2',
                        ),
                    )
                );
                // Countdown Timer
                $countdown_timer_section = $group->add_section(
                    array(
                        'id'         => 'mos-product-specifications-tab-countdown-timer-section',
                        'attributes' => array(
                            'title' => __('Countdown Timer', 'mos-product-specifications-tab'),
                        ),
                    )
                );
                $countdown_timer_section->add_block(
                    array(
                        'id'         => 'mos-product-specifications-tab-countdown-timer-dummy-block',
                        'blockName'  => 'woocommerce/product-text-field',
                        'attributes' => array(
                            'label'    => __('Product Discount (%)', 'mos-product-specifications-tab'),
                            'property' => 'meta_data.example_field_2',
                            'description' => __('Please set "Sale price" first.', 'woocommerce'),
                        ),
                    )
                );
                $countdown_timer_section->add_subsection(
                    array(
                        'id'             => 'product-downloads-section-2',
                        'order'          => 20,
                        'attributes'     => array(
                            'title'       => __('Downloads', 'woocommerce'),
                            'description' => sprintf(
                                /* translators: %1$s: Downloads settings link opening tag. %2$s: Downloads settings link closing tag. */
                                __('Add any files you\'d like to make available for the customer to download after purchasing, such as instructions or warranty info. Store-wide updates can be managed in your %1$sproduct settings%2$s.', 'woocommerce'),
                                '<a href="' . admin_url('admin.php?page=wc-settings&tab=products&section=downloadable') . '" target="_blank" rel="noreferrer">',
                                '</a>'
                            ),
                        ),
                        'hideConditions' => array(
                            array(
                                'expression' => 'editedProduct.downloadable !== true',
                            ),
                        ),
                    )
                )->add_block(
                    array(
                        'id'        => 'product-downloads-2',
                        'blockName' => 'woocommerce/product-downloads-field',
                        'order'     => 10,
                    )
                );
            },
            10,
            3
        );
    },
    9,
    0
);
