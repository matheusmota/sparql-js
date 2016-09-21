// make map available for easy debugging
var map;
var markers;
var marker;
// setting up markers
var size;
var offset;
var icon;

// popup config
var AutoSizeFramedCloud = OpenLayers.Class(OpenLayers.Popup.FramedCloud, {
	'autoSize' : true
});

var ll, popupClass, popupContentHTML;

// increase reload attempts
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;

function init() {
	var maxExtent = new OpenLayers.Bounds(-20037508, -20037508, 20037508,
			20037508), restrictedExtent = maxExtent.clone(), maxResolution = 156543.0339;

	var options = {
		projection : new OpenLayers.Projection("EPSG:900913"),
		displayProjection : new OpenLayers.Projection("EPSG:4326"),
		units : "m",
		numZoomLevels : 18,
		maxResolution : maxResolution,
		maxExtent : maxExtent,
		restrictedExtent : restrictedExtent
	};

	map = new OpenLayers.Map('map_canvas', options);

	// create Google Mercator layers
	var gmap = new OpenLayers.Layer.Google("Google Streets", {
		sphericalMercator : true
	});
	var gsat = new OpenLayers.Layer.Google("Google Satellite", {
		type : G_SATELLITE_MAP,
		sphericalMercator : true,
		numZoomLevels : 22
	});
	var ghyb = new OpenLayers.Layer.Google("Google Hybrid", {
		type : G_HYBRID_MAP,
		sphericalMercator : true
	});

	// create Virtual Earth layers
	var veroad = new OpenLayers.Layer.VirtualEarth("Bing Roads", {
		'type' : VEMapStyle.Road,
		sphericalMercator : true
	});
	var veaer = new OpenLayers.Layer.VirtualEarth("Bing Aerial", {
		'type' : VEMapStyle.Aerial,
		sphericalMercator : true
	});
	var vehyb = new OpenLayers.Layer.VirtualEarth("Bing Hybrid", {
		'type' : VEMapStyle.Hybrid,
		sphericalMercator : true
	});

	// create Yahoo layer
	var yahoo = new OpenLayers.Layer.Yahoo("Yahoo Street", {
		sphericalMercator : true
	});
	var yahoosat = new OpenLayers.Layer.Yahoo("Yahoo Satellite", {
		'type' : YAHOO_MAP_SAT,
		sphericalMercator : true
	});
	var yahoohyb = new OpenLayers.Layer.Yahoo("Yahoo Hybrid", {
		'type' : YAHOO_MAP_HYB,
		sphericalMercator : true
	});

	// create OSM layer
	var mapnik = new OpenLayers.Layer.OSM();

	// create WMS layer
	var wms = new OpenLayers.Layer.WMS("World Map",
			"http://world.freemap.in/tiles/", {
				'layers' : 'factbook-overlay',
				'format' : 'png'
			}, {
				'opacity' : 0.6,
				visibility : false,
				'isBaseLayer' : false,
				'wrapDateLine' : true
			});

	// create a vector layer for drawing
	var vector = new OpenLayers.Layer.Vector("Editable Vectors");

	map.addLayers([ gmap, gsat, ghyb, veroad, veaer, vehyb, yahoo, yahoosat,
			yahoohyb, mapnik, wms, vector ]);
	map.addControl(new OpenLayers.Control.LayerSwitcher());
	map.addControl(new OpenLayers.Control.EditingToolbar(vector));
	map.addControl(new OpenLayers.Control.Permalink());
	map.addControl(new OpenLayers.Control.MousePosition());
	if (!map.getCenter()) {
		map.zoomToMaxExtent();
	}

	markers = new OpenLayers.Layer.Markers("Student");
	markersT = new OpenLayers.Layer.Markers("Professor");
	// setting up markers
	size = new OpenLayers.Size(19, 28);
	offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
	icon = new OpenLayers.Icon('img/m2.png', size, offset);

	map.addLayer(markers);
	map.addLayer(markersT);
}

function addMarker(ll, popupClass, popupContentHTML, closeBox, overflow) {

	var feature = new OpenLayers.Feature(markers, ll);
	feature.closeBox = closeBox;
	feature.popupClass = popupClass;
	feature.data.popupContentHTML = popupContentHTML;
	feature.data.overflow = (overflow) ? "auto" : "hidden";
	//feature.data.icon= icon.clone();
	
	var marker = feature.createMarker();

	var markerClick = function(evt) {
		if (this.popup == null) {
			this.popup = this.createPopup(this.closeBox);
			map.addPopup(this.popup);
			this.popup.show();
		} else {
			this.popup.toggle();
		}
		currentPopup = this.popup;
		OpenLayers.Event.stop(evt);
	};
	marker.events.register("mousedown", feature, markerClick);

	markers.addMarker(marker);
}

function addMarkerT(ll, popupClass, popupContentHTML, closeBox, overflow) {

	var feature = new OpenLayers.Feature(markersT, ll);
	feature.closeBox = closeBox;
	feature.popupClass = popupClass;
	feature.data.popupContentHTML = popupContentHTML;
	feature.data.overflow = (overflow) ? "auto" : "hidden";
	feature.data.icon= icon.clone();
	
	var marker = feature.createMarker();

	var markerClick = function(evt) {
		if (this.popup == null) {
			this.popup = this.createPopup(this.closeBox);
			map.addPopup(this.popup);
			this.popup.show();
		} else {
			this.popup.toggle();
		}
		currentPopup = this.popup;
		OpenLayers.Event.stop(evt);
	};
	marker.events.register("mousedown", feature, markerClick);

	markersT.addMarker(marker);
}
