/**
* Implements the Neuron class.
* Dependecies:
*   - backbone.js
*   - underscore.js 
*/

"use strict";

class Depolarizer {


	constructor() {

	}

}

class Neuron {


    constructor(size) {       

    	this.attachEvents();

        this.active_units = []

        this.depolarizer = new Depolarizer();

        this.size = size;
        this.reset( size );

    }


    reset(size) {

        this.soma = new Array(size, size);

        this.trigger('afterReset', sprintf( 'Neuron reset. Size is now %(size)u.', {size: this.size}));
    }


    stimulate(coords) {

        this.active_units.push(coords)
        
        this.trigger('afterStimulation', sprintf('Neuron stimulated @ %(coords)s', {coords: coords}));

        this.propagate();
    }


    propagate() {
        // TODO: this is a mere sketch; tear down, refactor.
        for(var i=0; i < this.size; i++) {
            this.active_units.push({x: this.active_units[i].x + 1, y: this.active_units[i].y + 1});
            this.trigger('afterStimulation', sprintf('Neuron stimulated @ %(coords)s', {coords: this.active_units[i]}));
        }

    }

    toJSON() {

        return {
            "size": this.size,
            "unit_count": this.size * this.size,
            "active_units": this.active_units.length || 0
        }        
    }


    attachEvents() {

    	_.extend(this, Backbone.Events);

    }

}