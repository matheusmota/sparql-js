var map = null;
function initialize() {
      if (GBrowserIsCompatible()) {
       map = new GMap2(document.getElementById("map_canvas"));
       map.setCenter(new GLatLng(0, 0), 2);
 	map.addControl(new GLargeMapControl());
   	map.addControl(new GMapTypeControl());    
      }
    }


//Create a new SPARQL client object that will use the Space data SPARQL endpoint 
var sparqler = new SPARQL.Service("http://proj.lis.ic.unicamp.br/sparql");
	
//Define standard prefixes. If we set them on the SPARQL client object itself, then 
//they will be reused for all queries. This means that we DON'T have to include 
//PREFIX keywords in the query
sparqler.setPrefix("dc", "http://purl.org/dc/elements/1.1/");
sparqler.setPrefix("foaf", "http://xmlns.com/foaf/0.1/");
sparqler.setPrefix("xsd", "http://www.w3.org/2001/XMLSchema#");
sparqler.setPrefix("space", "http://purl.org/net/schemas/space/");

//Do a GET request when performing the query, and request the results as JSON
sparqler.setMethod("GET")
sparqler.setOutput("json");


function fetch(formquery) {
    //creating a new query
	var queryObject = sparqler.createQuery();

	var query = formquery;

	queryObject.selectValueHashes(
	 query,
	 {
	 	failure: function() {
	 	  alert("Failed to load query");
	 	},
	 	success: function(spacecraft) {
		  $("#tableresult tbody tr").remove();
		  initialize();
		  $.each(spacecraft, function(i, result) {		
		  	$("#tableresult tbody").append("<tr>" + 
		  	  "<td>"           + result["targeturi"] + "</td>" + 
		  	  "<td>"           + result["targetlabel"]  + "</td>" + 
		  	  "<td><a href=\"" + result["placeuri"]   + "\">"   + result["placelabel"] + "</a></td>" + 
		  	  "<td>"           + result["placelabel"]    + "</td>" + 
		  	  "<td>"           + result["lat"]    + "</td>" + 
		  	  "<td>"           + result["long"]   + "</td></tr>");   	
			var img = "";
			if (result["imguri"]!= undefined)
				img = "<img src=\""+result["imguri"]+"\" width=\"80px\"/>"
			var point = new GLatLng( result["lat"],  result["long"]);
			var marker = new GMarker(point);
			GEvent.addListener(marker, "click", function() {
          		marker.openInfoWindowHtml("<b>Nome:</b> "+result["targetlabel"]+"<br/><b>Local de nascimento:</b> "+result["placelabel"]+"<br/><br/>"+img+"<br/><br/><br/><br/><br/><br/><br/><br/><br/>");});
			if ((result["lat"]!= undefined) && (result["long"]!= undefined) )				
				map.addOverlay(marker);
			
		
		  });	 	   
			
         	
	 	}
	 }
	);
}

$(document).ready( function() {
	fetch( $("#querytext").val() );
	
    $("#resultdisplay").click( function() {
    	fetch( $("#querytext").val() );
    	return false;
    });
    	
 }
);

