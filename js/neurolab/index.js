"use strict";

$(document).ready( function() {
	
	var neuron = new Neuron(100);

	var neuronCanvas = new NeuronCanvas({model: neuron});
	var neuronParamsView = new NeuronParamsView({model: neuron});
	var neuronMonitorView = new NeuronMonitorView({model: neuron});
	var neuronMonitorControlsView = new NeuronMonitorControlsView({model: neuronMonitorView});
	var neuronControlsView = new PropagatorControlsView({el:"#neuron_controls", template_el:'#neuron_controls_template', model: neuron});

	// console.time( 'perf' )

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

	// console.timeEnd('perf')
	});

