/*
Namespace: Nokia Blacklist feature

File Name: blist-admin.js

About: Version
	1.0

Description:
	blacklist users

Requires:
	jQuery 1.3.2 <http://jquery.com>

*/

window.Juniper = window.Juniper || {};
window.Juniper.admin = window.Juniper.admin || {};
window.Juniper.admin.blacklist = window.Juniper.admin.blacklist || {};

Juniper.admin.blacklist = function(){
	
	var toggleDetail = function(scope){
		$("a:first", scope).bind("click", function(e){
			e.preventDefault();
			var showArea = $(".detail", scope);
			$(showArea).toggle();
		});
	};
	
	var toggleHistory = function(scope){
		var history = $(".userHistory", scope);
		var historyList = $(".historyList", history)
		
		$("h3 a", history).bind("click", function(e){
			e.preventDefault();
			var myAction = $(this).attr("href");
			
			if ($(historyList).is(":visible")) {
				$(historyList).hide();
			} else {
					$(historyList).empty();
					$.ajax({
						url			: myAction,
						type		: "POST",
						data		: {},
						cache		: false,
						success	: function(response) {
							$(historyList).append(response);
						},
						error : function() {
							$(historyList).append('<li class="listError">no history found</li>');
						}
					}); // end ajax
					$(historyList).show();
			};
			
		});
	};
	
	var toggleComments = function(scope){
		var comments = $(".userComments", scope);
		var commentsList = $(".commentList", comments);
		$("h3 a", comments).bind("click", function(e){
			e.preventDefault();
			var myAction = $(this).attr("href");
			if ($(commentsList).is(":visible")) {
				$(commentsList).hide();
			} else {
					$(commentsList).empty();
					$.ajax({
						url			: myAction,
						type		: "POST",
						data		: {},
						cache		: false,
						success	: function(response) {
							$(commentsList).append(response);
						},
						error : function() {
							$(commentsList).append('<li class="listError">no comments found</li>');
						}
					}); // end ajax
					$(commentsList).show();
			};
		});
	};
	
	var toggleBlockDetail = function(scope) {
		var blockDetail = $(".blockDetail", scope);
		
		$(".blockBtn", scope).bind("click", function(e) {
			e.preventDefault();
			blockDetail.show("block");
		});
		
		$(".unblockBtn", scope).bind("click", function(e) {
			e.preventDefault();
			blockDetail.show("unblock");
			// show email box again
			//$(scope).removeClass("blocked");
		});
	};
	
	var setupEmail = function(scope) {
		var blockDetail = $(".blockDetail", scope);
		var queryString = "";

		var myForm = $("form", blockDetail);
		var confirm = $(".blockConfirm", blockDetail);
		var error = $(".formError", blockDetail);
		
		// reset form to initial state
		var blockClear = function(){
			myForm.show();
			confirm.hide();
			error.hide();
			blockDetail.hide();
		};
		
		// show error and form
		var blockeFailure = function(message){
			myForm.show();
			confirm.hide();
			error.show(message);
		};
		
		// blocked
		var blockSuccess = function(){
			blockClear();
			$(scope).addClass("blocked");
		};
		
		// confirm to send form or not
		var blockConfirm = function(message) {
			myForm.hide();
			confirm.show();
			error.hide();
		};
		
		myForm.submit(function(e){
			e.preventDefault();
			var queryString = myForm.serialize();
			blockConfirm();
		});
		
		$(".blockNo", confirm).bind("click", function(e){
			e.preventDefault();
			blockClear();
		});
		
		$(".blockYes", confirm).bind("click", function(e){
			e.preventDefault();
			
			// success
			blockSuccess();
			
			//failure
			//blockFailure();
			
			// $.ajax({
			// 	url			: "/",
			// 	type		: "POST",
			// 	data		: {},
			// 	cache		: false,
			// 
			// 	success	: function(response) {
			//		blockSuccess();
			// 	}
			// }); // end ajax
		});
		
		
	};

	var setupAdmin = function(){
		$("#userList > li").each(function(){
			var thisList = this;
			toggleDetail(thisList);
			toggleComments(thisList);
			toggleHistory(thisList);
			toggleBlockDetail(thisList);
			setupEmail(thisList)
		});
	};
	
	return {
		init: function(){
			setupAdmin();
		}
	}
}();

$(document).ready(Juniper.admin.blacklist.init);