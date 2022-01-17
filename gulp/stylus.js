module.exports = function(){
	$.gulp.task('stylus', function(cb) {

		var sourcePath = [];
		var buildPath = null;

		if($.mode == 'plugin') {
			sourcePath = ['source/stylus/plugin/index.styl'];
			buildPath = 'plugin/dist/css';
		} else {
			sourcePath = ['source/stylus/common/common.styl','source/stylus/common/critical.styl', 'source/stylus/common/grid.styl', 'source/stylus/plugin/index.styl'];
			buildPath = 'build/css';
		}

		$.gulp.src(sourcePath)
		.pipe($.stylus())
		.pipe($.mmq({
			log: true
		}))
		.pipe($.autoprefixer({
			cascade: false
		}))
		.pipe($.cleanCSS())
		.pipe($.rename({
			suffix: '.min'
		}))
		.pipe($.gulp.dest(buildPath))
		.pipe($.connect.reload());
		cb();
	});
}
