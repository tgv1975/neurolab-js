"use strict";

var neuron = new Neuron(100);

neuron.on('afterReset', function(args) {
	console.log(args);
});

var neuronMap = new NeuronMap(neuron);
var neuronCanvas;
var neuronStats;

$(document).ready( function() {
	
	neuronCanvas = new NeuronCanvas({model: neuronMap});
	neuronStats = new NeuronStats({model: neuron});

	// plotRandom();
	// function plotRandom() {
	// 		neuronCanvas.plot( neuronCanvas.coordinateToGrid((Math.random() * neuronCanvas.el.width)), 
	// 							neuronCanvas.coordinateToGrid((Math.random() * neuronCanvas.el.height)), neuronCanvas.getRandomColor() );
	// 		setTimeout( plotRandom, 0 )
	// 	}
});

