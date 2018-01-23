var scrollbar;

function prepareScrollbar() {
	scrollbar = (new SimpleBar($('#chat_scroller')[0])).getScrollElement();
	scrollbar.addEventListener('scroll', function (event) {
		//console.log(event);
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
	var el = $('<div class="message ' + type + ' hide">' + text + '</div>').appendTo('#chat_messages');
	el.css('transform');
	
	el.toggleClass('hide', false);
	
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

	autosize.update($('#message_input').get(0));
	addSendMessage(text.replace(/\r/g, '').replace(/\n/g, '<br/>'));

	isThinking(true);
}