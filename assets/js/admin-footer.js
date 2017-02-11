/**
 * Prints out the inline javascript needed for the admin panel.
 */
jQuery(document).ready(function($) {
	/*Sortable popup types*/
	$('#popup_types_list').sortable({
		items: 'li',
		cursor: 'move',
		containment: 'parent',
		placeholder: 'my-placeholder'
	});
	
	$('#filter_types').on('keyup', function(){

	var searchTerm = $(this).val().toLowerCase();
	
		$('#wpcfpu_popup_types_gallery li').each(function(){
	
			if ($(this).filter('[data-search-term *= ' + searchTerm + ']').length > 0 || searchTerm.length < 1) {
				$(this).show();
			} else {
				$(this).hide();
			}
	
		});
	
	});
});