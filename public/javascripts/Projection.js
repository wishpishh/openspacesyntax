var Projection = (function() {
	var _width, 
		_height,
		_projection = 'mercator',
		deg2rad = function (deg) {
			return deg * Math.PI / 180;
		},
		_projections = {
			mercator: {
				lat_to_y: function(lat) {
					var latRadians = deg2rad(lat),
						mercN = Math.log(Math.tan((Math.PI / 4) + (latRadians / 2)));
	
					return (_height / 2) - (_width * mercN / (2 * Math.PI));
				},
				lon_to_x: function(lon) {
					return (_width * (180 + lon) / 360) % _width + (_width / 2);
				}
			}
		};
	
	return {
		withProjection: function(projection) {
			_projection = projection;
			
			return this;
		},
		withDimensions: function(width, height) {
			_width = width;
			_height = height;
			
			return this;
		},
		lat_to_y: function(lat) {
			return _projections[_projection].lat_to_y(lat);
		},
		lon_to_x: function(lon) {
			return _projections[_projection].lon_to_x(lon);
		}
	}
}());