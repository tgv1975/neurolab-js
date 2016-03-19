/**
* Implements a graphical neuron view, by extending CanvasGrid.
*/

"use strict;"

var NeuronCanvas = CanvasGrid.extend({

	el: '#neuron_canvas',

	zoom: 5,

	events: {
		'click': 'clickHandler',
		'mousemove': 'mouseMoveHandler'
	},

	initialize: function() {

		if(!(this.model instanceof Neuron) ) {

			throw { 
			    name: "NeuronCanvas Error", 
			    message: "NeuronMap initialized without a valid Neuron object.", 
			    toString: function(){return this.name + ": " + this.message;} 
			};

		}

		this.listenTo(this.model, "afterUnitSet", this.fillUnit);
		this.listenTo(this.model, "afterUnitRelease", this.fillUnit);

		CanvasGrid.prototype.initialize.apply(this, [this.model.size, this.model.size]);
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
		// callback triggered by Neuron.stimulate().

	},


	mouseMoveHandler: function(event) {

		var coords = this.getMousePosToTileIndex(event);
		// console.log(this.model.matrix[coords.x][coords.y]);
		CanvasGrid.prototype.mouseMoveHandler.apply(this, [event]);	

	}

});