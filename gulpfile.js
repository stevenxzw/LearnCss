
var gulp = require('gulp');
var harp = require('harp');
var prettify = require('gulp-prettify');
var cssbeautify= require('gulp-cssbeautify'),
		watch = require('gulp-watch'),
        sass = require('gulp-sass'),
		connect = require('gulp-connect');
		
	




gulp.task('watch', function () {  
    gulp.watch(['./demos/*.*'], ['whtml']);  
});  

gulp.task('whtml', function (f) {
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


gulp.task('jade', ['serve', 'wjd', 'html']);

gulp.task('wjd', function(){

    gulp.watch(['./demos/*.*'], ['html']);

})

gulp.task('recover', function () {
      return gulp.src('./dist/*.html')
          .pipe(prettify({indent_size: 4, indent_inner_html: true, wrap_line_length: 0}))
          .pipe(gulp.dest('./dist'));
});



gulp.task('html', function () {  
	 harp.compile('./demos', './dist', function() {
         gulp.run('recover', 'whtml');
         return;
         return gulp.src('./dist/*.html')
             .pipe(prettify({indent_size: 4, indent_inner_html: true, wrap_line_length: 0}))
             .pipe(gulp.dest('./dist')) .pipe(connect.reload());
	});


});

gulp.task('sw', ['serve', 'watch']);

gulp.task('testrun', function(){
    gulp.start('sass', 'run2');
    console.log('in--testrun');
    return '';
});

gulp.task('run2', function(){
    console.log('in--run2');

})


gulp.task('sass', function () {
    /*
    var st = +new Date, flag = true;

    while(flag){
        var et = +new Date;
        if(et - st > 5000) flag = false;
    }
    console.log('after-while');
    */
  gulp.src('./demos/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist/css'))
});