/**
* Implements a textual view of the dynamic parameters of a Neuron object.
*/

"use strict;"

var NeuronMonitorView = Backbone.View.extend({
	
	el: '#neuron_stats',

	initialize: function() {

		this.template = Handlebars.compile(this.$el.html()),

		this.listenTo(this.model, "change", this.render);

		this.listenTo(this.model, "processStart", this.onProcessStart)
		this.listenTo(this.model, "stepComplete", this.onStepComplete)
		this.listenTo(this.model, "cycleComplete", this.onCycleComplete)

		this.listenTo(this.model, "afterUnitSet", this.render);

		this.render();
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
		
	},


	render: function() {
		var snapshot = this.model.toJSON(['dynamic']);

		if( this.model.processing ) {
			_.extend(snapshot, {
						"process_start_time": this.process_start_timestring,
						"process_ongoing_timedelta": this.getProcessDurationString(),
						"steps_per_cycle": this.steps_per_cycle || 'pending...'
					});
		}
		this.$el.html(this.template(snapshot));
		return this;
	},

	
	getProcessDurationString: function() {
		var time_diff = new Date(Date.now() - this.process_start_timestamp);

		return moment(time_diff).utcOffset(0).format('HH:mm:ss:SSS');
	}

});