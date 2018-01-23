var hasToResetFullscreen = false;

$(document).ready(function () {
	$('img').on('dragstart', function (event) {
		event.preventDefault();
	});

	autosize($('textarea'));

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
			if(!e.shiftKey) {
			e.preventDefault();
			sendMessage();
			}
		}
	});

	setTimeout(function () {
		var coords = getCoordsFromAddress('Centro commerciale palladio', function (err, location) {
			if (err)
				console.log(err);
			else {
				addRecvCard("aa", new Date(2018, 1, 19, 15, 41, 0, 0), "Buy a gift for Alice from Sephora", [location], [{
					path: 'https://fimgs.net/images/secundar/o.44140.jpg',
					desc: 'Il profumo che vuole'
				}], [{
					url: 'http://www.gioia.it/bellezza/profumi/consigli/g3329/profumi-inverno-2018-novita/',
					desc: 'Profumi 2018 novità'
				}]);
			}
		});
	}, 2000);

});
