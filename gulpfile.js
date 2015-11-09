var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('default', ['browser-sync', 'watch']);

gulp.task('browser-sync', function(){
	browserSync.init({
		server : {
			baseDir : '.'
		}
	})
});

gulp.task('watch', function(){
	gulp.watch(['*.html','js/*.js', 'css/*.css'],browserSync.reload);
});