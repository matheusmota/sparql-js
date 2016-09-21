function RestfulResource(resource_url){
 
this.resource_url = resource_url;

this.result = null;

 
this.xmlhttp = new XMLHttpRequest();
 
/**
* Get the resource or a list of resources calling the RESTful web service with the GET http method
* @param id The id of the resource, if is null a list of resources will be retrieved.
*/
this.retrieveUris = function(queryPolygon){
    var self = this;

    this.xmlhttp.onreadystatechange=function(){
        if (self.xmlhttp.readyState==4){
            if (self.xmlhttp.status==200){
		self.onRestrieveSuccess.call(self,self.xmlhttp.responseText);	
		  
            }else{
                self.onRetrieveError.call(self,self.xmlhttp.statusText);
            }
        }
    }
    this.xmlhttp.open("POST",this.resource_url,false);
    this.xmlhttp.setRequestHeader("Content-type", "text/plain");
    this.xmlhttp.setRequestHeader("Content-length", queryPolygon.length);
    this.xmlhttp.setRequestHeader("Connection", "close");
    this.xmlhttp.send(queryPolygon);

   return this.result;
}
 
/**
* The method called when the resource is successfully updated.
*/
this.onRestrieveSuccess = function(responseText){
    this.result = responseText;
}
 
/**
* The method called when the resource can't be updated.
*/
this.onRetrieveError = function(statusText){
    alert("onError method "+statusText);
}

}
