jQuery(document).ready(function($) {
    // console.log(mos_product_specifications_tab_ajax_obj.mos_product_specifications_tab_woocommerce_wpnonce);
    $(document).on('click', '#woocommerce_install', function(e) {
        e.preventDefault();
        var current = $(this);
        var plugin_slug = current.attr("data-plugin-slug");
        current.addClass('updating-message').text('Installing...');
        var data = {
            action: 'woocommerce_ajax_install_plugin',
            _ajax_nonce: mos_product_specifications_tab_ajax_obj.mos_product_specifications_tab_install_plugin_wpnonce,
            slug: plugin_slug,
        };

        $.post(mos_product_specifications_tab_ajax_obj.ajax_url, data, function(response) {
            current.removeClass('updating-message');
            current.addClass('updated-message').text('Installing...');
            current.attr("href", response.data.activateUrl);
        })
        .fail(function() {
            current.removeClass('updating-message').text('Install Failed');
        })
        .always(function() {
            current.removeClass('install-now updated-message').addClass('activate-now button-primary').text('Activating...');
            current.unbind(e);
            current[0].click();
        });
    }); 
});