var GOOGLE_GEOCODING_KEY = "AIzaSyAlJ4pyXibSAQA_W1BboAeYIMMMGvrculo";
var GOOGLE_GEOCODING_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

function getCoordsFromAddress(address, callback) {
	$.getJSON(GOOGLE_GEOCODING_URL, {
		address: address,
		key: GOOGLE_GEOCODING_KEY
	}).done(function (data) {		
		callback(null, {
			lat: data.results[0].geometry.location.lat,
			lng: data.results[0].geometry.location.lng,
			desc: data.results[0].formatted_address
		});
	}).fail(function (jqxhr, textStatus, error) {
		callback("Request Failed: " + textStatus, null);
	});
}

function getAddressFromCoords(lat, lng) {
	var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=" + GOOGLE_GEOCODING_KEY;
	$.getJSON(url, function (data, textStatus) {
		return data.results[0].formatted_address;
	});
}
