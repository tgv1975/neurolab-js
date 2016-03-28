/**
* Implements PropagatorControlsView.
*/

/**
* Provides the UI for controlling a Propagator model.
*/

"use strict";

var PropagatorControlsView = Backbone.View.extend({

	events: {
		'click #propagator_pause_btn': 'pausePropagator',
		'click #propagator_play_btn': 'playPropagator',
		'click #propagator_reset_btn': 'resetPropagator'
	},


	initialize: function(args) {

		this.$template_el = $(args.template_el);

		this.template = Handlebars.compile(this.$template_el.html(), {noEscape: true});
		this.render();

		this.listenTo(this.model, "processStart", this.render);
		this.listenTo(this.model, "processStop", this.render);
	},


	render: function() {

		var data = {
					'processing': this.model.processing
			};

		this.$el.html(this.template(data));
	},


	pausePropagator: function() {
		this.model.stopProcessing();
	},


	playPropagator: function() {
		this.model.resume();
	},


	resetPropagator: function() {
		this.model.reset(this.model.size);
	}
});