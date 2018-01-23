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
			if (!e.shiftKey) {
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
				addMessage('Another one!', 'recv');
			}
		});
		
		
		
		setTimeout(function () {
			var coords = getCoordsFromAddress('Aereoporto Venezia', function (err, location) {
				if (err)
					console.log(err);
				else {
					addRecvCard("ab", new Date(2018, 0, 11, 4, 30, 0, 0), "Take John from the Airport", [location], [{
						path: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Richmond_International_Airport.jpg',
						desc: 'An airport'
				}, {
					path: 'https://brightcove04pmdo-a.akamaihd.net/5104226627001/5104226627001_5244707255001_5214913279001-vs.jpg?pubId=5104226627001&videoId=5214913279001',
					desc: 'Venice at night'
				}], [{
						url: 'http://www.veniceairport.it/voli.html',
						desc: 'Info about flights from venice'
				}]);
					addMessage('Another one!', 'recv');
				}
			});
		}, 100);
	}, 100);

});
