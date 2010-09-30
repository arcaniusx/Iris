/*
* @file CN.Iris.js
* @author Filipe Araujo Paul Bronshteyn
* @copyright (c) Conde Nast Digital
*/

if (typeof CN === 'undefined' || !CN) {
    var CN = {};
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
CN.iris = (function($){
	var
	init = function(){
	};

	$(function(){
		init();
	});

	return {}

})(jQuery);


/**
 *
* CN iris pub
* @class					CN iris pub
* @description              Publication Handler
* @public
* @author					Filipe Araujo & Paul Bronshteyn
* @requires					CN
*/
CN.iris.pub = (function($){

	var
	/**
     * database storage object db connection
     * @memberOf 				CN.iris.pub
     * @private
     * @type					object
     */
	db = {},

	/**
     * publication storage object
     * @memberOf 				CN.iris.pub
     * @private
     * @type					object
     */
	pub = {},

	/**
	 * Initialize & binds events
	 * @memberOf				CN.iris.pub
	 * @private
	 */
	init = function(){
		$(window).bind('CN.customEvents.iris.db.open', loadDB);
	},

	/**
	 * Activates selected pub and displays panel and deactivates
	 * previous pub
	 * @memberOf				CN.iris.pub
	 * @private
	 * @param {Object}			elem : jQuery pub object
	 */
	activate = function(elem){
		deactivate();
		elem.addClass("active").children(".panel").show("fast");
	},

	/**
	 * Add publication into db if exists, if db functionality does not exists
	 * publications are still created
	 * @memberOf				CN.iris.pub
	 * @private
	 */
	add = function(pub){
		try {
			db.transaction(function(tx){
				tx.executeSql("INSERT INTO pubs (content, title, type, url) VALUES (?,?, ?, ?)", [ pub.content, pub.title, pub.type, pub .url ],
					function(){
						console.log('creating publication entry');
						create(pub, { animate : true });
					},
					CN.iris.db.error);
			});
		}
		catch(err){
			create(pub, { animate : true });
		}
	},

	/**
	 * Create Publication object and prepends them to pub collection
	 * area, also determines whether animation should be executed
	 * @memberOf				CN.iris.pub
	 * @private
	 * @param {Object}			data : pub data object
	 * @param {Object}			pars : params
	 */
	create = function(data, pars){
		pub =  $('<li class="pub">'+
					'<a href="#">'+data.title+'</a>'+
					'<div class="panel">'+
						'<h1>'+data.title+'</h1>'+
						'<div>'+data.content+'</div>'+
					'</div>'+
				'</li>').hide().bind("click", open);
		$('#cnb_pubs').prepend(pub);
		(pars.animate) ? slide() : pub.show();
	},

	/**
	 * Deactivates currently active pub
	 * @memberOf				CN.iris.pub
	 * @private
	 */
	deactivate = function(){
		$('.pub.active').removeClass("active").children(".panel").hide();
	},

	/**
	 * create Pubs database
	 * @memberOf				CN.iris.pub
	 * @private
	 */
	createDB = function(e){
		console.log('creatingDB');
		db.transaction(function(tx){
			tx.executeSql("CREATE TABLE pubs (id INTEGER PRIMARY KEY , content BLOB, title VARCHAR(255) UNIQUE, type VARCHAR(25), url VARCHAR(255) ) ", [], null, CN.iris.db.error)
		})
	},

	/**
	 * checks for existing pubs in database
	 * @memberOf				CN.iris.pub
	 * @private
	 * @param {Object}			e : event object passed along with db object
	 */
	loadDB = function(e){
		db = e.db;
		db.transaction(function(tx){
			tx.executeSql("SELECT * FROM pubs", [] ,
				/**
				 * load each existing pub
				 * @param {Object} tx
				 * @param {Object} rs
				 */
				function(tx, rs){
					for(var i = 0; i < rs.rows.length; i++) {
						create(rs.rows.item(i) , {
							animate : false
						});
					}
					console.log('loading publication db entries');
				},
				createDB)
		});
	},

	/**
	 * Click event for pubs that activate or deactivate panels
	 * @memberOf				CN.iris.pub
	 * @private
	 * @bind                    CN.iris.pub.init
	 */
	open = function(){
		var elem = $(this);
		(elem.is('.active')) ? deactivate() : activate(elem);
	},

	/**
	 * Animating show which is executed whether a new moduled
	 * is added
	 * @memberOf				CN.iris.pub
	 * @private
	 */
	slide = function(){
		pub.animate({
			width : 'toggle'
		},{
			duration : 300,
			complete: function(){
				$(this).trigger("click");
			}
		});
	};

	init();

	/**
     * @scope					CN.iris.pub
     */
	return {
		/**
		 * Public method for adding publications
		 * @memberOf			CN.iris.pub
		 * @public
		 */
		add : add
	}
})(jQuery);


/**
* CN iris timeline
* @class					CN iris timeline
* @description              Timeline Handler
* @public
* @author					Filipe Araujo & Paul Bronshteyn
* @requires					CN
*/
CN.iris.timeline = (function($){

	var

	/**
	 * add timeline
	 * @memberOf				CN.iris.timeline
	 * @private
	 */
	add = function(timeline){
		try {
			db.transaction(function(tx){
				tx.executeSql("INSERT INTO timeline (article, title, site, url, timestamp) VALUES (?,?,?,?,?)", [ timeline.article, timeline.title, timeline.site, timeline.url, new Date() ],
					function(){
						console.log('timeline entry created');
					},
					CN.iris.db.error);
			});
		}
		catch(err){
			console.log('unable to create timeline entry');
		}
	},

	/**
	 * create timeline database
	 * @memberOf				CN.iris.timeline
	 * @private
	 */
	createDB = function(e){
		db.transaction(function(tx){
			tx.executeSql("CREATE TABLE timeline (article INTEGER PRIMARY KEY ,  title VARCHAR(255), site VARCHAR(25),  url BLOG, timestamp DATETIME ) ", [], null, CN.iris.db.error)
		})
	},

	/**
	 * checks for existing timelines in database
	 * @memberOf				CN.iris.timeline
	 * @private
	 * @param {Object}			e : event object passed along with db object
	 */
	loadDB = function(e){
		db = e.db;
		db.transaction(function(tx){
			tx.executeSql("SELECT * FROM timeline", [],
				function(){ console.log('loading timeline db entries');
			},
			createDB)
		});
	};

	$(window).bind('CN.customEvents.iris.db.open', loadDB);

	return {
		add : add
	}
})(jQuery);

/**
*
* CN iris db
* @class						CN iris db
* @description			        Database Handler
* @public
* @author						Filipe Araujo & Paul Bronshteyn
* @requires					    CN
*/
CN.iris.db = (function($){

	var

	/**
     * browser db connection
     * @memberOf						CN.iris.db
     * @private
     * @type							object
     */
	db,

	/**
	 * checks for HMTL5 database compatability and opens database
	 * @memberOf						CN.iris.db
	 * @private
	 */
	_open = function(){
		if(window.openDatabase){
			db = window.openDatabase("condenast_iris",  "1.0", "iris", 1024*1024);
			if (db) {
				$(window).trigger({ type : 'CN.customEvents.iris.db.open', db : db});
			}
		}
		CN.iris.db.isConnected = !!db;
	},

	/**
	 * error  handler
	 * @memberOf						CN.iris.db
	 * @private
	 */
	_error = function(){
		console.info("error: "+arguments[1].message, arguments);
	},

	/**
	 * deletes database - debug only
	 * @memberOf						CN.iris.db
	 * @private
	 */
	_remove = function(database){
		console.log(database);
		try{
			db.transaction(function(tx){
				tx.executeSql("DROP TABLE "+database, [], _result , _error);
			});
		}
		catch(err){}
	},

	/**
	 * success handler
	 * @memberOf						CN.iris.db
	 * @private
	 */
	_result = function(){
		console.info("success",arguments);
	};

	/**
	 * @scope								public
	 */
	return {

		/**
		 * Public method allowing db to be opened
		 * @memberOf						CN.iris.db
		 * @public
		 */
		open : _open,

		/**
		 * deletes database - debug only
		 * @memberOf						CN.iris.db
		 * @public
		 */
		remove : _remove,

		/**
		 * Public method handling db errors
		 * @memberOf						CN.iris.db
		 * @public
		 */
		error : _error

	}

})(jQuery);

