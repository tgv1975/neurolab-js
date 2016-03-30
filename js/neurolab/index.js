"use strict";

$(document).ready( function() {
	
	var neuron = new Neuron({size: 50, process_delay: 0});

	
	var neuronCanvas = new PropagatorCanvas({
											model: neuron, 
											el: '#neuron_canvas'
										});
	
	var neuronParamsView = new PropagatorParamsView({
											model: neuron,
											el: '#neuron_params',
											template_el: '#neuron_params_template'
										});
	
	var neuronMonitorView = new PropagatorMonitorView({
											model: neuron,
											el: '#neuron_monitor',
											template_el: '#neuron_monitor_template'
										});
	
	var neuronMonitorControlsView = new PropagatorMonitorControlsView({
											model: neuronMonitorView,
											el: '#neuron_monitor_controls',
											template_el: '#neuron_monitor_controls_template'});

	var neuronControlsView = new PropagatorControlsView({
											model: neuron,
											el:"#neuron_controls",
											template_el:'#neuron_controls_template'
										});

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

