$.ajaxSetup({
	beforeSend:function (){
		alert("beforeSend")
	}
});

dashboardExtend = {
	jQueryUrl:function(name){
		var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)"); 
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	},
	cookieVal:function(name){
		var reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		var arr = document.cookie.match(reg);
		if (arr != null) return unescape(arr[2]);
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
			// $.post("/api/dashboard/"+dashboardId,{freeboard:dashboardContent},function(data){
			// 	console.log("-------------post--------------")
			// 	console.log(data)
			// })
			$.ajax({
				url:"/api/dashboard/"+dashboardId,
				data:{freeboard:dashboardContent},
				type:"post",
				beforeSend:function (){
					alert("--post--");
				},

				success:function(data){

				}
			})
		});
	},
	changeDashboardHeaders:function(dashboardContent){
		var userId = this.cookieVal("X-User-Id");
		var tokenId = this.cookieVal("X-Auth-Token");
		var spaceId = this.jQueryUrl("spaceId");
		console.log(userId,tokenId,spaceId);
		//return [{name:"X-User-Id",value:userId},{name:"X-Auth-Token",value:tokenId},{name:"X-Space-Id",value:spaceId}];
		dashboardContent.datasources.forEach(function(data){
			if(data){
				headers = data.settings.headers;
			}else{
				return false;
			}
			if(headers){
				headers.push({name:"X-User-Id",value:userId},{name:"X-Auth-Token",value:tokenId},{name:"X-Space-Id",value:spaceId});
			}else{
				headers:[{name:"X-User-Id",value:userId},{name:"X-Auth-Token",value:tokenId},{name:"X-Space-Id",value:spaceId}];
			}
		})
	}
};
head.js("js/freeboard_plugins.min.js",
	// *** Load more plugins here ***
	function(){
		$(function(){
			// 需要根据url中dashboardId调用后台相关接口，返回dashboard脚本内容及编辑权限等
			var dashboardId,dashboardContent;
			dashboardId = dashboardExtend.jQueryUrl("dashboardId");
			console.log(dashboardId);

			if (dashboardId != null){
	
				$.ajax({
					url: "/api/dashboard/"+dashboardId,
					type: "get",

					success: function(data){
						dashboardContent = JSON.parse(data.freeboard);
						// 根据接口返回的编辑权限执行freeboard.initialize函数
						//dashboardContent.datasources[0].settings.headers=dashboardExtend.dataHeaders();
						dashboardExtend.changeDashboardHeaders(dashboardContent);
						debugger;
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