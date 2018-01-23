function diffMinutes(date) {
	var now = new Date();
	var diff = date - now;
	var diffMins = Math.floor((diff / 1000) / 60);
	return diffMins + 1;
}

function switchCard(selector, showSub) {
	if (showSub) {
		if (!$(selector + ' > .card').hasClass('hide') && $(selector + ' > .subcard').length > 0) {
			if (!$(selector + ' > .subcard').hasClass('animated') && !$(selector + ' > .card').hasClass('animated')) {
				$(selector + ' > .subcard').unbind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd").stop(true, true).toggleClass('animated', false);
				$(selector + ' > .card').unbind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd").stop(true, true).toggleClass('animated', false);

				$(selector + ' > .subcard').toggleClass('hide', false).toggleClass('show', true).toggleClass('animated', true);
				$(selector + ' > .subcard').one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
					$(selector + ' > .subcard').toggleClass('animated', false);
				});

				$(selector + ' > .card').stop(true, true).toggleClass('show', false).toggleClass('hide', true).toggleClass('animated', true);
				$(selector + ' > .card').one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
					$(selector + ' > .card').toggleClass('animated', false);
				});
			}
		}

		return $(selector + ' > .card').hasClass('hide');
	} else {
		if ($(selector + ' > .subcard').hasClass('show')) {
			if (!$(selector + ' > .subcard').hasClass('animated') && !$(selector + ' > .card').hasClass('animated')) {
				$(selector + ' > .subcard').unbind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd").stop(true, true).toggleClass('animated', false);
				$(selector + ' > .card').unbind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd").stop(true, true).toggleClass('animated', false);

				$(selector + ' > .subcard').stop(true, true).toggleClass('show', false).toggleClass('hide', true).toggleClass('animated', true);
				$(selector + ' > .subcard').one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
					$(selector + ' > .subcard').toggleClass('animated', false);
				});

				$(selector + ' > .card').stop(true, true).toggleClass('hide', false).toggleClass('show', true).toggleClass('animated', true);
				$(selector + ' > .card').one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
					$(selector + ' > .card').toggleClass('animated', false);
				});
			}

			return !$(selector + ' > .subcard').hasClass('show');
		}
	}

	return false;
}

function nextSubcard(selector) {
	if ($(selector + ' > .subcard > .content_container > div.hide').length > 0) {
		$(selector + ' > .subcard > .content_container > div.hide:first').toggleClass('hide', false);
	} else {
		$(selector + ' > .subcard > .content_container > div:not(:first)').toggleClass('hide', true);
	}
}

function prevSubcard(selector) {
	if ($(selector + ' > .subcard > .content_container > div:not(.hide)').length > 1) {
		$(selector + ' > .subcard > .content_container > div:not(.hide):last').toggleClass('hide', true);
	} else {
		$(selector + ' > .subcard > .content_container > div').toggleClass('hide', false);
	}
}

function addRecvCard(card) {	
	var iteration = 0;
	var id = card._id + '_' + iteration;
	
	while ($('#card_' + id).length > 0) {
		id = id.substring(0, id.indexOf('_' + iteration));		
		id += '_' + (++iteration);		
	}

	var date = new Date(card.date);
	var title = card.text;
	var maps = card.location;
	var pictures = card.photo;
	var links = card.link;

	var diff = diffMinutes(date);
	var code;

	var subcardIndex = 0;
	var subcardCount = 0;
	if (maps && maps.length > 0)
		subcardCount += maps.length;
	if (pictures && pictures.length > 0)
		subcardCount += pictures.length;
	if (links && links.length > 0)
		subcardCount += links.length;

	var subcard = "";

	if (subcardCount > 0) {
		subcard =
			'<div class="subcard">' +
			'<div class="content_container">';
	}

	if (links && Array.isArray(links) && links.length > 0) {
		for (var i = 0, len = links.length; i < len; i++) {
			subcard += '<div style="left: ' + (subcardCount - subcardIndex) * 10 + 'px; top: ' + (subcardCount - subcardIndex) * 5 + 'px; right: ' + (subcardIndex * 10) + 'px; bottom: ' + (subcardCount - subcardIndex) * 5 + 'px" id="link_' + id + '_' + i + '" class="link"><a target="_blank" href="' + links[i].url + '">' + links[i].desc + '</a></div>';
			subcardIndex++;
		}

	}
	if (pictures && Array.isArray(pictures) && pictures.length > 0) {
		for (var i = 0, len = pictures.length; i < len; i++) {
			subcard += '<div style="left: ' + (subcardCount - subcardIndex) * 10 + 'px; top: ' + (subcardCount - subcardIndex) * 5 + 'px; right: ' + (subcardIndex * 10) + 'px; bottom: ' + (subcardCount - subcardIndex) * 5 + 'px" id="picture_' + id + '_' + i + '" class="picture"><img alt="' + pictures[i].desc + '" title="' + pictures[i].desc + '" src="' + pictures[i].path + '" /><span class="desc">' + pictures[i].desc + '</span></div>';
			subcardIndex++;
		}
	}
	if (maps && Array.isArray(maps) && maps.length > 0) {
		for (var i = 0, len = maps.length; i < len; i++) {
			subcard += '<div style="left: ' + (subcardCount - subcardIndex) * 10 + 'px; top: ' + (subcardCount - subcardIndex) * 5 + 'px; right: ' + (subcardIndex * 10) + 'px; bottom: ' + (subcardCount - subcardIndex) * 5 + 'px" class="map"><div class="gmap" id="map_' + id + '_' + i + '"></div><span class="desc">' + maps[i].desc + '</span></div>';
			subcardIndex++;
		}
	}

	if ((maps && maps.length > 0) || (pictures && pictures.length > 0) || (links && links.length > 0)) {
		subcard +=
			'</div>' +
			'<div class="arrows">' +
			'<img class="left" src="/images/left_arrow.png" />' +
			'<img class="right" src="/images/right_arrow.png" />' +
			'</div>' +
			'<div class="hide_overlay"><img src="/images/swap_button.png" /></div>' +
			'</div>';
	}

	code =
		'<div class="card_wrapper hide">' +
		'<div class="card_container" id="card_' + id + '">' +
		'<div class="card">' +
		'<div class="top_right_buttons">' +
		'<img src="/images/settings_button.png" />' +
		'<img src="/images/delete_button.png" />' +
		'</div>' +
		'<div class="when">' +
		'<div class="date">N/A</div>' +
		'<div class="time">N/A</div>' +
		'</div>' +
		'<div class="indicator_container">';

	if (diff < 0) {
		code +=
			'<img class="toolate" src="/images/toolate.png" alt="Too late!" title="Too late!" />';
	} else if (diff < 60 * 12) {
		code +=
			'<canvas class="clock"></canvas>' +
			'<div class="meridiem">N/A</div>';
	} else {
		code +=
			'<div class="calendar"></div>';
	}

	code +=
		'</div>' +
		'<div class="title">' + title + '</div>' +
		'<div class="remaining">remaining <strong>N/A</strong> time</div>' +
		'<div class="hide_overlay"><img src="/images/swap_button.png" /></div>' +
		'</div>' +
		subcard +
		'</div>' +
		'</div>';

	$('#chat_messages').append(code);

	if (maps && maps.length > 0) {
		for (var i = 0, len = maps.length; i < len; i++) {
			new GMaps({
				div: $('#map_' + id + '_' + i).get(0),
				lat: maps[i].lat,
				lng: maps[i].lng
			}).addMarker({
				lat: maps[i].lat,
				lng: maps[i].lng,
				title: maps[i].desc,
				infoWindow: {
					content: maps[i].desc
				}
			});;
		}
	}

	prepareCard('#card_' + id, date);


	var el = $('#card_' + id).parent('.card_wrapper');
	el.css('transform');
	el.toggleClass('hide', false);
	scrollToBottom();
}

function prepareCard(selector, date) {
	// selectable subcard
	$(selector + ' > .subcard > .hide_overlay').on('click', function () {
		switchCard(selector, true);
	});

	// selectable card
	$(selector + ' > .card > .hide_overlay').on('click', function () {
		switchCard(selector, false);
	});

	// left arrow
	$(selector + ' > .subcard > .arrows > .left').on('click', function () {
		nextSubcard(selector);
	});

	// right arrow
	$(selector + ' > .subcard > .arrows > .right').on('click', function () {
		prevSubcard(selector);
	});

	// clock
	if ($(selector + ' > .card > .indicator_container > .clock').length > 0) {
		$(selector + ' > .card > .indicator_container > .clock').clock(date);
		$(selector + ' > .card > .indicator_container > .meridiem').text((date.getHours() >= 12 ? 'PM' : 'AM'));
	}

	// calendar
	if ($(selector + ' > .card > .indicator_container > .calendar').length > 0) {
		$(selector + ' > .card > .indicator_container > .calendar').calendar(date);
	}

	// date
	$(selector + ' > .card > .when > .date').text(dayNames[date.getDay()] + " " + date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear());

	// time
	$(selector + ' > .card > .when > .time').text("at " + (date.getHours() > 12 ? date.getHours() - 12 : date.getHours()) + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + " " + (date.getHours() >= 12 ? 'pm' : 'am'));

	//  gesture
	var manager = new Hammer.Manager($(selector).parent('.card_wrapper').get(0));
	manager.add(new Hammer.Pan({
		domEvents: true,
		threshold: 10,
		touchAction: 'auto'
	}));

	manager.on('panleft panright', function (e) {
		if ($(e.target).is('.map') || $(e.target).parents('.map').length > 0 || $(e.target).is('.arrows > img') || $(e.target).parents('.arrows > img').length > 0) {
			manager.stop();
		} else {
			switch (e.additionalEvent) {
				case 'panleft':
					switchCard(selector, true);
					manager.stop();
					break;
				case 'panright':
					if (!switchCard(selector, false)) {
						openAside();
					}
					manager.stop();
					break;
			}
		}
	});

	updateCard(selector, date);
	setTimeout(function () {
		updateCard(selector, date);
		setInterval(function () {
			updateCard(selector, date);
		}, 60000);
	}, 1000 * (60 - (new Date()).getSeconds()));
}

function updateCard(selector, date) {
	var diffMins = diffMinutes(date);
	var emoji = '&#x';

	if (diffMins < 0) {
		emoji += '1F644';
		emoji += ';';
		$(selector + ' > .card > .remaining').html('Time travel is not implemented yet ' + emoji);
	} else {
		if (diffMins < 60) {

			if (diffMins < 15)
				emoji += '1F4A5'; // explosion
			if (diffMins < 30)
				emoji += '1F525'; // fire
			else
				emoji += '1F631'; // screaming
			emoji += ';';

			$(selector + ' > .card > .remaining').html('remaining <strong>' + diffMins + ' minutes</strong> ' + emoji);
		} else {
			var diffHours = Math.floor(diffMins / 60);
			diffMins = diffMins % 60;

			if (diffHours <= 24) {
				if (diffHours < 4)
					emoji += '1F628'; // fearful
				else if (diffHours < 6)
					emoji += '1F627'; // anguished
				else if (diffHours < 12)
					emoji += '1F61F'; // worried
				else
					emoji += '1F641'; // slightly frowning					
				emoji += ';';

				$(selector + ' > .card > .remaining').html('remaining <strong>' + diffHours + ' hours</strong> and <strong>' + diffMins % 60 + ' minutes</strong> ' + emoji);
			} else {
				var diffDays = Math.floor(diffHours / 24);
				diffHours = diffHours % 24;

				if (diffDays <= 7)
					emoji += '1F615'; // confused
				else if (diffDays < 15)
					emoji += '1F610'; // neutral
				else if (diffDays <= 31)
					emoji += '1F642'; // slightly smiling
				else if (diffDays <= 182)
					emoji += '1F601'; // grinning face
				else if (diffDays <= 365)
					emoji += '1F929'; // star eyes
				else
					emoji += '1F474';
				emoji += ';';

				$(selector + ' > .card > .remaining').html('remaining  <strong>' + diffDays + ' days</strong>, <strong>' + diffHours + ' hours</strong> and <strong>' + diffMins % 60 + ' minutes</strong> ' + emoji);
			}
		}
	}
}
