import {slideUp, slideDown, slideToggle, simulateClick, getSiblings} from './base.js';
import {imSearch} from './plugin/index.js';

let ready = (callback) => {
	if (document.readyState != "loading") callback();
	else document.addEventListener("DOMContentLoaded", callback);

}

ready(() => {

	const search = new imSearch(document.querySelector('.js-autocomplete'), {
		// searchTimeout: 1000
		// keyboardEvents: false
		// ajaxItems: false
		// dynamicAjax: false
		onInit() {
			console.log('event init');
		},
		onSelect() {
			console.log('event select');
		}
	});

	// search.destroy();

	const dynamicAjaxSearch = new imSearch(document.querySelector('.js-autocomplete-dynamic-ajax'), {
		dynamicAjax: true
	});	

	const ajaxSearch = new imSearch(document.querySelector('.js-autocomplete-ajax'), {
		ajaxItems: true
	});

});