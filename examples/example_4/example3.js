	var map = null;
function initialize() {
	if (GBrowserIsCompatible()) {
		map = new GMap2(document.getElementById("map_canvas"));
		map.setCenter(new GLatLng(0, 0), 2);
		map.addControl(new GLargeMapControl());
		map.addControl(new GMapTypeControl());
		var bounds = map.getBounds();
		var southWest = bounds.getSouthWest();
		var northEast = bounds.getNorthEast();
		var lngSpan = northEast.lng() - southWest.lng();
		var latSpan = northEast.lat() - southWest.lat();

	}
}

// Create a new SPARQL client object that will use the Space data SPARQL
var sparqler = new SPARQL.Service("http://proj.lis.ic.unicamp.br/sparql");

// Define standard prefixes. If we set them on the SPARQL client object itself,
// then
// they will be reused for all queries. This means that we DON'T have to include
// PREFIX keywords in the query
sparqler.setPrefix("dc", "http://purl.org/dc/elements/1.1/");
sparqler.setPrefix("foaf", "http://xmlns.com/foaf/0.1/");
sparqler.setPrefix("xsd", "http://www.w3.org/2001/XMLSchema#");
sparqler.setPrefix("space", "http://purl.org/net/schemas/space/");

// Do a GET request when performing the query, and request the results as JSON
sparqler.setMethod("GET");
sparqler.setOutput("json");

// This does the actual work
function fetch() {
	// create a new query
	var queryObject = sparqler.createQuery();


	var query = "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>"
			+ "PREFIX p: <http://dbpedia.org/property/>  "
			+ "PREFIX dbpedia-owl: <http://dbpedia.org/ontology/> "
			+ "SELECT ?city, ?long, ?lat WHERE { "
			+ "  <http://dbpedia.org/resource/Arsenal_F.C.> p:name ?player."
			+ "  ?player dbpedia-owl:birthPlace ?city;"
			+ "  dbpedia-owl:birthDate ?dob." + "  ?city geo:long ?long;"
			+ "  geo:lat ?lat." + " }";

	queryObject.selectValueHashes(
			 query,
			 {
			 	failure: function() {
			 	  alert("Failed to load query");
			 	},
			 	success: function(tableresult) {
				  $("#tableresult tbody tr").remove();
				  $.each(tableresult, function(i, result) {		
				  	$("#tableresult tbody").append("<tr>" + 
			  		"<td><a href=\"" + result["player"] + "\">" + result["player"] + "</a></td>" + 
					"<td><a href=\"" + result["city"]   + "\">" + result["city"]   + "</a></td>" + 
					"<td><a href=\"" + result["lat"]    + "\">" + result["lat"]    + "</a></td>" + 
					"<td><a href=\"" + result["long"]   + "\">" + result["long"]   + "</a></td>" + 
					"</tr>"); 
				var point = new GLatLng(result["lat"], result["long"]);
				map.addOverlay(new GMarker(point));

			});

		}
	});
}

$(document).ready( function() {
	fetch( $("#uriteam").val() );
	
    $("#resultdisplay").click( function() {
    	fetch( $("#uriteam").val() );
    	return false;
    });
    	
 }
);

