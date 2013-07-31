var Renderer = function(container, map) {
	this._scale = map.getScale();
	this._map = map;
	this._calculateOffsets();
	this.two = new Two({ width: map.width, height: map.height }).appendTo(container);
};

Renderer.prototype.update = function() {
	this.two.update();
};

Renderer.prototype.renderFeature = function(feature) {
	var featureGroup;
	
	if (feature.properties.building === "yes") {
		featureGroup = this._renderPolygon(feature.geometry.coordinates, false);
		featureGroup.fill = "#999";
		featureGroup.stroke = "#666";
	} else if (feature.properties.highway && feature.properties.highway !== "service") {
		featureGroup = this._renderLineString(feature.geometry.coordinates);
		
		if (feature.properties.highway === "footway") {
			featureGroup.stroke = "#88bb88";
			featureGroup.linewidth = 2;
		} else {
			featureGroup.linewidth = 3;
		}
	}
	
	return featureGroup;
};

Renderer.prototype._renderPolygon = function(coords, open) {
	var polygons = [],
		renderer = this;
	
	$.each(coords, function(i, subcoords) {	
		var polygonArgs = [];
		
		$.each(subcoords, function(j, subcoord) {
			polygonArgs.push((Projection.lon_to_x(subcoord[0]) - renderer._offsetX) * renderer._scale);
			polygonArgs.push((Projection.lat_to_y(subcoord[1]) - renderer._offsetY) * renderer._scale);
		});	
		
		polygonArgs.push(open);
		
		polygons.push(renderer.two.makePolygon.apply(renderer.two, polygonArgs));
	});
	
	return this.two.makeGroup.apply(this.two, polygons);
};
	
Renderer.prototype._renderLineString = function(coords) {
	var polygonArgs = [],
		renderer = this,
		polygon;
		
	$.each(coords, function(i, coord) {	
		polygonArgs.push((Projection.lon_to_x(coord[0]) - renderer._offsetX) * renderer._scale);
		polygonArgs.push((Projection.lat_to_y(coord[1]) - renderer._offsetY) * renderer._scale);
	});	

	polygonArgs.push(true);
	
	polygon = this.two.makePolygon.apply(renderer.two, polygonArgs);
	polygon.noFill();
	
	return polygon;
};

Renderer.prototype._calculateOffsets = function() {
	this._offsetX = Projection.lon_to_x(this._map.bbox[0])
	this._offsetY = Projection.lat_to_y(this._map.bbox[3]);
};