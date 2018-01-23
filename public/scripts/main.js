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
	prepareMessageInput();
});
