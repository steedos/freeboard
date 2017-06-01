Package.describe({
	name: 'steedos:freeboard',
	version: "1.1.3_4",
	summary: "freeboard",
	git: "https://github.com/steedos/freeboard"
});


Package.onUse(function(api) { 
	api.versionsFrom("1.2.1");

	api.addAssets('img/dropdown-arrow.png', 'client');
	api.addAssets('img/glyphicons-blackboard.png', 'client');
	api.addAssets('img/glyphicons-halflings.png', 'client');
	api.addAssets('img/glyphicons-halflings-white.png', 'client');
	api.addAssets('img/glyphicons-log-in.png', 'client');
	api.addAssets('img/glyphicons-log-out.png', 'client');
	
	api.addAssets('plugins/thirdparty/jquery.sparkline.min.js', 'client');
	api.addAssets('plugins/thirdparty/justgage.1.0.1.js', 'client');
	api.addAssets('plugins/thirdparty/raphael.2.1.0.min.js', 'client');


	api.addAssets('css/freeboard.min.css', 'client');
	api.addAssets('js/freeboard.min.js', 'client');
	api.addAssets('js/freeboard.thirdparty.min.js', 'client');
	api.addAssets('js/freeboard_plugins.min.js', 'client');
	api.addAssets('js/freeboard.plugins.min.js', 'client');
	api.addAssets('index.html', 'client');

	api.addAssets('assets/index.js', 'client');
	api.addAssets('assets/index.css', 'client');
	
	api.addAssets('assets/ionicons.css', 'client');
	api.addAssets('assets/fonts/ionicons.eot', 'client');
	api.addAssets('assets/fonts/ionicons.svg', 'client');
	api.addAssets('assets/fonts/ionicons.ttf', 'client');
	api.addAssets('assets/fonts/ionicons.woff', 'client');
});

Package.onTest(function(api) {

});
