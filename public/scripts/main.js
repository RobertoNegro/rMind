function openAside() {
	$('aside').toggleClass('aside_open', true);
	$('body').toggleClass('aside_open', true);
	$('nav').toggleClass('aside_open', true);
}

function closeAside() {
	$('aside').toggleClass('aside_open', false);
	$('body').toggleClass('aside_open', false);
	$('nav').toggleClass('aside_open', false);
}

$(document).ready(function () {
	autosize($('textarea'));
});
