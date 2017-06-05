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
	bindDashboardSaveEvent:function(dashboardId){
		$("[data-pretty]").off("click");
		$("[data-pretty]").on("click",function(){
			var pretty = $(event.currentTarget).data('pretty');
			if(pretty){
				dashboardContent = JSON.stringify(freeboard.serialize(), null, '\t');
			}else{
				dashboardContent = JSON.stringify(freeboard.serialize());
			}
			//调用后台相关接口把newdashboardContent保存到后台数据库
			$.ajax({
				url:"/api/dashboard/"+dashboardId,
				data:{freeboard:dashboardContent},
				type:"post",

				success:function(data){

				}
			})
		});
	},
	changeDashboardHeaders:function(dashboardContent){
		var userId = this.cookieVal("X-User-Id");
		var tokenId = this.cookieVal("X-Auth-Token");
		var spaceId = this.jQueryUrl("spaceId");
		if(dashboardContent.datasources){
			dashboardContent.datasources.forEach(function(data){
				if(data){
					headers = data.settings.headers;
				}else{
					return false;
				}
				headers.forEach(function(header){
					if(header.name == "X-User-Id"){
						header.value = userId;
					}
					if(header.name == "X-Auth-Token"){
						header.value = tokenId;
					}
					if(header.name == "X-Space-Id"){
						header.value = spaceId;
					}
				})
			})
		}
	}
};
head.js("js/freeboard_plugins.min.js",
	// *** Load more plugins here ***
	function(){
		$(function(){
			// 需要根据url中dashboardId调用后台相关接口，返回dashboard脚本内容及编辑权限等
			var dashboardId,dashboardContent;
			dashboardId = dashboardExtend.jQueryUrl("dashboardId");

			var zoomValue = "zoom-"+localStorage.getItem("accountZoomValue.name");
			$("body").removeClass("zoom-normal").removeClass("zoom-large").removeClass("zoom-extra-large");
			$("body").addClass("zoom-extra-large");
			$("body").addClass("light");
			if (dashboardId){
	
				$.ajax({
					url: "/api/dashboard/"+dashboardId,
					type: "get",

					success: function(data){
						dashboardContent = data.freeboard ? JSON.parse(data.freeboard) : {};
						// 根据接口返回的编辑权限执行freeboard.initialize函数
						dashboardExtend.changeDashboardHeaders(dashboardContent);
						freeboard.initialize(true);
						// 根据接口返回的脚本内容执行freeboard.loadDashboard加载dashboard脚本
						dashboardContent.allow_edit = data.isEditable;
						freeboard.loadDashboard(dashboardContent,function(){
							freeboard.setEditing(false,false);
						});
						dashboardExtend.bindDashboardSaveEvent(dashboardId);
					}
				})
			}
		});
	}
);