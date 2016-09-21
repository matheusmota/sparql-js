
// Create a new SPARQL client object that will use the Space data SPARQL
// endpoint
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
function fetch(teamuri) {
	// create a new query
	var queryObject = sparqler.createQuery();

	// our query selects the playerURI and birthplace
	var query = "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>"
			+ "PREFIX p: <http://dbpedia.org/property/>  "
			+ "PREFIX dbpedia-owl: <http://dbpedia.org/ontology/> "
			+ "SELECT DISTINCT ?player, ?city WHERE { " + "  <" + teamuri
			+ "> p:name ?player." + "  ?player dbpedia-owl:birthPlace ?city."
			+ " }";

	// Other teams
	// Flamengo: http://dbpedia.org/resource/Clube_de_Regatas_do_Flamengo

	// the client object has several convenience methods for manipulating the
	// SPARQL
	// results. We use selectValueHashes which returns an Array of hashes, which
	// are
	// keyed on the variables in the SELECT statement. This is does lose the
	// type
	// information of the binding, but for our purposes here, we know what to
	// expect
	queryObject.selectValueHashes(query, {
		failure : function() {
			alert("Failed to load query");
		},
		success : function(tableresult) {
			$("#tableresult tbody tr").remove();
			$.each(tableresult, function(i, result) {
				$("#tableresult tbody").append(
						"<tr>" + "<td><a href=\"" + result["player"] + "\">"
								+ result["player"] + "</a></td>"
								+ "<td><a href=\"" + result["city"] + "\">"
								+ result["city"] + "</a></td>" + "</tr>");
			});

		}
	});
}

$(document).ready(function() {
	fetch($("#uriteam").val());

	$("#resultdisplay").click(function() {
		fetch($("#uriteam").val());
		return false;
	});

});
