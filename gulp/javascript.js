module.exports = function(){
	$.gulp.task('javascript', function(cb) {

		var sourcePath = null;
		var buildPath = null;

		if($.mode == 'plugin') {
			sourcePath = ['source/scripts/plugin/index.js'];
			buildPath = 'plugin/dist/js' 
		} else {
			sourcePath = ['source/scripts/client.js', 'source/scripts/plugin/index.js']; 
			buildPath = 'build/js' 
		}

		$.gulp.src(sourcePath)
			.pipe($.rollup({ plugins: [$.babel(), $.resolve(), $.commonjs()] }, 'umd'))
			.pipe($.plumber())
			.pipe($.uglify({
				mangle: {
					keep_fnames: true
				}
			}))
			.pipe($.rename({
				suffix: '.min'
			}))
			.pipe($.gulp.dest(buildPath))
		cb();
	});
};
