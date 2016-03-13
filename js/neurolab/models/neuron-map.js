var NeuronMap = Backbone.Model.extend({

	initialize: function(neuron) {

		if(!( neuron instanceof Neuron )) {

			throw { 
			    name: "NeuronMap Error", 
			    message: "NeuronMap initialized without a valid neuron object.", 
			    toString: function(){return this.name + ": " + this.message;} 
			};

		}

		this.neuron = neuron;

		this.size = neuron.size;
	}



});