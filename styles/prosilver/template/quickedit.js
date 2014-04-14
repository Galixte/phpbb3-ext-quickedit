(function($) {  // Avoid conflicts with other libraries

"use strict";

// Holds the standard edit button click event during quickedit
phpbb.edit_button_event = [];

/**
 * This callback displays the quickedit area in place of the post that is being
 * edited. It will also ajaxify the cancel button.
 */
phpbb.addAjaxCallback('quickedit_post', function(res) {
	if (typeof res.POST_ID !== 'undefined' && res.POST_ID > 0 && !$('#quickeditbox').length) {
		$('#p' + res.POST_ID +' .content').hide();
		$(res.MESSAGE).insertAfter('#p' + res.POST_ID +' .author');
		var edit_link = $('#p' + res.POST_ID +' .edit-icon a');
		var edit_buttons = $('div[id^="p"]').filter(function() {
			return this.id.match(/^p+(?:([0-9]+))/);
		});

		// Cancel button will show post again
		$('#quickeditbox input[name="cancel"]').click(function () {
			$('#quickeditbox').remove();
			$('#p' + res.POST_ID + ' .content').show();

			// Remove cancel event from all other quickedit buttons
			edit_buttons.each(function() {
				// Only other edit buttons will trigger cancel
				if (this.id === 'p' + res.POST_ID) {
					return true;
				}
				var edit_button_id = '#' + this.id;
				var edit_button = $(edit_button_id + ' .edit-icon a');

				// Remove last click event. This should be the
				// one we added
				edit_button.each(function() {
					var event_handlers = $._data(this, 'events')['click'];
					event_handlers.pop();
				});
			});

			// Add edit button click event for quickedit back
			edit_link.each(function() {
				var event_handlers = $._data(this, 'events')['click'];
				event_handlers.splice(0, 0, phpbb.edit_button_event);
				// Remove full editor click event
				event_handlers.pop();
			});
			phpbb.edit_button_event = [];
			return false;
		});

		// Edit button will redirect to full editor
		edit_link.bind('click', function () {
			if (typeof $('#quickeditbox input[name="preview"]') !== 'undefined') {
				$('#quickeditbox input[name="preview"]').click();
			}
			return false;
		});

		// Clicking a different edit button will cancel the initial quickedit
		edit_buttons.each(function() {
			// Only the other edit buttons will trigger a cancel
			if (this.id === 'p' + res.POST_ID) {
				return true;
			}
			var edit_button_id = '#' + this.id;
			var edit_button = $(edit_button_id + ' .edit-icon a');

			edit_button.bind('click', function() {
				$('#quickeditbox input[name="cancel"]').trigger('click');
			});
		});

		// Remove edit button click event for quickedit
		edit_link.each(function() {
			var event_handlers = $._data(this, 'events')['click'];
			phpbb.edit_button_event = event_handlers.shift();
		});
	}
});

$(document).ready(function() {
	var allow_quickedit_div = $('div[data-allow-quickedit]');

	if (typeof allow_quickedit_div !== 'undefined' && allow_quickedit_div.attr('data-allow-quickedit') === '1')
	{
		var edit_buttons = $('div[id^="p"]').filter(function() {
			return this.id.match(/^p+(?:([0-9]+))/);
		});

		edit_buttons.each(function() {
			var $this = $('#' + this.id + ' .edit-icon a'),
				fn;

			fn = 'quickedit_post';
			phpbb.ajaxify({
				selector: $this,
				refresh: false,
				callback: fn
			});
		});
	}
});


})(jQuery); // Avoid conflicts with other libraries