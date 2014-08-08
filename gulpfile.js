
var gulp = require('gulp');
var harp = require('harp');
var prettify = require('gulp-prettify');
var cssbeautify= require('gulp-cssbeautify'),
		watch = require('gulp-watch'),
		connect = require('gulp-connect');
		
	




gulp.task('watch', function () {  
    gulp.watch(['./demos/*.*'], ['whtml']);  
});  

gulp.task('whtml', function () {  
    gulp.src('./dist/*.html')  
        .pipe(connect.reload());  
}); 

gulp.task('serve', function () {
  connect.server({
	root: './dist',
	port: 9000,
	livereload: true
  });
});


gulp.task('recover', function () {
  gulp.src('./demos/*.jade').pipe(watch(
      function(){ gulp.run('html');}
  )); 
});



gulp.task('html', function () {  
	harp.compile('./demos', './dist', function() {
		console.log(arguments);
	  return gulp.src('./dist/*.html')
		.pipe(prettify({indent_size: 4, indent_inner_html: true, wrap_line_length: 0}))
		.pipe(gulp.dest('./dist'));
	});
});

gulp.task('sw', ['serve', 'watch']);  