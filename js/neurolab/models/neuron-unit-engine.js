/**
* Implements the NeuronUnitEngine class.
*/

"use strict";


/**
* This implements the Neuron unit engine for use by a Neuron.
*/
class NeuronUnitEngine extends PropagatorUnitEngine {


	constructor(args) {

		super(args);

		/* Compulsory variables from parent class.*/
		this.initialValue = -90;
		this.finishValue = -300;
		this.triggerRange = [35];


		/* Specific neuron engine variables. */

			/* Voltages [V] */
		this.repose = this.initialValue;
		this.threshold = -65;
		this.peak = 35;
		this.hyper = -110;

		 	/* Time flow emulation */
		this.virtualMs = 1;
		this.time = 0;

			/* Durations [ms] */
		this.preDepolarization = this.virtualMs;
		this.depolarization = this.virtualMs;
		this.repolarization = 2 * this.virtualMs;
		this.hyperpolarizationDown = 2 * this.virtualMs;
		this.hyperpolarizationUp = 2 * this.virtualMs;

			/* Time marks [ms] */
		this.depolarizationEndMark = this.preDepolarization + this.depolarization;
		this.repolarizationEndMark = this.depolarizationEndMark + this.repolarization;
		this.hyperpolarizationDownEndMark = this.repolarizationEndMark + this.hyperpolarizationDown;
		this.hyperpolarizationUpEndMark = this.hyperpolarizationDownEndMark + this.hyperpolarizationUp;

			/* Function slopes */

		this.preDepolarizationSlope = this.calcSlope(
													{"x": 0, "y": this.repose}, 
													{'x': this.preDepolarization, "y": this.threshold}
												);
		this.depolarizationSlope = this.calcSlope(
													{"x": this.preDepolarization, "y": this.threshold},
													{'x': this.depolarizationEndMark, "y": this.peak}
												);
		this.repolarizationSlope = this.calcSlope(
													{"x": this.depolarizationEndMark, "y": this.peak},
													{'x': this.repolarizationEndMark, "y": this.initialValue}
												);
		this.hyperpolarizationDownSlope = this.calcSlope(
													{"x": this.repolarizationEndMark, "y": this.initialValue},
													{'x': this.hyperpolarizationDownEndMark, "y": this.hyper}
												);
		this.hyperpolarizationUpSlope = this.calcSlope(
													{"x": this.hyperpolarizationDownEndMark, "y": this.hyper},
													{'x': this.hyperpolarizationUpEndMark, "y": this.initialValue}
												);		
	}


	digest(value) {
		
		try {
			var stage = this.getStageByTime(this.time);

			var slope;

			switch(stage){
				case 'repose':
					slope = this.preDepolarizationSlope;
				break;

				case 'pre-depolarization':
					slope = this.preDepolarizationSlope;
				break;

				case 'depolarization':
					slope = this.depolarizationSlope;
				break;

				case 'critical':
					slope = this.repolarizationSlope;
				break;

				case 'repolarization':
					slope = this.repolarizationSlope;
				break;

				case 'hyperpolarization-down':
					slope =  this.hyperpolarizationDownSlope;
				break;

				case 'hyperpolarization-up':
					slope = this.hyperpolarizationUpSlope;
				break;
			}

			this.time += this.virtualMs;
			// console.log(this.runFunction(this.time - this.virtualMs, slope));
			return this.runFunction(this.time - this.virtualMs, slope);

		} catch (err) {
			this.time = 0;
			return this.finishValue;
		}			
	}


	getStageByTime(time) {
		if(time === 0) {
			return 'repose';
		}

		if(time > 0 && time < this.preDepolarization) {
			return 'pre-depolarization';
		}

		if(time >= this.preDepolarization && time < this.depolarizationEndMark ) {
			return 'depolarization';
		}

		if(time === this.depolarizationEndMark) {
			return 'critical';
		}

		if(time > this.depolarizationEndMark && time < this.repolarizationEndMark) {
			return 'repolarization';
		}

		if(time >= this.repolarizationEndMark && time < this.hyperpolarizationDownEndMark) {
			return 'hyperpolarization-down';
		}

		if(time >= this.hyperpolarizationDownEndMark && time <= this.hyperpolarizationUpEndMark) {
			return 'hyperpolarization-up';
		}

		throw { 
			    name: "NeuronUnitEngine Error", 
			    message: "Received an invalid time (beyond hyperpolarization)", 
			    toString: function(){return this.name + ": " + this.message;} 
			};
	}


	/**
	* Applies a linear function slope formula to a given value.
	* @param {Number} value - The input value.
	* @param {Object} slope - An object containing m and b.
	*/
	runFunction(value, slope) {
		return Math.round(slope.m * value + slope.b);
	}


	/**
	* Calculate the slope of a linear function given two points.
	* Slope intercept formula: y=mx+b.
	* @param {Object} p1 - First point coordinates.
	* @param {Number} p1.x - x coordinate.
	* @param {Number} p1.y - y coordinate.
	* @param {Object} p2 - First point coordinates.
	* @param {Number} p2.x - x coordinate.
	* @param {Number} p2.y - y coordinate.
	* @return {Object} An object containing m and b.
	*/
	calcSlope(p1, p2) {
		var slope = {};

		slope.m = (p2.x - p1.x) / (p2.y - p1.y);

		slope.b = p1.y - slope.m * p1.x;

		return slope;
	}

}
