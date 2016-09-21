//Create a new SPARQL client object that will use the Space data SPARQL endpoint 
var sparqler = new SPARQL.Service("http://api.talis.com/stores/space/services/sparql");
	
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

//This does the actual work 
function fetch_spacecraft(year) {
    //create a new query
	var queryObject = sparqler.createQuery();

	//our query selects the name, description, homepage, image, and launch date of 
	//all spacecraft launched in 1969. Sorting them based on their launch date	
	var query = "SELECT ?name ?desc ?homepage ?image ?date " +  
	" WHERE {   " +
	"   ?craft a space:Spacecraft;	" +
	"      space:launch ?launch;   " +
    "      foaf:name ?name;   " +
	"      dc:description ?desc;   " +
	"      foaf:homepage ?homepage.  " +
	"  OPTIONAL {  " +
	"     ?craft foaf:depiction ?image.  " +
	"   }  " +
	"  ?launch space:launched ?date.  " +
	"  FILTER ( ?date > \"" + year + "-01-01\"^^xsd:date && ?date < \"" + (parseInt(year) + 1) + "-01-01\"^^xsd:date )   " +	
	"  } ORDER BY ?date	";

	//the client object has several convenience methods for manipulating the SPARQL
	//results. We use selectValueHashes which returns an Array of hashes, which are 
	//keyed on the variables in the SELECT statement. This is does lose the type 
	//information of the binding, but for our purposes here, we know what to expect
	queryObject.selectValueHashes(
	 query,
	 {
	 	failure: function() {
	 	  alert("Failed to load spacecraft")
	 	},
	 	success: function(spacecraft) {
		  $("#spacecraft tbody tr").remove();
		  $.each(spacecraft, function(i, result) {		
		  	$("#spacecraft tbody").append("<tr><td>" + 
		  	  "<a href=\"" + result["homepage"] + "\">" + result["name"] + "</a></td>" + 
		  	  "<td>" + result["desc"] + "</td>" + 
		  	  "<td>" + (result["image"] != null ? "<img src=\"" + result["image"] + "\" />" : "&nbsp;" ) + "</td>" + 
		  	  "<td>" + result["date"] + "</td></tr>"); 
		  });		 	   
	 	
	 	}
	 }
	);
}

$(document).ready( function() {
	fetch_spacecraft( $("#year").val() );
	
    $("#display").click( function() {
    	fetch_spacecraft( $("#year").val() )
    	return false;
    });
    	
 }
);

