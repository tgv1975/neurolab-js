/**
* Implements the Propagator class.
*/

"use strict";

class Depolarizer {


	constructor() {

	}

}

class PropagatorUnit {


        constructor(status) {
            this.status = status;
            this.engine = new Depolarizer();
        }

}


/**
Implements a matrix of elements that can "propagate" from unit to unit.
When one of its element is set, the Propagator attempts to set its neighbouring 
elements, too, according to certain rules, until the entire matrix gets filled: 
This is the propagation process.
*/
class Propagator {


    /**
    * @constructor
    * @param {integer} size - The size of the matrix.
    */
    constructor(args) {       

        this.process_delay = args.process_delay || 0;

    	this.attachEvents();
        this.reset(args.size);

    }


    /**
    * Creates the actual matrix (bidimensional) array.
    * @param {integer} size - The size of the matrix.
    */    
    reset(size) {

        this.stopProcessing();

        this.size = size;

        this.active_units = [];
        this.active_unit_index = 0;
        this.steps = 0;
        this.cycles = 0;        

        this.initMatrix();

        this.unit_count = this.size * this.size;

        this.trigger('afterReset', this.size, this.size);
    }


    /*
    * Initializes the propagator matrix.
    */
    initMatrix() {

        this.matrix = [[]];

        for(var i=0; i < this.size; i++) {
            this.matrix[i] = [];
        }

    }


    /**
    * Check if the matrix cell at given coordinates can be set.
    * @param {object} coords - A set of coordinates like {x: left, y: top}.
    * @return {boolean} True of unit can be set, false otherwise.
    */
    canSet(coords) {
        if(typeof this.matrix[coords.x][coords.y] === 'undefined') {
            return true;
        }
        return this.matrix[coords.x][coords.y]['status'] === 0;
    }


    /**
    * Sets the unit at given coordinates on the matrix.
    * @param {object} coords - A set of coordinates like {x: left, y: top}.
    */
    set(coords) {

        if(! this.canSet(coords) ) {
            return;
        }

        this.active_units.push(coords);
        this.matrix[coords.x][coords.y] = new PropagatorUnit(1);

        this.trigger('afterUnitSet', coords.x, coords.y, this.matrix[coords.x][coords.y]);

        this.process();
    }


    /**
    * Releases an active unit from the dynamic active unit array, and sets the
    * corresponding matrix unit status accordingly.
    */
    releaseActiveUnit(index) {
        var coords = {x: this.active_units[index].x, y: this.active_units[index].y}

        this.matrix[coords.x][coords.y]['status'] = 0;
        this.active_units.splice(index, 1);

        this.trigger('afterUnitRelease', coords.x, coords.y, this.matrix[coords.x][coords.y]);
    }


    /**
    * Initiates propagation process.
    */
    process() {

        if(this.processing || !this.active_units.length) {
            return;
        }

        this.processing = true;

        this.pattern = this.generatePropagationPatternArray('o', 'cw');

        this.active_unit_index = 0;
        this.steps = 0;
        this.cycles = 0;

        this.trigger('processStart');

        this.step();

    }

    /**
    *   Resumes the propagation process. Same as process(), but it does not reset 
    * the active unit index, step, and cycle counters, etc.
    */
    resume() {
        if(this.processing || !this.active_units.length) {
            return;
        }

        this.processing = true;

        this.pattern = this.generatePropagationPatternArray('o', 'cw');

        this.trigger('processStart');

        this.step();
    }


    /**
    * Executes one step of the propagation process:
    *   1. Propagate unit at active_unit_index in the active units array.
    *   2. Increment the active_unit_index to select the next active unit for the next cycle.
    *   3. Calls itself again (take another step), until there are no more active units.
    */
    step() {

        this.propagate(this.active_unit_index, this.pattern);

        this.active_unit_index++;

        if(this.active_unit_index >= this.active_units.length) {
            this.active_unit_index = 0;
            this.cycles++;

            this.trigger("cycleComplete");
        }

        // As long as there are active units and the processing flag hasn't been set
        // to false, keep going.
        if(this.active_units.length && this.processing) {
            this.timer = setTimeout( this.step.bind(this) , this.process_delay);
        } else {
            this.stopProcessing();
        }

        this.steps++;
        this.trigger("stepComplete");
    }


    /**
    * Stops all processing by setting this.processing to false. This flag is checked in 
    * step(), and if it's false, step() will stop calling itself.
    */
    stopProcessing() {
        clearTimeout(this.timer);
        this.processing = false;
        this.trigger('processStop');
    }


    /**
    * Sets the next state for the active unit, then sets the neighbouring units.
    * @param {integer} index - The current unit index in the active units array.
    * @param {array} pattern - An array of coordinate sets used to calculate the neighbouring units coordinates.
    */
    propagate(index, pattern) {
        var neighbours = this.getNeighbourCoords( this.active_units[index], pattern );

        this.releaseActiveUnit(index);

        for(var i=0; i < neighbours.length ; i++) {
            this.set({x: neighbours[i].x, y: neighbours[i].y});
        }

    }


    /**
    * Gets the neighbouring units of a given unit.
    * @param {object} origin - A set of coordinates like {x: left, y: top} that define the origin.
    * @param {array} pattern - An array of coordinate sets used to calculate the neighbouring units coordinates.
    * @return {array} An array of matrix coordinates.
    */
    getNeighbourCoords(origin, pattern) {

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


    /**
    * Generates an array of coordinate sets containing coordinate deltas, used to
    * describing the propagation pattern.
    * @param {string} pattern_name - Name of the pattern.
    * @param {direction} direction - Sort direction of the pattern vector (clockwise or counter-clockwise).
    * @return {array} An array of matrix coordinate sets.
    */
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


    getActiveUnitsPercent() {
        if( ! this.active_units.length ) {
            return 0;            
        }

        return (this.active_units.length * 100) / this.unit_count;
    }


    /**
    * Returns a JSON representation of the Propagator instance.
    * @param {array} include - Array of object attributes to include. Possible
    * values are:
    * __all__: Include all attributes.
    * static: include only the static attributes.
    * dynamic: include only the dynamic attributes.
    * Combinations are accepted.
    */
    toJSON( include ) {

        if(typeof include === 'undefined') {
            include = ['__all__'];
        }

        var result = {};

        if( include.indexOf('__all__') >= 0 || include.indexOf('static') >= 0 ) {
            result = _.extend(result, {
                                "size": this.size,
                                "unit_count": this.unit_count,
                            });
        }

        if( include.indexOf('__all__') >= 0 || include.indexOf('dynamic') >= 0 ) {
            result = _.extend(result, {
                                    "active_units": this.active_units.length || 0,
                                    "%_active": this.getActiveUnitsPercent(),
                                    "active_unit_index": this.active_unit_index,
                                    "steps": this.steps || 0,
                                    "cycles": this.cycles || 0,
                                });
        }

        return result;

    }


    /**
    * Couple the backbone.js Events.
    */
    attachEvents() {

    	_.extend(this, Backbone.Events);

    }

}
