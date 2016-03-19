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

class SomaUnit {


        constructor(status) {
            this.status = status;
        }

}


class Neuron {


    constructor(size) {       

    	this.attachEvents();

        this.depolarizer = new Depolarizer();

        this.reset(size);

    }


    reset(size) {

        this.size = size;

        this.soma = [[]];

        for(var i=0; i < size; i++) {
            this.soma[i] = [];
        }

        this.active_units = [];

        this.trigger('afterReset', sprintf( 'Neuron reset. Size is now %(size)u.', {size: this.size}));
    }


    canStimulate(coords) {
        if(typeof this.soma[coords.x][coords.y] === 'undefined') {
            return true;
        }
        return this.soma[coords.x][coords.y]['status'] === 0;
    }


    stimulate(coords) {

        if(! this.canStimulate(coords) ) {
            return;
        }

        this.active_units.push(coords);
        this.soma[coords.x][coords.y] = new SomaUnit(1);

        this.trigger('afterStimulation', coords.x, coords.y, 'red');

        this.process();
    }


    releaseActiveUnit(index) {
        var coords = {x: this.active_units[index].x, y: this.active_units[index].y}

        this.soma[coords.x][coords.y]['status'] = 0;
        this.active_units.splice(index, 1);

        this.trigger('afterReleaseUnit', coords.x, coords.y, 'lime');
    }


    process() {

        if( this.processing ) {
            return;
        }

        this.processing = true;

        this.pattern = this.generatePropagationPatternArray('o', 'cw');

        this.active_unit_index = 0; 
        this.cycles = 0;

        this.step();

    }


    step() {

        this.propagate(this.active_unit_index, this.pattern);

        this.active_unit_index++;

        if(this.active_unit_index >= this.active_units.length) {
            this.active_unit_index = 0;
        }

        if(this.active_units.length) {
            setTimeout( this.step.bind(this) , 0);
        } else {
            this.processing = false;
        }

    }


    propagate(index, pattern) {
        var neighbours = this.getNeighbours( this.active_units[index], pattern );

        this.releaseActiveUnit(index);

        for(var i=0; i < neighbours.length ; i++) {
            this.stimulate({x: neighbours[i].x, y: neighbours[i].y});
        }

    }


    getNeighbours(origin, pattern) {

        var result = [];

        for(var i=0; i < pattern.length; i++ ) {

            var x = origin.x + pattern[i].x;
            if(x < 0 || x >= this.size ) {
                continue;
            }

            var y = origin.y + pattern[i].y;
            if(y < 0 || y >= this.size) {
                continue;
            }

            result.push({x: x, y: y})
        }

        return result;
    }


    generatePropagationPatternArray(pattern_name, direction) {

        var pattern = [];

        switch(pattern_name) {
            case 'o':
                pattern = [ {x: -1, y:-1}, 
                            {x: 0, y: -1}, 
                            {x: 1, y: -1}, 
                            {x: 1, y: 0}, 
                            {x: 1, y: 1}, 
                            {x: 0, y: 1}, 
                            {x: -1, y: 1}, 
                            {x: -1, y: 0} ]
            break;
        }

        switch(direction) {
            case 'cw':
                // Do nothing. Patterns are expecetd to be defined clocwise starting
                // from top-left.

            break;

            case 'ccw':
                pattern.reverse();
            break;
        }

        return pattern;
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