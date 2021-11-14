import {slideUp, slideDown, slideToggle, simulateClick, getSiblings} from './base.js';
// import { tns } from "../../bower_components/tiny-slider/src/tiny-slider";

let ready = (callback) => {
	if (document.readyState != "loading") callback();
	else document.addEventListener("DOMContentLoaded", callback);

}

ready(() => {
});