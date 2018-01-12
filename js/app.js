var map;

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
	// Create a styles array to use with the map.
	var styles = [
		{
			"featureType": "landscape",
			"stylers": [
				{ "hue": "#FFBB00" },
				{ "saturation": 43.400000000000006 },
				{ "lightness": 37.599999999999994 },
				{ "gamma": 1 }
			]
		},{
			"featureType": "road.highway",
			"stylers": [
				{ "hue": "#FFC200" },
				{ "saturation": -61.8 },
				{ "lightness": 45.599999999999994 },
				{ "gamma": 1 }
			]
		},{
			"featureType": "road.arterial",
			"stylers": [
				{ "hue": "#FF0300" },
				{ "saturation": -100 },
				{ "lightness": 51.19999999999999 },
				{ "gamma": 1 }
			]
		},{
			"featureType": "road.local",
			"stylers": [
				{ "hue": "#FF0300" },
				{ "saturation": -100 },
				{ "lightness": 52 },
				{ "gamma": 1 }
			]
		},{
			"featureType": "water",
			"stylers": [
				{ "hue": "#0078FF" },
				{ "saturation": -13.200000000000003 },
				{ "lightness": 2.4000000000000057 },
				{ "gamma": 1 }
			]
		},{
			"featureType": "poi",
			"stylers": [
				{ "hue": "#00FF6A" },
				{ "saturation": -1.0989010989011234 },
				{ "lightness": 11.200000000000017 },
				{ "gamma": 1 }
			]
		}
	];

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -27.9018204, lng: 153.2858236}, //Oxenford, Gold Coast
		zoom: 13,
		styles: styles
	});

	var locations = [
		{title: 'Wet n Wild', location: {lat: -27.914749, lng: 153.317572}},
		{title: 'Movie World', location: {lat: -27.906957, lng: 153.313110}},
		{title: 'GC Wake Park', location: {lat: -27.908031, lng: 153.287837}},
		{title: 'Bunnings Warehouse', location: {lat: -27.887473, lng: 153.312111}},
		{title: 'Hungry Jacks', location: {lat: -27.885783, lng: 153.313592}},
		{title: 'Oxenford State School', location: {lat: -27.900576, lng: 153.303882}},
		{title: 'Paradise Country', location: {lat: -27.911796, lng: 153.305836}},
		{title: 'JB Hi-Fi Helensvale', location: {lat: -27.888413, lng: 153.317492}},
		{title: 'Kmart Oxenford', location: {lat: -27.889043, lng: 153.310864}}
	];

	var largeInfowindow = new google.maps.InfoWindow();

	// Style the markers a bit. This will be our listing marker icon.
	var defaultIcon = makeMarkerIcon('e20000');

	// Create a "highlighted location" marker color for when the user
	// mouses over the marker.
	var highlightedIcon = makeMarkerIcon('90ee90');

	// The following group uses the location array to create an array of markers on initialize.
	for(var i = 0; i < locations.length; i++) {
		// Get the position from the location array.
		var position = locations[i].location;
		var title = locations[i].title;

		// Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon,
			id: i
		});

		// Push the marker to our array of markers.
		markers.push(marker);

		// Create an onclick event to open the large infowindow at each marker.
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
			toggleBounce(this);
		});

		// Two event listeners - one for mouseover, one for mouseout,
		// to change the colors back and forth.
		marker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon);
		});
		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});
	}

	document.getElementById('show-listings').addEventListener('click', showListings);
	document.getElementById('hide-listings').addEventListener('click', hideListings);

	//show listings by default on load
	showListings();
}

// This function will loop through the markers array and display them all.
function showListings() {
	var bounds = new google.maps.LatLngBounds();
	// Extend the boundaries of the map for each marker and display the marker
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
		bounds.extend(markers[i].position);
	}
	map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideListings() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
	new google.maps.Size(21, 34),
	new google.maps.Point(0, 0),
	new google.maps.Point(10, 34),
	new google.maps.Size(21,34));

	return markerImage;
}

// from: https://developers.google.com/maps/documentation/javascript/examples/marker-animations
function toggleBounce(marker) {
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function(){ marker.setAnimation(null); }, 1445); //stops the bouncing animations after 2 bounces
	}
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
		// Clear the infowindow content to give the streetview time to load.
		infowindow.setContent('');
		infowindow.marker = marker;

		infowindow.marker.setIcon(makeMarkerIcon('008000'));


		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
		});

		//Foursquare API
		function findCoffee(latitude, longitude){
			$.ajax({
				type: 'GET',
				dataType: 'jsonp',
				cache: false,
				url: 'https://api.foursquare.com/v2/venues/explore?ll=' + latitude + ',' + longitude + '&query=coffee&radius=1000&limit=1&client_id=IER1UZ4E4VMW4HEDCAYZZVW5KKJL435CNZ4DG40ZAL5FTVJE&client_secret=45A53UZBMB2NEH5FPOZHLZFAKN2GHDJBFHX4DXVRU02O1X22&v=20180110'
			}).done(function(data){
				if(data && data.response && data.response.groups.length > 0 && data.response.groups[0].items.length > 0){
					var name = data.response.groups[0].items[0].venue.name;
					infowindow.setContent('<div class="infowindow-title">' + marker.title + '</div>' + '<div>Closest coffee is at:<br/><em>' + name + '</em></div>');
				} else {
					infowindow.setContent('<div class="infowindow-title">' + marker.title + '</div>' + '<div>Sorry, no coffee within 1km of you :(</div>');
				}
			}).fail(function(err){
				alert(err);
			});
		}

		//use FourSquare to find the closest Coffee shop within 1km of the markers position
		findCoffee(marker.position.lat(), marker.position.lng());

		// Open the infowindow on the correct marker.
		infowindow.open(map, marker);
	}
}

//code to execute after the DOMs loaded
$(document).ready(function() {

	//hide the menu by default if the screens too small
	if($(window).width() <= 1024) {
		$('body').toggleClass('menu-hidden');
	}

	//hamburger menu functionality
	$(".menu-icon-link").on('click', function(e){
		e.preventDefault();
		$('body').toggleClass('menu-hidden');
	});

});