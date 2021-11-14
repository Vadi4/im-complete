module.exports = function(){
	$.gulp.task('clean', function(cb) {
		if($.mode == 'plugin') {
			return $.del('plugin', cb);
		} else {
			return $.del('build', cb);
		}
	});
}