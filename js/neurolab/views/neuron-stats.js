/**
* Implements a textual view of a Neuron object.
*/

"use strict;"

var NeuronStats = Backbone.View.extend({
	
	el: '#neuron_stats',

	initialize: function() {

		this.listenTo(this.model, "change", this.render);
		this.listenTo(this.model, "afterStimulation", this.render);
		this.listenTo(this.model, "afterSelfStimulation", this.render);

		this.render();
	},

	render: function() {

		var attributes = this.model.toJSON();
		var text = new Array();

		_.each( attributes, function( value, key ) {
			text.push( key.toUpperCase() + ': ' + value  );
		});

		text = text.join('<br/>')

		this.$el.html(text);
		return this;
	}
});