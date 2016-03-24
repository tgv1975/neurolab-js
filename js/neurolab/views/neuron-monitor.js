/**
* Implements NeuronMonitorView and NeuronMonitorControlsView to use with a Neuron object.
*/

"use strict;"


/**
* Implements a view that displays dynamic Neuron parameters in real time.
* The view's model must be a Neuron object. Data is read from it on certain events.
* 
*/
var NeuronMonitorView = Backbone.View.extend({
	
	el: '#neuron_monitor',


	initialize: function() {

		this.template = Handlebars.compile($('#neuron_monitor_template').html()),

		this.listenTo(this.model, "change", this.render);

		this.attachProcessEvents();

		this.render();
	},


	attachProcessEvents: function() {
		this.listenTo(this.model, "processStart", this.onProcessStart)
		this.listenTo(this.model, "stepComplete", this.onStepComplete)
		this.listenTo(this.model, "cycleComplete", this.onCycleComplete)

		// this.listenTo(this.model, "afterUnitSet", this.render);

		this.monitoring = true;
	},


	detachProcessEvents: function() {
		this.stopListening(this.model, "processStart")
		this.stopListening(this.model, "stepComplete")
		this.stopListening(this.model, "cycleComplete")

		// this.stopListening(this.model, "afterUnitSet", this.render);

		this.monitoring = false;
	},


	onProcessStart: function () {
		this.process_start_timestamp = Date.now();
		this.process_start_timestring = new Date(this.process_start_timestamp).toLocaleString();

        this.steps_per_cycle = 0;
	},

	
	onCycleComplete: function () {
        this.steps_per_cycle = Math.trunc(this.model.steps / this.model.cycles);
	},


	onStepComplete: function() {
		this.render();
	},


	render: function() {

		var snapshot = this.model.toJSON(['dynamic']);

		if( this.model.processing ) {
			_.extend(snapshot, {
						"process_start_time": this.process_start_timestring,
						"process_ongoing_timedelta": this.getProcessDurationString(),
						"steps_per_cycle": this.steps_per_cycle || 'pending...',
						"steps_per_second": this.getStepsPerSecond() || 'pending...'
					});
		}

		this.$el.html(this.template(snapshot));

		this.rendering = false;
	},

	
	getProcessDurationString: function() {
		var time_diff = new Date(Date.now() - this.process_start_timestamp);

		return moment(time_diff).utcOffset(0).format('HH:mm:ss:SSS');
	},


	getStepsPerSecond: function() {
		var time_diff_seconds = Math.trunc((Date.now() - this.process_start_timestamp) / 1000) || 1;
		
		return Math.trunc(this.model.steps / time_diff_seconds);
	},


	monitorToggle: function(checked) {

		if(checked){
			this.attachProcessEvents();
		} else {
			this.detachProcessEvents();
		}

		this.render();

		return true;
		
	}

});


/**
* Implements a helper view that uses another view as its model! Namely, a 
* NeuronMonitorView. This is not documented, so it might be a dangerous hack.
* The goal is to be able to control the NeuronMonitorView during intensive Neuron
* processing. This functionality was initially implemented in the NeuronMonitorView,
* but click evens would not register due to fast DOM updates of that view.
*/
var NeuronMonitorControlsView = Backbone.View.extend({

	el: '#neuron_monitor_controls',

	events: {
		'switchChange.bootstrapSwitch #monitor_switch': 'monitorToggle'
	},

	initialize: function() {
		this.template = Handlebars.compile($('#neuron_monitor_controls_template').html());

		this.render();
	},


	render: function() {
		this.$el.html(this.template({monitoring: this.model.monitoring}));
		$('#monitor_switch').bootstrapSwitch({size: 'mini', onColor:'danger'});
	},


	monitorToggle: function(event) {
		return this.model.monitorToggle(event.target.checked);
	}
});