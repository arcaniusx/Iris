/*
* @file CN.Iris.js
* @author Filipe Araujo Paul Bronshteyn
* @copyright (c) Conde Nast Digital
*/

if (typeof BN === 'undefined' || !BN) {
    var BN = {};
}

/**
 *
* CN iris
* @class                    CN Iris
* @description
* @public
* @author					Filipe Araujo & Paul Bronshteyn
* @requires					CN
*/
BN.iris = (function($){

	$(function(){
		//BN.iris.debug.init();
		$(window).trigger('load.iris.debug');
	});

	return {}

})(jQuery);
