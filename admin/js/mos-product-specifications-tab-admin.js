jQuery(document).ready(function($) {
	$('.woocommerce_options_panel').each(function(index) {
		field_groups    = $(this).find('.mos-specification-groups');
		accordion_group = $(this).find('.mos-specification-accordion');
		if ( accordion_group.length ) {
		  	accordion_group.accordion({        
				header: '.mos-specification-group-title',
				collapsible : true,
				active: false,
				animate: 250,
				heightStyle: 'content',
				icons: {
				'header': 'dashicons dashicons-arrow-right',
				'activeHeader': 'dashicons dashicons-arrow-down'
				},
			}).sortable({
				axis: 'y',
				handle: '.mos-specification-group-title',
				helper: 'original',
				cursor: 'move',
				placeholder: 'widget-placeholder',
				update: function( event, ui ){
				// ui.item.children( '.mos-specification-group-title' ).triggerHandler( 'focusout' );
				// accordion_group.accordion({ active:false });
				var container = ui.item.closest('.mos-specification-groups');
				mosSpecificationResetIndex(container);
				}
			});
		}
	});
	function mosSpecificationResetIndex(container) {
		// console.log(container);
		container.find('.mos-specification-group').each(function(index) {
		  //console.log(index);
		  $(this).find('input, select, textarea').each( function () {
			var name = $(this).attr('name');
			name = name.replace(/\[(\d+)\]/,function(string, id) {
			  return '[' + index + ']';
			});
			$(this).attr('name', name);
		  });
		});
	}

	$('body').on('click', '.mos-specification-add-group', function( e ) {

		e.preventDefault();
		console.log('Clicked');
		var clone_group     = $(this).siblings('.mos-specification-group.hidden');
		var accordion_group = $(this).siblings('.mos-specification-accordion');  
		var field_groups    = $(this).siblings('.mos-specification-groups');
		/*
		clone_group.find('input, select, textarea').each( function () {
		  var name = $(this).attr('name');
		  var ID = $(this).attr('id');
		  console.log(ID);
		  ID = ID.replace(/\[(\d+)\]/,function(string, id) {
			console.log(string, id);
			return (parseInt(id,10)+1);
		  });
		  name = name.replace('[_nonce]', '');
		  name = name.replace(/\[(\d+)\]/,function(string, id) {
			console.log(string, id);
			return '[' + (parseInt(id,10)+1) + ']';
		  });
		  $(this).attr('name', name);
		  $(this).attr('id', ID);
		});*/
		var id = $(this).siblings('.total-count').val();
		var data = $(this).siblings('.total-count').data();
		// var add = $(this).siblings('.total-count').data('add');
		// var title = $(this).siblings('.total-count').data('title');
		// var description = $(this).siblings('.total-count').data('description');
		// console.log($(this).siblings('.total-count').data());
		var html = '<div class="mos-specification-group"><h4 class="mos-specification-group-title"><span class="text">'+data.add+'</span></h4><div class="mos-specification-group-content"><fieldset class="form-field"><label for="mos-specifications-data-title-'+id+'">'+data.title+'</label><input class="mos-specifications-data-title" type="text" name="_mos_specifications_data['+id+'][title]" id="mos-specifications-data-title-'+id+'" value="" /></fieldset><fieldset class="form-field"><label for="mos-specifications-data-tooltip-'+id+'">'+data.tooltip+'</label><input class="mos-specifications-data-tooltip" type="text" name="_mos_specifications_data['+id+'][tooltip]" id="mos-specifications-data-tooltip-'+id+'" value="" /></fieldset><fieldset class="form-field"><label for="mos-specifications-data-editor-'+id+'">'+data.description+'</label><textarea class="wp-editor-area" name="_mos_specifications_data['+id+'][editor]" id="mos-specifications-data-editor-'+id+'"></textarea></fieldset><fieldset class="form-field mos-specification-remove"><a href="#" class="button button-warning mos-specification-remove-group">Remove</a></fieldset></div></div>';
		var cloned = clone_group.clone().removeClass('hidden');
		// field_groups.append(cloned);
		field_groups.append(html);
		
		var getDefaultSettings = wp.editor.getDefaultSettings();
		getDefaultSettings.quicktags = false;
		getDefaultSettings.tinymce.toolbar1 = "bold,italic,underline,separator,bullist,numlist,separator,alignleft,aligncenter,alignright,separator,link,unlink,undo,redo";
		// wp.editor.initialize( 'mos-specifications-data-nonce-editor',  {
		// 	tinymce: true,
		// 	quicktags: false
		// });
		wp.editor.initialize( 'mos-specifications-data-editor-'+id, getDefaultSettings);
		// console.log(getDefaultSettings);
		
		id++;
		$(this).siblings('.total-count').val(id);
		
	
		if ( accordion_group.length ) {
		  field_groups.accordion('refresh');
		  field_groups.accordion({ active: cloned.index() });
		}
	
	});
	$('body').on('click', '.mos-specification-remove-group', function(e){
		e.preventDefault();
		$(this).closest('.mos-specification-group').remove();
	});
	$('body').on('keyup', '.mos-specifications-data-title', function(){
		$(this).closest('.mos-specification-group').find('.mos-specification-group-title .text').html($(this).val());
	})
});
