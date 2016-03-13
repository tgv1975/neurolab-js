var NeuronCanvas = CanvasGrid.extend({

	el: '#neuron_canvas',

	zoom: 20,

	initialize: function(args) {

		if(!(this.model instanceof NeuronMap) ) {

			throw { 
			    name: "NeuronCanvas Error", 
			    message: "NeuronMap initialized without a valid NeuronMap object.", 
			    toString: function(){return this.name + ": " + this.message;} 
			};

		}

		CanvasGrid.prototype.initialize.apply(this, args);
	},

	// clickActiond: function(event) {

	// }

});