//Create a new SPARQL client object that will use the Space data SPARQL endpoint 
var sparqlerq = new SPARQL.Service(
		"http://proj.lis.ic.unicamp.br/sparql/");

// Define standard prefixes. If we set them on the SPARQL client object itself,
// then
// they will be reused for all queries. This means that we DON'T have to include
// PREFIX keywords in the query
//sparqlerq.setPrefix("dc", "http://purl.org/dc/elements/1.1/");
//sparqlerq.setPrefix("foaf", "http://xmlns.com/foaf/0.1/");
//sparqlerq.setPrefix("xsd", "http://www.w3.org/2001/XMLSchema#");
//sparqlerq.setPrefix("space", "http://purl.org/net/schemas/space/");

// Do a GET request when performing the query, and request the results as JSON
//sparqlerq.setMethod("GET")
//sparqlerq.setOutput("json");

function fetch(formquery) {
	// creating a new query
	var queryObject = sparqlerq.createQuery();

	var query = formquery;

	queryObject.selectValueHashes(query, {
		failure : function() {
			alert("Failed to load query..."+query);
		},
		success : function(spacecraft) {
			alert("OK");
			map.destroy();
			init();
			$("#tableresult tbody tr").remove();
			$.each(spacecraft, function(i, result) {
				$("#tableresult tbody").append(
						"<tr>" + "<td>" + result["targeturi"] + "</td>"
								+ "<td>" + result["targetlabel"] + "</td>"
								+ "<td><a href=\"" + result["placeuri"] + "\">"
								+ result["placelabel"] + "</a></td>" + "<td>"
								+ result["placelabel"] + "</td>" + "<td>"
								+ result["lat"] + "</td>" + "<td>"
								+ result["long"] + "</td></tr>");
				var img = "";
				if (result["imguri"] != undefined) {
					img = "<img src=\"" + result["imguri"]
							+ "\" width=\"80px\"/>";
				}
				// anchored bubble popup small contents autosize closebox
				ll = new OpenLayers.LonLat(result["long"], result["lat"])
						.transform(map.displayProjection, map.projection);
				popupClass = AutoSizeFramedCloud;

				popupContentHTML = "<b>Nome:</b> " + result["targetlabel"]
						+ "<br/><b>Local de nascimento:</b> "
						+ result["placelabel"] + "<br/><br/>" + img + "<br/>";

				if ((result["lat"] != undefined)
						&& (result["long"] != undefined)&& (result["status"] != "professor")) {
					addMarker(ll, popupClass, popupContentHTML, true);
				}
				
				if ((result["status"] == "professor")) {
					addMarkerT(ll, popupClass, popupContentHTML, true);
				}

			});

		}
	});
}

$(document).ready(function() {
	fetch($("#querytext").val());

	$("#resultdisplay").click(function() {
		fetch($("#querytext").val());
		return false;
	});

});
