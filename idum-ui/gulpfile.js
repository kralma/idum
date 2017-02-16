var gulp = require('gulp');

var plugins = require('gulp-load-plugins')();
var fs = require('fs');
var streamqueue = require('streamqueue');
var stylish = require('jshint-stylish');
var minify = require('gulp-clean-css');

var localServer = require('./server.js');

gulp.task('build', function () {
    var tmpls = gulp.src('app/js/**/*.tmpl.html')
        .pipe(plugins.angularHtmlify())
        .pipe(plugins.angularTemplatecache({
            root: "idum",
            module: "app",
            standalone: false
        }));

    streamqueue.apply(streamqueue, [
        {objectMode: true},
        gulp.src('app/js/**/*.js')
            .pipe(plugins.plumber())
            .pipe(plugins.jshint())
            .pipe(plugins.jshint.reporter(stylish))
            .pipe(plugins.babel())
            .pipe(plugins.ngAnnotate())
    ].concat(tmpls))
        .pipe(plugins.replace(/\.(catch|finally|delete|class|continue|default)\(/g, '["$1"]('))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('app.js'))
        .pipe(gulp.dest('dist/'))
        .pipe(plugins.uglify())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('less', function () {
    var destination = "dist/css";
    gulp.src('less/main.less')
        .pipe(plugins.plumber())
        .pipe(plugins.less())
        .pipe(plugins.rename({basename: "main"}))
        .pipe(gulp.dest(destination))
        .pipe(minify({keepSpecialComments: 0}))
        .pipe(plugins.rename({
            basename: "main",
            suffix: '.min'
        }))
        .pipe(gulp.dest(destination));
});

gulp.task('default', function () {
    plugins.livereload.listen();
    // localServer.app.start();

    gulp.start(['build', 'less']);

    gulp.watch('app/**', ['build']);
    gulp.watch('app/less/**', ['less']);
});

gulp.task('libs', function () {
    var destination = "dist/";
    var projectDir = process.cwd();
    var libsDependencies = JSON.parse(fs.readFileSync(projectDir + '/libs-dependencies.json', {encoding: 'UTF-8'}));

    return gulp.src(libsDependencies)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('libs.js'))
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(destination));
});
