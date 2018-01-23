var hasToResetFullscreen = false;

$(document).ready(function () {
	$(document).on('dragstart', 'img', function (event) {
		event.preventDefault();
	});

	autosize($('textarea'));
	
	new SimpleBar($('#aside_scroller')[0]);
	prepareScrollbar();
	scrollToBottom();

	addAsidePanFunctionality(['aside', 'nav', '#darker_overlay', '#chat_scroller'], ['.card_wrapper']);

	$('#message_input').focusin(function () {
		if (screenfull.enabled && screenfull.isFullscreen) {
			screenfull.exit();
			hasToResetFullscreen = true;
		}
		scrollToBottom();
	});

	$('#message_input').focusout(function () {
		if (screenfull.enabled && !screenfull.isFullscreen && hasToResetFullscreen) {
			hasToResetFullscreen = false;
			screenfull.toggle();
		}
	});

	$('#message_input').keyup(function () {
		refreshSendVoiceButtons();
	});
	refreshSendVoiceButtons();

	$('#message_input').on('keypress', function (e) {
		if (e.which === 13) {
			if (!e.shiftKey) {
				e.preventDefault();
				sendMessage();
			}
		}
	});
});
