var Map = function(options) {
	options = options || {};
	this.width = options.width || 800;
	this.height = options.height || 800;
	this.features = [];
	this.bbox = options.bbox || [];
	this._renderer = new Renderer(options.container, this);
};

Map.prototype.getScale = function() {
	var x_max = Projection.withDimensions(this.width, this.height).lon_to_x(this.bbox[2]);
	var x_min = Projection.withDimensions(this.width, this.height).lon_to_x(this.bbox[0]);
	
	return this.width / (x_max - x_min);
};

Map.prototype.addFeature = function(feature) {
	this._renderer.renderFeature(feature);
	this._renderer.update();
	
	this.features.push(feature);
};