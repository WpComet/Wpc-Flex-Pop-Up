jQuery( function ( $ ) {

	// Media Library button hook (WP >= 3.5):
	$('a#dgd_library_button').click(function(e){

		// Prevent default:
		e.preventDefault();

		// Set frame object:
		var frame = wp.media({
			id: 'wpcfpu_featured_image',
			title : wpcfpu_dnd_vars.panel.title,
			multiple : true,
			library : { type : 'image'},
			button : { text : wpcfpu_dnd_vars.panel.button }
		});

		// On select image:
		frame.on('select', function(){
			var attachment = frame.state().get('selection').first().toJSON();
			doSetFeaturedImage(attachment.id);
		});

		// Display:
		frame.open();

	});


	// Set as featured image hook (WP < 3.5):
	$('a.wp-post-thumbnail').live('click', function(e){
		parent.tb_remove();
		parent.location.reload(1);
	});


	// Set as featured image handler (WP >= 3.5):
	$('a#insert-media-button').live('click', function(){
		if (typeof wp !== 'undefined'){
			var editor_id = $('.wp-media-buttons:eq(0) .add_media').attr('data-editor');
			var frame = wp.media.editor.get(editor_id);
			frame = 'undefined' != typeof(frame) ? frame : wp.media.editor.add(editor_id);
			if (frame){
				frame.on('select', function(){
					var currentState = frame.state();
					if (currentState.id === 'featured-image'){
						doFetchFeaturedImage();
					}
				});
			}
		}
	});


	// Remove featured image:
	$('#remove-post-thumbnail').live('click', function(){
		$('#current-uploaded-image').slideUp('medium');
	});


	// Set featured image:
	function doSetFeaturedImage(attachmentID){
		$.post(ajaxurl, {
			action: 'wpcfpu_set_featured_image',
			postID: wpcfpu_dnd_vars.post_id,
			attachmentID: attachmentID
		}, function (response){
			var response = $.parseJSON(response);
			if (response.response_code == 200){

				// Publish post:
				if (wpcfpu_dnd_vars.page_reload){
					$('div#publishing-action input#publish').trigger('click');
				}

				// Fetch image:
				doFetchFeaturedImage();

			} else {
				alert(response.response_content);
			}
		});
	}
	
	
	// Fetch featured image function:
	function doFetchFeaturedImage(){
		$.post(ajaxurl, {
			action: 'wpcfpu_get_featured_image',
			post_id: wpcfpu_dnd_vars.post_id
		}, function (response){
			
			// Parse response AS JSON:
			var response = $.parseJSON(response);

			// Valid response:
			if (response.response_code == 200){

				// Find current image and continue:
				$('#current-uploaded-image').slideUp('medium', function(){

					// Update image with new info:
					var imageObject = $('#mbox-drag-to-feature-image div.inside img.img-fluid');
					imageObject.attr('src', response.response_content);
					imageObject.removeAttr('width');
					imageObject.removeAttr('height');
					imageObject.removeAttr('title');
					imageObject.removeAttr('alt');

					// Hide container:
					imageObject.load(function(){

						// Display container:
						$('#current-uploaded-image').slideDown('medium');

						// Fade in upload container:
						$('div#plupload-upload-ui').fadeIn('medium');
						$('#uploaderSection .loading').fadeOut('medium');

					});

				});
			} else {
				alert(response.response_content);
			}

		});
	}
	
});