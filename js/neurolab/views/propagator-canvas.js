/**
* Implements a graphical Propagator view by extending CanvasGrid.
*/

"use strict;"

var PropagatorCanvas = CanvasGrid.extend({

	zoom: 3,

	events: {
		'click': 'clickHandler',
		'mousemove': 'mouseMoveHandler'
	},


	initialize: function() {

		if(!(this.model instanceof Propagator) ) {

			throw { 
			    name: "PropagatorCanvas Error", 
			    message: "PropagarorCanvas initialized without a valid Propagator object.", 
			    toString: function(){return this.name + ": " + this.message;} 
			};

		}

		this.listenTo(this.model, "afterUnitSet", this.fillUnit);
		this.listenTo(this.model, "afterUnitRelease", this.fillUnit);
		this.listenTo(this.model, "afterReset", this.resize);

		CanvasGrid.prototype.initialize.apply(this, [this.model.width, this.model.height]);
	},


	fillUnit: function(x, y, unit) {
		switch(unit.status){
			case 0:
				this.plotByTile(x, y, 'lime');
			break;

			case 1:
				this.plotByTile(x, y, 'red');
			break;
		}
	},


	clickHandler: function(event) {
		
		var coords= this.getMousePosToTileIndex(event);
		
		this.model.set(coords);

		// DO NOT call parent method here, the drawing will be handled in the
		// callback triggered by Propagator.set().

	},


	mouseMoveHandler: function(event) {

		var coords = this.getMousePosToTileIndex(event);
		CanvasGrid.prototype.mouseMoveHandler.apply(this, [event]);	

	}

});