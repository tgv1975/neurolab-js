/**
* Implements a textual view of a Neuron object.
*/

"use strict;"

var NeuronParamsView = Backbone.View.extend({
	
	el: '#neuron_stats',

	initialize: function() {

		this.template = Handlebars.compile(this.$el.html()),

		this.listenTo(this.model, "change", this.render);

		this.render();
	},

	render: function() {
		
		var attributes = this.model.toJSON();
		var text = new Array();

		this.$el.html(this.template(this.model.toJSON()));

		return this;
	}
});