head.js("js/freeboard_plugins.min.js",
	// *** Load more plugins here ***
	function(){
		$(function(){
			// 需要根据url中dashboardId调用后台相关接口，返回dashboard脚本内容及编辑权限等
			var dashboardId;
			var reg = new RegExp("(^|&)dashboardId=([^&]*)(&|$)"); 
			var r = window.location.search.substr(1).match(reg);
			r != null ? dashboardId = unescape(r[2]) : dashboardId = null;
			console.log(dashboardId);
			if (dashboardId != null){
				$.getJSON("/api/dashboard/"+dashboardId,function(data){
					// freeboard.loadDashboard(data,function(){
					// 	freeboard.setEditing(false);
					// })
					console.log("-------------get--------------")
					console.log(data)
				})
			}
			// 根据接口返回的编辑权限执行freeboard.initialize函数
			freeboard.initialize(true);
			// 根据接口返回的脚本内容执行freeboard.loadDashboard加载dashboard脚本
			var dashboardContent = {"version":1,"allow_edit":true,"plugins":[],"panes":[{"title":"rr","width":1,"row":{"3":1},"col":{"3":1},"col_width":1,"widgets":[{"type":"text_widget","settings":{"title":"eee","size":"regular","value":"eee","animate":true}}]}],"datasources":[],"columns":3};
			freeboard.loadDashboard(dashboardContent);
			// 重写保存按钮事件，点击调用相关接口保存到数据库
			$("[data-pretty]").off("click");
			$("[data-pretty]").on("click",function(){
				var pretty = $(event.currentTarget).data('pretty');
				var dashboardContent = {};
				if(pretty){
					dashboardContent = JSON.stringify(freeboard.serialize(), null, '\t');
				}else{
					dashboardContent = JSON.stringify(freeboard.serialize());
				}
				//调用后台相关接口把dashboardContent保存到后台数据库
				$.post("/api/dashboard/"+dashboardId,{freeboard:dashboardContent},function(data){
					console.log("-------------post--------------")
					console.log(data)
				})
			});
		});
	}
);