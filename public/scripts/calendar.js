/*!
	Calendar 1.0.0
	license: MIT
	author: Roberto Negro (#178932 - Università degli Studi di Trento - a.a. 2017/18)
*/

function monthDays(month, year) {
	var d = new Date(year, month + 1, 0);
	return d.getDate();
}

function isSameDay(date1, date2) {
	return (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate())
}

function diffSeconds(date) {
	var now = new Date();
	var diff = date - now;
	var diffSecs = Math.floor(diff / 1000);
	return diffSecs + 1;
}

function calendarDraw(el, now, time, viewMonth, viewYear) {
	var code =
		'<div class="header"><img class="arrow left" src="/images/left_arrow_white.png"/><div>' + monthNames[viewMonth] + ' ' + viewYear + '</div><img class="arrow right" src="/images/right_arrow_white.png"/></div>' +
		'<div class="day_names">';

	for (var i = 0; i < 7; i++)
		code += '<div>' + dayShortNames[i] + '</div>';
	code += '</div>';
	code += '<div class="rows">';

	code += '<div class="row">';
	var dayWeekIndex = (new Date(viewYear, viewMonth, 1)).getDay();
	for (var i = 0; i < dayWeekIndex; i++)
		code += '<div></div>';

	for (var i = 1, days = monthDays(viewMonth, viewYear); i <= days; i++) {
		var thatDay = new Date(viewYear, viewMonth, i);
		if (isSameDay(now, thatDay))
			code += '<div class="start bar_remaining">';
		else if (isSameDay(time, thatDay))
			code += '<div class="end bar_remaining">';
		else if (now < thatDay && thatDay < time)
			code += '<div class="bar_remaining">';
		else
			code += '<div>';

		code += i + '</div>';
		dayWeekIndex = (dayWeekIndex + 1) % 7;

		if (i < days && dayWeekIndex == 0)
			code += '</div><div class="row">';
	}
	if (dayWeekIndex > 0) {
		for (var i = dayWeekIndex; i < 7; i++)
			code += '<div></div>';
	}
	code += '</div>';

	code += '</div>';

	el.html(code);
}

jQuery.fn.extend({
	calendar: function (time) {
		var el = $(this[0]);
		var now = new Date();

		var month = time.getMonth();
		var year = time.getFullYear();

		calendarDraw(el, now, time, month, year);

		el.on("click", ".header > .arrow.left", function () {
			if (month > 0)
				month--;
			else {
				month = 11;
				year--;
			}
			calendarDraw(el, now, time, month, year);
		});

		el.on("click", ".header > .arrow.right", function () {
			if (month < 11)
				month++;
			else {
				month = 0;
				year++;
			}
			calendarDraw(el, now, time, month, year);
		});

		var midnight = new Date();
		midnight.setHours(24, 0, 0, 0);
		
		setTimeout(function () {
			now = new Date();
			calendarDraw(el, now, time, month, year);

			setInterval(function () {
				now = new Date();
				calendarDraw(el, now, time, month, year);
			}, 8.64e7);
		}, midnight - now);
		
		return this;
	}
});
