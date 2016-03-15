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

		this.listenTo(this.model, "afterSelfStimulation", this.plotByTile);
		this.listenTo(this.model, "afterReleaseUnit", this.plotByTile);

		CanvasGrid.prototype.initialize.apply(this, [this.model.size, this.model.size]);
	},


	clickHandler: function(event) {
		
		var coords= this.getMousePosToTileIndex(event);
		
		this.model.stimulate(coords);

		CanvasGrid.prototype.clickHandler.apply(this, [event]);
	},


	mouseMoveHandler: function(event) {

		var coords = this.getMousePosToTileIndex(event);
		CanvasGrid.prototype.mouseMoveHandler.apply(this, [event]);	

	}

});