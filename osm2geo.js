module.exports = function(xml){
	// Initialize the empty GeoJSON object
	var geo = {
		"type" : "FeatureCollection",
		"features" : []
	};
	
	// setting the bounding box [minX,minY,maxX,maxY]; x -> long, y -> lat
	function getBounds(bounds){
	    var bbox = [];
	
	    bbox.push(parseFloat(bounds.attrib["minlon"]));
	    bbox.push(parseFloat(bounds.attrib["minlat"]));
	    bbox.push(parseFloat(bounds.attrib["maxlon"]));
	    bbox.push(parseFloat(bounds.attrib["maxlat"]));
	
	    return bbox;
	}
	
	geo["bbox"] = getBounds(xml.find("bounds"));
	
	// Function to set props for a feature
	function setProps(element){
	    var properties = {};
	    var tags = element.findall("tag");
	
	    tags.forEach(function(tag, index){
	        properties[tag.attrib["k"]] = tag.attrib["v"];
	    });
	
	    return properties;
	}
	// Generic function to create a feature of given type
	function getFeature(element, type){
	    return {
	        "geometry" : {
	            "type" : type,
	            "coordinates" : []
	        },
	        "type" : "Feature",
	        "properties" : setProps(element)
	    };
	}
	
	// Ways
	var ways = xml.findall('way');
	
	ways.forEach(function(ele, index){
	    var feature = {};
		var isHighway = ele.find("tag[@k='highway']");
		
		if (false && !isHighway) {
			return;
		}
	
	    // List all the nodes
	    var nodes = ele.findall("nd");
	
	    // If first and last nd are same, then its a polygon
	    if(nodes[nodes.length-1].attrib["ref"] === nodes[0].attrib["ref"]){
	        feature = getFeature(ele, "Polygon");
	        feature.geometry.coordinates.push([]);
	    } else {
	        feature = getFeature(ele, "LineString");
	    }
	
	    nodes.forEach(function(nd, index){
	        var node = xml.find("node[@id='"+ nd.attrib["ref"] + "']"); // find the node with id ref'ed in way
	        var cords = [parseFloat(node.attrib["lon"]), parseFloat(node.attrib["lat"])]; // get the lat,lon of the node
	
	        // If polygon push it inside the cords[[]]
	        if(feature.geometry.type === "Polygon"){
	            feature.geometry.coordinates[0].push(cords);
	        }// if just Line push inside cords[]
	        else {
	            feature.geometry.coordinates.push(cords);
	        }
	    });
	   // Save the LineString in the Main object
	    geo.features.push(feature);
	});
	
	// Finally return the GeoJSON object
	return geo;
	
};
