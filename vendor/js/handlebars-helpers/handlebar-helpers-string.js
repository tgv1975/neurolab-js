/**
* handlebar-helpers-string
*
* Offers frequently neede helpers for Handlebars, to deal with string formatting.
*
* Copyright (C) 2016 Tudor Gavan.

* MIT License
*/


Handlebars.registerHelper('toLowerCase', function(str) {
	return str.toLowerCase();
});


Handlebars.registerHelper('deSlugify', function(str) {
	return str.replace(/[\-\_]+/gi, ' ');
});


Handlebars.registerHelper('ucFirst', function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
});


Handlebars.registerHelper('checkedAttr', function(value) {
	if(value) {
		return ' checked="checked" ';
	}

	return '';
});