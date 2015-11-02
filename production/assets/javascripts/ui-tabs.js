$(function(){
	(function(){
		"use strict";
		// Tabs
		var navs = $('#js-tab-nav').find('a');
		navs.on('click', function(event){
			event.preventDefault();
			$(this)
				.addClass('table-tab--active')
				.siblings()
				.removeClass('table-tab--active');
			$(this.hash)
				.show()
				.siblings()
				.hide();
		})
			.first()
			.click();
	})();
});