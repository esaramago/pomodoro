const gulp = require('gulp');
const webserver = require('gulp-webserver');


function defaultTask(cb) {
  	gulp.src('app')
	    .pipe(webserver({
	        livereload: false,
	        directoryListing: true,
	        open: true,
	        fallback: 'index.html'
	    }));
  	cb();
}

exports.default = defaultTask;