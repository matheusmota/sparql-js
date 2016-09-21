//Google maps definitions

var map = null;
function initialize() {
	if (GBrowserIsCompatible()) {
		map = new GMap2(document.getElementById("map_canvas"));
		map.setCenter(new GLatLng(0, 0), 2);
		map.addControl(new GLargeMapControl());
		map.addControl(new GMapTypeControl());
	}
}

// Create a new SPARQL client object that will use the Space data SPARQL
// endpoint
var sparqler = new SPARQL.Service("http://proj.lis.ic.unicamp.br/sparql");

//prefix
sparqler.setPrefix("dc", "http://purl.org/dc/elements/1.1/");
sparqler.setPrefix("foaf", "http://xmlns.com/foaf/0.1/");
sparqler.setPrefix("xsd", "http://www.w3.org/2001/XMLSchema#");
sparqler.setPrefix("space", "http://purl.org/net/schemas/space/");

// Do a GET request when performing the query, and request the results as JSON
sparqler.setMethod("GET");
sparqler.setOutput("json");

function fetch(teamuri) {
	// create a new query
	var queryObject = sparqler.createQuery();


	var query = "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>"
			+ "PREFIX p: <http://dbpedia.org/property/>  "
			+ "PREFIX dbpedia-owl: <http://dbpedia.org/ontology/> "
			+ "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
			+ "SELECT DISTINCT ?player, ?labelplayer, ?labelcity, ?dob, ?city, ?long, ?lat WHERE { "
			+ "  <"+teamuri+"> p:name ?player."
			+ "  ?player foaf:name ?labelplayer;"
			+ "  dbpedia-owl:birthDate ?dob;"
			+ "  dbpedia-owl:birthPlace ?city." 			
			+ "  ?city foaf:name ?labelcity;" 
			+ "  geo:long ?long;"
			+ "  geo:lat  ?lat." 
			+ " }GROUP BY ?player ORDER BY ?labelplayer";

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
		  			"<td><a href=\"" + result["labelplayer"] + "\">"  + result["labelplayer"]  + "</a></td>" +					  		
		  			"<td><a href=\"" + result["dob"]   + "\">" + result["dob"]   + "</a></td>" + 
		  			"<td><a href=\"" + result["city"]   + "\">" + result["city"]   + "</a></td>" + 
		  			"<td><a href=\"" + result["labelcity"]   + "\">" + result["labelcity"]   + "</a></td>" + 
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

