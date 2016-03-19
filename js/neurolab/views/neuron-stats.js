/**
* Implements a textual view of the dynamic parameters of a Neuron object.
*/

"use strict;"

var NeuronStatsView = Backbone.View.extend({
	
	el: '#neuron_stats',

	initialize: function() {

		this.template = Handlebars.compile(this.$el.html()),

		this.listenTo(this.model, "change", this.render);
		this.listenTo(this.model, "afterUnitSet", this.render);

		this.render();
	},

	render: function() {

		var attributes = this.model.toJSON();
		var text = new Array();

		this.$el.html(this.template(this.model.toJSON()));
		// _.each( attributes, function( value, key ) {
		// 	text.push( key.toUpperCase() + ': ' + value  );
		// });

		// text = text.join('<br/>')

		// this.$el.html(text);
		return this;
	}
});