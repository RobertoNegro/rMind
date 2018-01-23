function openAside() {
	$('aside').toggleClass('aside_open', true);
	$('body').toggleClass('aside_open', true);
	$('nav').toggleClass('aside_open', true);
	$('#darker_overlay').toggleClass('aside_open', true);
}

function closeAside() {
	$('aside').toggleClass('aside_open', false);
	$('body').toggleClass('aside_open', false);
	$('nav').toggleClass('aside_open', false);
	$('#darker_overlay').toggleClass('aside_open', false);
}

function toggleFullscreen() {
	if (screenfull.enabled) {
		screenfull.toggle();
	}
}

var scrollbar;

function scrollToBottom() {
	$(scrollbar).animate({
		scrollTop: $(scrollbar).prop("scrollHeight")
	}, 500);
}

$(document).ready(function () {
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

	$('html').swipe({
		swipeLeft: function (event, direction, distance, duration, fingerCount, fingerData) {
			if(fingerCount > 0 && direction === 'left') {
				closeAside();
			}
		}, swipeRight: function (event, direction, distance, duration, fingerCount, fingerData) {
			if(fingerCount > 0 && direction === 'right') {
				openAside();
			}
		}, allowPageScroll: 'vertical',
		excludedElements:"label, button, input, select, textarea, a, .noSwipe"
	});
});
