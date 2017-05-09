Package.describe({
	name: 'steedos:freeboard',
	version: "1.1.3",
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

	api.addAssets('css/freeboard.min.css', 'client');
	api.addAssets('js/freeboard.thirdparty.min.js', 'client');
	api.addAssets('js/freeboard_plugins.min.js', 'client');
	api.addAssets('assets/index.html', 'client');

});

Package.onTest(function(api) {

});
