var scrollbar;

function prepareScrollbar() {
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
}

function scrollToBottom() {
	$(scrollbar).stop();
	$(scrollbar).animate({
		scrollTop: $(scrollbar).prop("scrollHeight")
	}, 500);
}

function isThinking(value) {
	var hasToGoBottom = false;
	if (value && scrollbar.scrollHeight - scrollbar.scrollTop === scrollbar.clientHeight) {
		hasToGoBottom = true;
	}

	$('#thinking_indicators').toggleClass('show', value);

	if (hasToGoBottom)
		scrollToBottom();
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
	var el = $('<div class="message ' + type + '">' + text + '</div>').appendTo('#chat_messages');

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
	var text = $('#message_input').val();
	$('#message_input').val('');
	addSendMessage(text);

	isThinking(true);
}