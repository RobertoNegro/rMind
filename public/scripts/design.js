function openAside() {
	$('aside').toggleClass('aside_open', true);
	$('#body_wrapper').toggleClass('aside_open', true);
	$('nav').toggleClass('aside_open', true);
	$('#darker_overlay').toggleClass('aside_open', true);
}

function closeAside() {
	$('aside').toggleClass('aside_open', false);
	$('#body_wrapper').toggleClass('aside_open', false);
	$('nav').toggleClass('aside_open', false);
	$('#darker_overlay').toggleClass('aside_open', false);
}

function toggleFullscreen() {
	if (screenfull.enabled) {
		screenfull.toggle();
		scrollToBottom();
	}
}

function addAsidePanFunctionality(elements, excluded) {
	//delete Hammer.defaults.cssProps.userSelect;
	var len = elements.length;
	var managers = [];

	var isExcluded = function (selector) {
		var res = false;
		for (var j = 0; j < excluded.length && !res; j++) {
			if ($(selector).is(excluded[j]) || $(selector).parents(excluded[j]).length > 0)
				res = true;
		}
		return res;
	}

	for (var i = 0; i < len; i++) {
		managers.push(new Hammer.Manager(document.querySelector(elements[i])));
	}

	for (var i = 0; i < len; i++) {
		managers[i].add(new Hammer.Pan({
			domEvents: true,
			threshold: 10,		
			touchAction: 'auto'
		}));

		managers[i].on('panleft panright', function (e) {
			if (isExcluded(e.target)) {
				for (var j = 0; j < len; j++)
					managers[j].stop();
			} else {
				switch (e.additionalEvent) {
					case 'panleft':
						closeAside();
						break;
					case 'panright':
						openAside();
						break;
				}
			}
		});
	}
}

var oldMessages = [];
var oldMessagesIndex = 0;

function prepareMessageInput() {
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
				oldMessagesIndex = oldMessages.push($('#message_input').val());
				sendMessage();				
			}
		} else if (e.which === 38) {
			if($('#message_input').val().length === 0) {				
				if(oldMessagesIndex > 0)
					oldMessagesIndex--;
				$('#message_input').val(oldMessages[oldMessagesIndex]);
			}
		} else if (e.which === 40) {
			if($('#message_input').val().length === 0) {				
				if(oldMessagesIndex < oldMessages.length) {
					oldMessagesIndex++;
					$('#message_input').val(oldMessages[oldMessagesIndex]);
				} else
					$('#message_input').val('');				
			}
		} else {
			oldMessagesIndex = oldMessages.length;
		}
	});
}