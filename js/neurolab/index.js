"use strict";

var neuron = new Neuron(100);

neuron.on('afterReset', function(args) {
	console.log(args);
});

var neuronCanvas;
var neuronStats;

$(document).ready( function() {
	
	neuronCanvas = new NeuronCanvas({model: neuron});
	neuronStats = new NeuronStats({model: neuron});

	console.time( 'perf' )

	function plotRandom() {

			neuronCanvas.plot( neuronCanvas.coordinateToGrid((Math.random() * neuronCanvas.el.width)), 
								neuronCanvas.coordinateToGrid((Math.random() * neuronCanvas.el.height)), neuronCanvas.getRandomColor() );
			//setTimeout( plotRandom, 0 )
	}

	function stimRandom() {
		neuron.stimulate( {x: Math.random() * neuron.size + 1, y: Math.random() * neuron.size + 1});
	}

	// for(var i=0; i<100000; i++) {
	// 	// plotRandom();
	// 	stimRandom();
	// }

	console.timeEnd('perf')
	});

