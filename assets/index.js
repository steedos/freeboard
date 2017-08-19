Steedos = window.parent.Steedos || {}
userInfo = {
	userId: (function() {
		var Accounts = window.parent.Accounts;
		if (Accounts) {
			var userId = Accounts.userId();
		} else {
			var userId = localStorage.getItem('Meteor.userId');
		}
		return userId;
	})(),
	authToken: (function() {
		var Accounts = window.parent.Accounts;
		if (Accounts) {
			var authToken = Accounts._storedLoginToken();
		} else {
			var authToken = localStorage.getItem('Meteor.loginToken');
		}
		return authToken;
	})()
}
dashboardExtend = {
	jQueryUrl: function(name, url) {
		if (url) {
			if (url.split("?")[1]) {
				var search = "?" + url.split("?")[1];
			} else {
				var search = "";
			}
		} else {
			var search = window.location.search;
		}
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	},
	cookieVal: function(name) {
		var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		var arr = document.cookie.match(reg);
		if (arr != null) return unescape(arr[2]);
		return null;
	},
	bindDashboardSaveEvent: function(dashboardId) {
		$("[data-pretty]").off("click");
		$("[data-pretty]").on("click", function() {
			var pretty = $(event.currentTarget).data('pretty');
			if (pretty) {
				dashboardContent = JSON.stringify(freeboard.serialize(), null, '\t');
			} else {
				dashboardContent = JSON.stringify(freeboard.serialize());
			}
			//调用后台相关接口把newdashboardContent保存到后台数据库
			$.ajax({
				url: "/api/dashboard/" + dashboardId,
				data: {
					freeboard: dashboardContent
				},
				type: "post",

				success: function(data) {

				}
			})
		});
	},
	changeDashboardURL: function(dashboardContent) {
		var reg = /^\/[\w\W]*/;
		var userId = userInfo.userId;
		var authToken = userInfo.authToken;
		var spaceId = this.jQueryUrl("spaceId");
		if (dashboardContent.datasources) {
			dashboardContent.datasources.forEach(function(data) {
				if (data) {
					// var query = "?userId="+userId+"&authToken="+authToken+"&spaceId="+spaceId;
					var url = data.settings.url || "";
					var relUrl = url.split("?")[0];
					var state = dashboardExtend.jQueryUrl("state", url);
					var limit = dashboardExtend.jQueryUrl("limit", url);
					state ? state = "&state=" + state : state = "";
					limit ? limit = "&limit=" + limit : limit = "";
					var query = "?" + state + limit;
					if (reg.test(relUrl)) {
						data.settings.url = Steedos.getUrlWithToken(Steedos.absoluteUrl(relUrl + query));
					}
				}
			})
		}
	},
	changeDashboardHeaders: function(dashboardContent) {
		var userId = localStorage.getItem('Meteor.userId')
		var tokenId = localStorage.getItem('Meteor.loginToken')
		var spaceId = this.jQueryUrl("spaceId");
		if (dashboardContent.datasources) {
			dashboardContent.datasources.forEach(function(data) {
				if (data) {
					var headers = data.settings.headers || [];
				} else {
					return false;
				}
				headers.forEach(function(header) {
					if (header.name == "X-User-Id") {
						header.value = userId;
					}
					if (header.name == "X-Auth-Token") {
						header.value = tokenId;
					}
					if (header.name == "X-Space-Id") {
						header.value = spaceId;
					}
				})
			})
		}
	}
};
head.js("js/freeboard_plugins.min.js",
	// *** Load more plugins here ***
	function() {
		$(function() {
			// 需要根据url中dashboardId调用后台相关接口，返回dashboard脚本内容及编辑权限等
			var dashboardId, dashboardContent;
			dashboardId = dashboardExtend.jQueryUrl("dashboardId");

			$("body").addClass("light");
			$("body").addClass("li-height-auto");
			if (dashboardId) {
				var url = Steedos.getUrlWithToken(Steedos.absoluteUrl("/api/dashboard/" + dashboardId));
				var headers = [];

				$.ajax({
					url: url,
					type: "get",

					success: function(data) {
						dashboardContent = data.freeboard ? JSON.parse(data.freeboard) : {};
						// 根据接口返回的编辑权限执行freeboard.initialize函数
						// dashboardExtend.changeDashboardHeaders(dashboardContent);
						dashboardExtend.changeDashboardURL(dashboardContent);
						freeboard.initialize(true);
						// 根据接口返回的脚本内容执行freeboard.loadDashboard加载dashboard脚本
						dashboardContent.allow_edit = data.isEditable;
						freeboard.loadDashboard(dashboardContent, function() {
							freeboard.setEditing(false, false);
						});
						dashboardExtend.bindDashboardSaveEvent(dashboardId);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						var errorMsg = errorThrown;
						if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.error) {
							errorMsg = XMLHttpRequest.responseJSON.error;
						}
						var toastr = window.parent.toastr;
						if (toastr) {
							toastr.error(errorMsg);
						}
					}
				})
			}
		});
	}
);