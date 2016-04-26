/**
* Implements the Propagator class.
*
* Dependencies: PropagatorUnit.
*/

"use strict";


/**
Implements a matrix of elements that can "propagate" from unit to unit.
When one of its element is set, the Propagator attempts to set its neighbouring 
elements, too, according to certain rules, until the entire matrix gets filled: 
This is the propagation process.
*/
class Propagator {


    /**
    * @constructor
    * @param {Object} args - Arguments for the constructor.
    * @param {int} args.width - Propagator matrix width.
    * @param {int} args.height - Propagator matrix height.
    * @param {int} args.process_delay - Processing delay in milliseconds.
    * @param {object} args.default_unit_engine - The propagator unit engine to use as default.
    */
    constructor(args) {

        this.attachEvents();

        this.process_delay = args.process_delay || 0;
        
        this.default_unit_engine = args.default_unit_engine;

        this.reset(args.width, args.height);

    }


    /**
    * Creates the actual matrix (bidimensional) array.
    * @param {integer} width - The width of the matrix.
    * @param {integer} height - The height of the matrix.
    */    
    reset(width, height) {

        if(!width || !height || width <= 0 || height <= 0) {
            throw {
                name: "Propagator Error", 
                message: sprintf("Trying to instance a propagator with invalid dimensions (%(width)s x %(height)s).", 
                                {width: width, height: height}),
                toString: function(){return this.name + ": " + this.message;} 
            };
        }

        this.stopProcessing();

        this.width = width;
        this.height = height;

        this.active_units = [];
        this.active_unit_index = 0;
        this.steps = 0;
        this.cycles = 0;        

        this.initMatrix();

        this.unit_count = this.width * this.height;

        this.trigger('afterReset', this.width, this.height);
    }


    /*
    * Initializes the propagator matrix.
    */
    initMatrix() {

        this.matrix = [[]];

        for(var i=0; i < this.width; i++) {
            this.matrix[i] = [];
        }

    }


    /**
    * Check if the matrix cell at given coordinates can be set.
    * @param {object} coords - A set of coordinates like {x: left, y: top}.
    * @return {boolean} True if unit can be set, false otherwise.
    */
    canSet(coords) {
        if(!this.matrix[coords.x][coords.y]) {
            return true;
        }
        return this.matrix[coords.x][coords.y].isIdle();
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

        if(!this.matrix[coords.x][coords.y]) {
            this.matrix[coords.x][coords.y] = new PropagatorUnit({"engine": this.default_unit_engine});
            // this.matrix[coords.x][coords.y].process();
        } else {
            this.matrix[coords.x][coords.y].reset();
            // this.matrix[coords.x][coords.y].process();
        }

        this.trigger('afterUnitSet', coords.x, coords.y, this.matrix[coords.x][coords.y]);

        this.process();
    }


    /**
    * Releases an active unit from the dynamic active unit array, and sets the
    * corresponding matrix unit status accordingly.
    */
    releaseActiveUnit(index) {
        var coords = {x: this.active_units[index].x, y: this.active_units[index].y};

        if(this.matrix[coords.x][coords.y].isIdle()) {            
            this.active_units.splice(index, 1);
            this.trigger('afterUnitRelease', coords.x, coords.y, this.matrix[coords.x][coords.y]);

        }
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

        var coords = this.active_units[index];

        if(this.matrix[coords.x][coords.y].isCritical()) {
            var neighbours = this.getNeighbourCoords( coords, pattern );
            
            for(var i=0; i < neighbours.length ; i++) {
                this.set({x: neighbours[i].x, y: neighbours[i].y});
            }
        }

        this.matrix[coords.x][coords.y].process();
        this.releaseActiveUnit(index);

    }


    /**
    * Gets whatever exists in the matrix at the given coordinates.
    * @param {object} coords - a pair of {x, y} coordinates. 
    */
    get(coords) {
        return this.matrix[coords.x][coords.y];
    }


    /**
    * Gets the neighbouring coords of a given unit.
    * @param {object} origin - A set of coordinates like {x: left, y: top} that define the origin.
    * @param {array} pattern - An array of coordinate sets used to calculate the neighbouring units coordinates.
    * @return {array} An array of matrix coordinates.
    */
    getNeighbourCoords(origin, pattern) {

        var result = [];

        for(var i=0; i < pattern.length; i++ ) {

            var x = origin.x + pattern[i].x;
            if(x < 0 || x >= this.width ) {
                continue;
            }

            var y = origin.y + pattern[i].y;
            if(y < 0 || y >= this.height) {
                continue;
            }

            result.push({x: x, y: y});
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
                            {x: -1, y: 0} ];
            break;
        }

        switch(direction) {
            case 'cw':
                // Do nothing. Patterns are expected to be defined clokcwise starting
                // from top-left.

            break;

            case 'ccw':
                pattern.reverse();
            break;
        }

        return pattern;
    }


    /**
    * Gets the coordinates of the active unit in the Propagator matrix.
    * @return {Object} Object containing unit's coordinates.
    */
    getActiveUnitCoords() {
        if(!this.active_units) {
            return null;
        }
        return this.active_units[this.active_unit_index];
    }


    /**
    * Calculates and gets the percent of active units from the total unit count.
    * @return {float} The percent of units currently active.
    */
    getActiveUnitsPercent() {
        if( ! this.active_units.length ) {
            return 0;            
        }

        return (this.active_units.length * 100) / this.unit_count;
    }


    /**
    * Sets the processing delay in milliseconds and triggers a change event.
    * @param {int} milliseconds - Milliseconds to delay processing loop by.
    */
    setProcessDelay(milliseconds) {
        if(milliseconds !== this.process_delay) {
            this.process_delay = milliseconds;
            this.trigger('change');
        }
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
    toJSON(include) {

        if(typeof include === 'undefined') {
            include = ['__all__'];
        }

        var result = {};

        if( include.indexOf('__all__') >= 0 || include.indexOf('static') >= 0 ) {
            result = _.extend(result, {
                                "width": this.width,
                                "height": this.height,
                                "unit_count": this.unit_count,
                                "process_delay": this.process_delay
                            });
        }

        if( include.indexOf('__all__') >= 0 || include.indexOf('dynamic') >= 0 ) {
            
            var active_unit_coords = this.getActiveUnitCoords();
            if(active_unit_coords) {
                active_unit_coords = JSON.stringify(active_unit_coords);
            }

            result = _.extend(result, {
                                    "active_units": this.active_units.length || 0,
                                    "%_active": this.getActiveUnitsPercent(),
                                    "active_unit_index": this.active_unit_index,
                                    "active_unit_coords": active_unit_coords,
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
