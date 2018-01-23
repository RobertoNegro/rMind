var GOOGLE_GEOCODING_KEY = "AIzaSyAlJ4pyXibSAQA_W1BboAeYIMMMGvrculo";

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
			threshold: 10
		}));

		managers[i].on('pan', function (e) {
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

	// TODO: DUMMY FUNC SEND MESSAGE

	isThinking(true);
}



function switchCard(selector, showSub) {
	if (!$(selector + ' .subcard').hasClass('animated') && !$(selector + ' .card').hasClass('animated')) {
		if (showSub) {
			$(selector + ' .subcard').unbind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd").stop(true, true).toggleClass('animated', false);
			$(selector + ' .card').unbind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd").stop(true, true).toggleClass('animated', false);

			$(selector + ' .subcard').toggleClass('hide', false).toggleClass('show', true).toggleClass('animated', true);
			$(selector + ' .subcard').one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
				$(selector + ' .subcard').toggleClass('animated', false);
			});
			
			$(selector + ' .card').stop(true, true).toggleClass('show', false).toggleClass('hide', true).toggleClass('animated', true);
			$(selector + ' .card').one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
				$(selector + ' .card').toggleClass('animated', false);
			});
		} else {
			$(selector + ' .subcard').unbind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd").stop(true, true).toggleClass('animated', false);
			$(selector + ' .card').unbind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd").stop(true, true).toggleClass('animated', false);
			
			$(selector + ' .subcard').stop(true, true).toggleClass('show', false).toggleClass('hide', true).toggleClass('animated', true);
			$(selector + ' .subcard').one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
				$(selector + ' .subcard').toggleClass('animated', false);
			});
			
			$(selector + ' .card').stop(true, true).toggleClass('hide', false).toggleClass('show', true).toggleClass('animated', true);
			$(selector + ' .card').one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
				$(selector + ' .card').toggleClass('animated', false);
			});
		}
	}
}

/*

function switchCard(selector, showSub) {
	if (showSub) {
		$(selector + ' .subcard').unbind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd");
		$(selector + ' .subcard').stop(true, true).toggleClass('show', true);
		
		$(selector + ' .card').unbind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd");
		$(selector + ' .card').stop(true, true).toggleClass('hide', true);			
	} else {
		$(selector + ' .subcard').stop(true, true).toggleClass('hide', true);
		$(selector + ' .subcard').one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
			$(selector + ' .subcard').toggleClass('show', false).toggleClass('hide', false);
		});
		
		$(selector + ' .card').stop(true, true).toggleClass('show', true);		
		$(selector + ' .card').one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
			$(selector + ' .card').toggleClass('show', false).toggleClass('hide', false);
		});
	}
}
*/
function getLatLng(address) {
	var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + GOOGLE_GEOCODING_KEY;
	$.getJSON(url, function (data, textStatus) {
		return data.results[0].geometry.location;
	});
}

function getAddress(lat, lng) {
	var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=" + GOOGLE_GEOCODING_KEY;
	$.getJSON(url, function (data, textStatus) {
		return data.results[0].formatted_address;
	});
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

	addAsidePanFunctionality(['aside', 'nav', '#darker_overlay', '#chat_scroller'], ['.card_container']);

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

});
