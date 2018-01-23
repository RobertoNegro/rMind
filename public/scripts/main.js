var hasToResetFullscreen = false;
var scrollbar;

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

function scrollToBottom() {
	$(scrollbar).animate({
		scrollTop: $(scrollbar).prop("scrollHeight")
	}, 500);
}

function addAsidePanFunctionality(el) {	
	//delete Hammer.defaults.cssProps.userSelect;
	
	var manager = new Hammer.Manager(el);
	manager.add(new Hammer.Pan({
		domEvents: true,
		threshold: 10
	}));

	manager.on('panleft', function (e) {
		closeAside();
	});

	manager.on('panright', function (e) {
		openAside();
	});
}

function refreshSendVoiceButtons() {
	if (($('#message_input').val()).length == 0) {
			$('#voice_button').toggleClass('show', true);
		$('#send_button').toggleClass('show', false);
	} else {
		$('#voice_button').toggleClass('show', false);
		$('#send_button').toggleClass('show', true);
	}
}

$(document).ready(function () {
	$('img').on('dragstart', function(event) { event.preventDefault(); });
	
	autosize($('textarea'));

	scrollbar = (new SimpleBar($('#chat_scroller')[0])).getScrollElement();
	scrollbar.addEventListener('scroll', function (event) {
		var element = event.target;
		if (element.scrollHeight - element.scrollTop === element.clientHeight) {
			$('#bottom_button').toggleClass('show', false);
		} else {
			$('#bottom_button').toggleClass('show', true);
		}
	});

	scrollToBottom();

	addAsidePanFunctionality(document.querySelector('aside'));
	addAsidePanFunctionality(document.querySelector('nav'));
	addAsidePanFunctionality(document.querySelector('#darker_overlay'));
	addAsidePanFunctionality(document.querySelector('#chat_scroller'));

	$('#message_input').focusin(function () {
		if (screenfull.enabled && screenfull.isFullscreen) {
			screenfull.exit();
			hasToResetFullscreen = true;
		}
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
});
