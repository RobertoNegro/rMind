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
