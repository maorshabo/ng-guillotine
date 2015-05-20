var gulp = require('gulp');
var plugins = require("gulp-load-plugins")({lazy:false});
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

gulp.task('scripts', function(){
    //combine all js files of the app
    gulp.src(['!./app/**/*_test.js','./app/**/*.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.concat('app.js'))
        .pipe(gulp.dest('./demo'));
});

gulp.task('buildDirective:js', function(){
    //combine all js files of the app
    gulp.src(['./src/**/*.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(uglify())
        .pipe(plugins.concat('ng-guilliotine.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('buildDirective:css',  function () {
    return gulp.src('src/**/*.scss')
        .pipe(plugins.rubySass({style: 'expanded'}))
        .pipe(minifyCss())
        .pipe(plugins.concat('ng-guilliotine.min.css'))
        .pipe(gulp.dest('./dist'))
});

gulp.task('templates',function(){
    //combine all template files of the app into a js file
    gulp.src(['!./app/index.html',
        './src/**/*.html'])
        .pipe(plugins.angularTemplatecache('templates.js',{standalone:true}))
        .pipe(gulp.dest('./demo'));
});

gulp.task('css', function(){
    gulp.src('./app/**/*.css')
        .pipe(plugins.concat('app.css'))
        .pipe(gulp.dest('./demo'));
});

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    return gulp.src('app/index.html')
        .pipe(wiredep({
            directory: 'bower_components',
            exclude: [/bootstrap-sass-official/, /bootstrap.js/, /bootstrap.css/]
        }))
        .pipe(gulp.dest('app'));
});


/*gulp.task('vendorJS', function(){
    //concatenate vendor JS files
    gulp.src(['!./bower_components/!**!/!*.js', './bower_components/!**!/!*.min.js'])
        .pipe(plugins.concat('lib.js'))
        .pipe(gulp.dest('./demo'));
});*/

gulp.task('vendorCSS', function(){
    //concatenate vendor CSS files
    gulp.src(['!./bower_components/**/*.min.css',
        './bower_components/**/*.css'])
        .pipe(plugins.concat('lib.css'))
        .pipe(gulp.dest('./demo'));
});

gulp.task('copy-htmls', function() {
    gulp.src('./app/**/*.html')
        .pipe(gulp.dest('./demo'));
});

gulp.task('watch',function(){
    gulp.watch([
        'build/**/*.html',
        'build/**/*.js',
        'build/**/*.css'        
    ], function(event) {
        return gulp.src(event.path)
            .pipe(plugins.connect.reload());
    });
    gulp.watch(['./app/**/*.js','./src/**/*.js','!./app/**/*test.js'],['scripts']);
    gulp.watch(['!./app/index.html','./app/**/*.html'],['copy-htmls']);
    gulp.watch('./app/**/*.css',['css']);
    gulp.watch('./app/index.html',['copy-htmls']);

});

gulp.task('copy-bower-components', function () {
    gulp.src('./bower_components/**')
        .pipe(gulp.dest('build/bower_components'));
});

gulp.task('connect', plugins.connect.server({
    root: ['build'],
    port: 9000,
    livereload: true
}));

gulp.task('default',['connect','scripts','buildDirective','templates','css','styles','copy-htmls','wiredep','vendorCSS','watch','copy-bower-components']);
gulp.task('buildDirective',['buildDirective:js','buildDirective:css']);