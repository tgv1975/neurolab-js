/**
* CanvasGrid
*
* Implements the logic for a grid/tiled display space on a HTML canvas.
*
* Copyright (C) 2016 Tudor Gavan.

* MIT License
*/

"use strict;"

/**
* @abstract
*/
var CanvasGrid = Backbone.View.extend({
	
	el: '', // Child class must provide a valid DOM element selector.

	zoom: 1,

	colors: {
		background: 'lime',
		cursor: 'blue',
	},

	events: {
		'click': 'clickHandler',
		'mousemove': 'mouseMoveHandler',
		'mouseout': 'mouseOutHandler',
	},


	initialize: function( width, height ) {

		if(this.constructor === CanvasGrid) {
			throw { 
			    name: "CanvasGrid Error", 
			    message: "Cannot instantiate CanvasGrid directly! You must extend it, and provide the required properties.",
			    toString: function(){return this.name + ": " + this.message;} 
			};
    	}

    	if(this.el.tagName !== 'CANVAS') {
			throw { 
			    name: "CanvasGrid Error", 
			    message: "The DOM element provided to the CanvasGrid view is not a valid <canvas> element. Nothing to draw on.",
			    toString: function(){return this.name + ": " + this.message;} 
			};
    	}

    	this.width = width;
    	this.height = height;

		this.context = this.el.getContext('2d');

		this.cursorCanvas = this.createSpriteCanvas(this.width, this.height);
		this.cursorContext = this.cursorCanvas.getContext('2d');

		this.render();

		this.drawCursor(this.colors.cursor);

	},


	createSpriteCanvas: function(id, width, height ) {

		var canvas = document.createElement('canvas');
		canvas.id = id ; 
		canvas.style.position = 'absolute';

		var origin = this.$el.offset();

		$(canvas).offset(origin);

		canvas.width = width;
		canvas.height = height;

		canvas.style.pointerEvents = 'none';
		
		this.$el.parent()[0].appendChild(canvas);

		return canvas;
	},


	render: function() {

		this.reset();
		this.drawBackground();

		return this;

	},


	reset: function() {
		this.el.width = this.width * this.zoom;
		this.el.height = this.height * this.zoom;

		this.cursorCanvas.width = this.zoom;
		this.cursorCanvas.height = this.zoom;
	},


	drawBackground: function() {
		this.context.beginPath();
		this.context.fillStyle = this.colors.background;
		this.context.fillRect(0, 0, this.el.width, this.el.height )
		this.context.closePath();
	},


	plot: function(x, y, color) {
		// console.log('Plotting at: ' + x + ', ' + y)
		this.context.beginPath();
		this.context.fillStyle = color;
		this.context.fillRect(x, y, this.zoom, this.zoom);
		this.context.closePath();
	},

	plotByTile: function(x, y, color) {
		x = x * this.zoom;
		y =y * this.zoom;

		this.plot(x, y, color);
	},
	
	drawCursor: function(color) {
		this.cursorContext.beginPath();
		this.cursorContext.lineWidth = 2;
		this.cursorContext.strokeStyle = color;
		this.cursorContext.strokeRect(0, 0, this.cursorCanvas.width, this.cursorCanvas.height);
		this.cursorContext.closePath();
	},

	
	moveCursor: function(x, y) {
		var origin = this.$el.offset();
		
		$(this.cursorCanvas).offset( {top: y + origin.top, left: x + origin.left} );
	},


	getRandomColor: function() {
		return "#"+((1<<24)*Math.random()|0).toString(16);
	},


	getMousePos: function(event) {
	    var rect = this.el.getBoundingClientRect();
	    return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
	  	}
    },

    
    getMousePosToGrid: function(event){
    	var coords = this.getMousePos(event);

    	return {
    		x: this.coordinateToGrid(coords.x),
    		y: this.coordinateToGrid(coords.y)
    	}
    },


	getMousePosToTileIndex: function(event) {
		var coords = this.getMousePosToGrid(event);

		return {
			x: this.gridCoordToTileIndex(coords.x),
			y: this.gridCoordToTileIndex(coords.y)
		}
	},   


    coordinateToGrid: function(value) {

    	return Math.trunc(value / this.zoom) * this.zoom;

    },

    
    gridCoordToTileIndex: function(value) {

    	return Math.trunc(value / this.zoom)

    },


    constrainCoord: function(value, compare){
    	if(value < 0) {
    		return 0;
    	}

    	if(value > compare) {
    		return compare;
    	}

    	return value;
    },
	

	clickHandler: function(event) {

		var coords = this.getMousePosToGrid(event);
		this.plot( coords.x, coords.y, 'red');

	},


	mouseMoveHandler: function(event) {
		
		var coords = this.getMousePosToGrid(event);

		if( typeof this.lastCursor !== 'undefined') {

			if(coords.x === this.lastCursor.x & coords.y === this.lastCursor.y ) {
				return;
			}

		}

		this.moveCursor(coords.x, coords.y);

		this.lastCursor = { x: coords.x, y: coords.y };

		return event;

	},


	mouseOutHandler: function(event){
		return event;
	}

});

CanvasGrid.extend = function(child) {
	var view = Backbone.View.extend.apply(this, arguments);
	view.prototype.events = _.extend({}, this.prototype.events, child.events);
	return view;
};