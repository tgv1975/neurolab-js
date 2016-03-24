/**
* Implements a textual view of a Neuron object.
*/

"use strict;"

var NeuronParamsView = Backbone.View.extend({
	
	el: '#neuron_params',

	initialize: function() {

		this.template = Handlebars.compile($('#neuron_params_template').html());

		this.listenTo(this.model, "change", this.render);

		this.render();
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON(['static'])));
		return this;
	}
});