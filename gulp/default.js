'use strict';

global.$ = {
	gulp: require('gulp'),
	del: require('del'),
	connect: require('gulp-connect'),
	pug: require('gulp-pug'),
	plumber: require('gulp-plumber'),
	changed: require('gulp-changed'),
	plugins: require('../source/plugins.js'),
	path: require('path'),
	fs: require('fs'),
	order: require('gulp-order'),
	concat :require('gulp-concat'),
	uglify: require('gulp-uglify-es').default,
	cleanCSS: require('gulp-clean-css'),
	imagemin: require('gulp-imagemin'),
	spritesmith: require('gulp.spritesmith'),
	rename: require('gulp-rename'),
	stylus: require('gulp-stylus'),
	mmq: require('gulp-merge-media-queries'),
	csso: require('gulp-csso'),
	autoprefixer: require('gulp-autoprefixer'),
	ttf2woff2: require('gulp-ttf2woff2'),
	rollup: require('gulp-better-rollup'),
	babel: require('rollup-plugin-babel'),
	resolve: require('rollup-plugin-node-resolve'),
	commonjs: require('rollup-plugin-commonjs'),

	pathTasks: {
		tasks: require('../gulp/tasks.js')
	},

	mode: 'dev'

};

$.pathTasks.tasks.forEach(function(taskPath) {
	require(taskPath)();
});

$.gulp.task('config', function(cb) {
	global.$.mode = 'plugin';
	cb();
});

$.gulp.task('default',
	$.gulp.series('clean',
	$.gulp.parallel('watch', 'connect', 'pug', 'bower', 'copy', 'sprite', 'svgSprite', 'stylus', 'javascript', 'ttf2woff2')
));

$.gulp.task('plugin',
	$.gulp.series('config',
	$.gulp.parallel('clean', 'connect', 'stylus', 'javascript')
));

