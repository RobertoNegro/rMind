/*!
	Clock 1.0.0
	license: MIT
	author: Roberto Negro (#178932 - Università degli Studi di Trento - a.a. 2017/18)
*/

var clockTWO_PI = Math.PI * 2;
var clockHALF_PI = Math.PI / 2;

function clockGetAngleFromHour(hour, minutes) {
	"use strict";
	return clockHALF_PI - (clockTWO_PI / 12) * (hour % 12) - ((clockTWO_PI / 12) / 60) * (minutes % 60);
}

function clockGetAngleFromMinutes(minutes) {
	"use strict";
	return clockHALF_PI - (clockTWO_PI / 60) * (minutes % 60);
}

function clockDraw(el, now, time) {
	var canvas = el[0];

	canvas.width = canvas.offsetWidth*2;
	canvas.height = canvas.offsetHeight*2;

	var ctx = canvas.getContext("2d");

	var padding = 0;
	var centerX = canvas.width / 2;
	var centerY = canvas.height / 2;
	var minCoord = Math.min(centerX - padding, centerY - padding);

	var externLineWidth = minCoord / 5;
	var externRadius = minCoord - externLineWidth / 2;

	var handWidth = minCoord / 7.5;
	var minuteLength = externRadius - externLineWidth;
	var hourLength = externRadius - externLineWidth * 2;

	var innerHourLineWidth = handWidth / 2;
	var innerHourRadius = hourLength;
	var innerMinuteLineWidth = handWidth / 2;
	var innerMinuteRadius = minuteLength;

	var handBaseExternRadius = minCoord / 4 - externLineWidth / 2;
	var handBaseInternRadius = minCoord / 6 - externLineWidth / 2;

	ctx.beginPath();
	ctx.lineWidth = externLineWidth;
	ctx.strokeStyle = "#c3bcbd";
	ctx.arc(centerX, centerY, externRadius, 0, 2 * Math.PI);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = innerHourLineWidth;
	ctx.strokeStyle = "#f0edee";
	ctx.arc(centerX, centerY, innerHourRadius, 0, 2 * Math.PI);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = innerMinuteLineWidth;
	ctx.strokeStyle = "#f0edee";
	ctx.arc(centerX, centerY, innerMinuteRadius, 0, 2 * Math.PI);
	ctx.stroke();

	var remainingStartAngle = 0;
	var remainingEndAngle = 0;
	
	var diffMins;
	if(time.getHours() > now.getHours() || now.getHours() === time.getHours() && time.getMinutes() >= now.getMinutes())
		diffMins = (time.getHours() - now.getHours() - 1) * 60 + time.getMinutes() + (60 - now.getMinutes());
	else
		diffMins = (time.getHours() + (24 - now.getHours()) - 1) * 60 + time.getMinutes() + (60 - now.getMinutes());
	
	if(diffMins < 60*12) {
		if (diffMins < 60) {
			// Showing minutes
			remainingStartAngle = -clockGetAngleFromMinutes(now.getMinutes());
			remainingEndAngle = -clockGetAngleFromMinutes(time.getMinutes());

			ctx.beginPath();
			ctx.lineWidth = innerMinuteLineWidth;
			ctx.lineCap = "round";
			ctx.strokeStyle = "#90323d";
			ctx.arc(centerX, centerY, innerMinuteRadius, remainingStartAngle, remainingEndAngle);
			ctx.stroke();
		} else {
			// Showing hours
			remainingStartAngle = -clockGetAngleFromHour(now.getHours(), now.getMinutes());
			remainingEndAngle = -clockGetAngleFromHour(time.getHours(), time.getMinutes());

			ctx.beginPath();
			ctx.lineWidth = innerHourLineWidth;
			ctx.lineCap = "round";
			ctx.strokeStyle = "#90323d";
			ctx.arc(centerX, centerY, innerHourRadius, remainingStartAngle, remainingEndAngle);
			ctx.stroke();
		}
	}

	ctx.beginPath();
	ctx.strokeStyle = "#c3bcbd";
	ctx.lineWidth = handWidth;
	ctx.lineCap = "round";
	ctx.moveTo(centerX, centerY);
	var minuteAngle = clockGetAngleFromMinutes(time.getMinutes());
	ctx.lineTo(centerX + Math.cos(minuteAngle) * minuteLength, centerY - Math.sin(minuteAngle) * minuteLength);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = "#c3bcbd";
	ctx.lineWidth = handWidth;
	ctx.lineCap = "round";
	ctx.moveTo(centerX, centerY);
	var hourAngle = clockGetAngleFromHour(time.getHours(), time.getMinutes());
	ctx.lineTo(centerX + Math.cos(hourAngle) * hourLength, centerY - Math.sin(hourAngle) * hourLength);
	ctx.stroke();

	ctx.beginPath();
	ctx.fillStyle = "#c3bcbd";
	ctx.arc(centerX, centerY, handBaseExternRadius, 0, clockTWO_PI);
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = "#fff";
	ctx.arc(centerX, centerY, handBaseInternRadius, 0, clockTWO_PI);
	ctx.fill();
}

jQuery.fn.extend({
	clock: function (time) {
		var el = $(this[0]);
		var now = new Date();

		clockDraw(el, now, time);

		$(window).resize(function () {
			clockDraw(el, now, time);
		});

		return this;
	}
});
