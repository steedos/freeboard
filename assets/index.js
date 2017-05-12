dashboardExtend = {
	jQueryUrl:function(){
		var reg = new RegExp("(^|&)dashboardId=([^&]*)(&|$)"); 
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	},
	saveDashboardContent:function(dashboardId){
		$("[data-pretty]").off("click");
		$("[data-pretty]").on("click",function(){
			var pretty = $(event.currentTarget).data('pretty');
			if(pretty){
				dashboardContent = JSON.stringify(freeboard.serialize(), null, '\t');
			}else{
				dashboardContent = JSON.stringify(freeboard.serialize());
			}
			//调用后台相关接口把newdashboardContent保存到后台数据库
			$.post("/api/dashboard/"+dashboardId,{freeboard:dashboardContent},function(data){
				console.log("-------------post--------------")
				console.log(data)
			})
		});
	}
};
head.js("js/freeboard_plugins.min.js",
	// *** Load more plugins here ***
	function(){
		$(function(){
			// 需要根据url中dashboardId调用后台相关接口，返回dashboard脚本内容及编辑权限等
			var dashboardId,dashboardContent;
			dashboardId = dashboardExtend.jQueryUrl();
			console.log(dashboardId);

			if (dashboardId != null){
	
				$.ajax({
					url: "/api/dashboard/"+dashboardId,
					type: "get",

					success: function(data){
						dashboardContent = JSON.parse(data.freeboard);
						// 根据接口返回的编辑权限执行freeboard.initialize函数
						freeboard.initialize(true);
						// 根据接口返回的脚本内容执行freeboard.loadDashboard加载dashboard脚本
						freeboard.loadDashboard(dashboardContent);
						dashboardExtend.saveDashboardContent(dashboardId);
					}
				})
			}
		});
	}
);