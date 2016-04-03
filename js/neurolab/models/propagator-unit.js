/**
* Implements the PropagatorUnit class.
* Dependencies: Depolarizer.
*/

"use strict";

class PropagatorUnit {


    constructor() {
        this.status = 2;
        this.engine = new PropagatorUnitEngine();

        this.process();
    }


    canSet() {
    	return this.status <= 0;
    }

    process() {
    	this.status--;
    }

}