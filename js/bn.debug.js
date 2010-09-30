/**
 * @file
 * @author              Filipe Araujo
 * @version             1.0
 */

/**
 *
* CN iris
* @class                    CN Iris Debug
* @description
* @public
* @author					Filipe Araujo & Paul Bronshteyn
* @requires					CN
*/
BN.iris.debug = (function($){

	var xml = '',

	testXML = function(){
		$.ajax({
			type: "GET",
			url: "xml/data.xml",
			dataType: "xml",
			success : outputXML
		});
	},

	formatXML = function(nodes){
		var attr,
			children,
			i,
			node;

		xml += '<ul>';
		$.each(nodes, function(){
			attr = this.attributes;
			node = $(this);
			children = node.children();

			xml += '<li class="collapse">';
			xml += this.nodeName;
			if(attr.length > 0){
				for(i = 0; i < attr.length; i++){
					xml += '<span>'+attr[i].nodeName+' = ' + attr[i].nodeValue +'</span>';
				}
			}
			if(children.length > 0){
				formatXML(children);
			}
			xml += '</li>';
		});
		xml += '</ul>';

		console.log(xml)
	},

	outputXML = function(e){
		formatXML($(e).find('Response'));

		$('#mod-debug-panel-xml')
			.html(xml)
			.delegate('li', 'click', function(){
				$(this).toggleClass('collapse');
			});
	};

	$(function(){
		//BN.iris.debug.init();
		$(window).bind('load.iris.debug', testXML)
	});

	return {
		init : testXML
	}
})(jQuery);