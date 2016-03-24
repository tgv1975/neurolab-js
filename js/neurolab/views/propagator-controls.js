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
		'click #propagator_play_btn': 'playPropagator'
	},


	initialize: function(args) {
		this.template = Handlebars.compile($(args.template_el).html(), {noEscape: true});
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
	}

});