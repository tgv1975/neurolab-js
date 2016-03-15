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

        this.reset(size);

    }


    reset(size) {

        this.size = size;

        this.soma = [[]];

        for(var i=0; i < size; i++) {
            this.soma[i] = [];
        }

        this.trigger('afterReset', sprintf( 'Neuron reset. Size is now %(size)u.', {size: this.size}));
    }


    stimulate(coords) {

        this.active_units.push(coords)
        
        this.trigger('afterStimulation', sprintf('Neuron stimulated @ %(coords)s', {coords: coords}));

        this.process();
    }


    canStimulate(coords) {
        return this.soma[coords.x][coords.y] !== 1;
    }


    autoStimulate(coords) {

        if(! this.canStimulate(coords) ) {
            return;
        }

        this.active_units.push(coords);
        this.soma[coords.x][coords.y] = 1;
        this.trigger('afterSelfStimulation', coords.x, coords.y, 'red');
    }


    releaseActiveUnit(index) {
        this.soma[this.active_units[index].x][this.active_units[index].y] = 0;
        this.active_units.splice(index, 1);
        this.trigger('afterReleaseUnit', this.active_units[index].x, this.active_units[index].y, 'lime');
    }


    process() {

        this.pattern = this.generatePropagationPatternArray('o', 'cw');

        this.active_unit_index = 0; 
        this.cycles = 0;

        this.stepPropagate();

    }


    stepPropagate() {


        this.propagate(this.active_unit_index, this.pattern);

        this.active_unit_index++;

        if(this.active_unit_index >= this.active_units.length) {
            this.active_unit_index = 0;
        }

        if( this.active_units.length ) {
            setTimeout(this.stepPropagate(), 100);
        }

    }


    propagate(index, pattern) {
        var neighbours = this.getNeighboursByPattern( this.active_units[index], pattern );

        for(var i=0; i < neighbours.length ; i++) {
            this.autoStimulate({x: neighbours[i].x, y: neighbours[i].y});
        }

        this.releaseActiveUnit(index);
    }


    getNeighboursByPattern(origin, pattern) {

        var result = [];

        for(var i=0; i < pattern.length; i++ ) {

            var x = origin.x + pattern[i].x;
            if(x < 0 || x >= this.size ) {
                continue;
            }

            var y = origin.y + pattern[i].y;
            if(y<0 || y >= this.size) {
                continue;
            }

            result.push({x: x, y: y})
        }

        return result;
    }

    generatePropagationPatternArray(pattern_name, direction) {

        switch(pattern_name) {
            case 'o':
                return [ {x: -1, y:-1}, {x: 0, y: -1}, {x: 1, y: -1}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: -1, y: 1}, {x: -1, y: 0} ]
            break;
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