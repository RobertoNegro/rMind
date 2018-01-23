var hasToResetFullscreen = false;
var scrollbar;

function isThinking(value) {
	var hasToGoBottom = false;
	if (value && scrollbar.scrollHeight - scrollbar.scrollTop === scrollbar.clientHeight) {
		hasToGoBottom = true;
	}

	$('#thinking_indicators').toggleClass('show', value);

	if (hasToGoBottom)
		scrollToBottom();
}

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
	$(scrollbar).stop();
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

function addMessage(text, type) {
	var el = $('<div class="message '+type+'">' + text + '</div>').appendTo('#chat_messages');
	
	var autoHeight = el.height();
	var curMinHeight = el.css('min-height');
	var curPaddingTop = el.css('padding-top');
	var curPaddingBottom = el.css('padding-bottom');
	var curColor = el.css('color');
	
	el.css({
		'height': '0px',
		'min-height': '0px',
		'padding-top': '0rem',
		'padding-bottom': '0rem',
		'opacity': '0',
		'color': 'rgba(0, 0, 0, 0)'
	}).animate({
		'height': autoHeight,
		'min-height': curMinHeight,
		'padding-top': curPaddingTop,
		'padding-bottom': curPaddingBottom,
		'opacity': '1',
		'color': curColor
	}, 250, 'swing');
	
	scrollToBottom();
}

function addSendMessage(text) {
	addMessage(text, 'sent');
}

function addRecvMessage(text) {
	addMessage(text, 'recv');
}

function sendMessage() {
	addSendMessage($('#message_input').val());
	// TODO: DUMMY FUNC SEND MESSAGE
	
	//isThinking(true);	
}

$(document).ready(function () {
	$('img').on('dragstart', function (event) {
		event.preventDefault();
	});

	autosize($('textarea'));

	new SimpleBar($('#aside_scroller')[0]);

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


	setTimeout(function () {
		isThinking(true);
	}, 0);
	setTimeout(function () {
		isThinking(false);
	}, 1000);
	setTimeout(function () {
		addRecvMessage("Dynamically added message");
	}, 1000);

});
