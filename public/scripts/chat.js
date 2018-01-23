var scrollbar;
var waitingResponses = 0;

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

	waitingResponses++;
	isThinking(true);

	var url = "../webhook?message=" + text;
	$.get({
		url: url,
		success: function (result, status) {						
			waitingResponses--;			
			if (waitingResponses <= 0) {
				isThinking(false);
				waitingResponses = 0;
			}
			
			if (result.result.fulfillment.data) {
				var cards = JSON.parse(result.result.fulfillment.data);
				if(cards) {
					if(Array.isArray(cards)) {
						if(cards.length > 0)
							for (var i = 0, len = cards.length; i < len; i++)
								addRecvCard(cards[i]);
					}
					else {
						if(cards._id)
							addRecvCard(cards);
					}
				}
			}			
			
			if(result.result.fulfillment.speech)
				addRecvMessage(result.result.fulfillment.speech);

		}
	});
}

function about() {
	addRecvMessage("rMind is wrote by Roberto Negro as a project for the course of Ingegneria del Software 2 in the University of Trento (y. 2017/18, n. 178932).<br/>It's powered by NodeJS and it uses MongoDB for the database section (thanks to mLab that offers a Database-as-a-service for MongoDB).<br/>It's actually hosted on Heroku, one of the most popular Platform-as-a-serice.<br/><br/>Hope you enjoy it, for any troubles or information don't hesitate to contact me at roberto.negro<span class='at'></span>studenti.unitn.it");
	$('.at').text('@');
	closeAside();
}
