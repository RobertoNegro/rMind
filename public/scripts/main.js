
var hasToResetFullscreen = false;

$(document).ready(function () {
	$('img').on('dragstart', function (event) {
		event.preventDefault();
	});

	autosize($('textarea'));

	prepareScrollbar();
	scrollToBottom();

	addAsidePanFunctionality(['aside', 'nav', '#darker_overlay', '#chat_scroller'], ['.map']);

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

	var coords = getCoordsFromAddress('Via Liguria, 1, Arzignano', function (err, location) {
		if(err)
			console.log(err);
		else
			addRecvCard("aa", new Date(2018, 0, 9, 2, 41, 0, 0), "Dinner with colleagues", [ location ], [{ path: 'https://fimgs.net/images/secundar/o.44140.jpg', desc:'Via Trento, 12'}]);
	});
});
