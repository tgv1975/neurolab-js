/**
* Implements a graphical neuron view, by extending CanvasGrid.
*/

var NeuronCanvas = CanvasGrid.extend({

	el: '#neuron_canvas',

	zoom: 20,

	events: {
		'click': 'clickHandler'
	},

	initialize: function() {

		if(!(this.model instanceof Neuron) ) {

			throw { 
			    name: "NeuronCanvas Error", 
			    message: "NeuronMap initialized without a valid Neuron object.", 
			    toString: function(){return this.name + ": " + this.message;} 
			};

		}

		CanvasGrid.prototype.initialize.apply(this, [this.model.size, this.model.size]);
	},


	clickHandler: function(event) {
		
		var coords= this.getMousePosToTileIndex(event);
		
		this.model.stimulate(coords);

		CanvasGrid.prototype.clickHandler.apply(this, [event]);
	}


});