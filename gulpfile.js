var
	gulp = require('gulp'),
	gulpsync = require('gulp-sync')(gulp),
	rimraf = require('gulp-rimraf'),
	scss = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	connect = require('gulp-connect'),
	plumber = require('gulp-plumber'),
	zip = require('gulp-zip'),
	watch = require('gulp-watch');

	var staticResources = [
		'production/assets/**/*',
		'scss/**/*',
		'.bowerrc',
		'.gitignore',
		'gulpfile.js',
		'package.json'
	];

	gulp.task('connect', function() {
		connect.server ({
			port: 8080,
			livereload: true,
		});
	});

	gulp.task('html', function () {
		gulp.src('production/**/*.html')
			.pipe(plumber())
			.pipe(connect.reload());
	});

	gulp.task('scss', function () {
		return scss(['scss/app.stylesheets.scss'], { 
			sourcemap: true,
			style: 'compact',
			compass: true
			})
			.pipe(sourcemaps.init())
			.pipe(plumber())
			.pipe(autoprefixer({
					browsers: ['last 10 versions', '> 1%', 'ie 8', 'ie 9', 'ie 10', 'ie 11'],
					cascade: false
				}))
			.pipe(sourcemaps.write('maps', {
				includeContent: false,
				sourceRoot: 'source'
			}))
			.pipe(connect.reload())
			.pipe(gulp.dest('production/assets/stylesheets/'));
	});

	gulp.task('archive', function () {
		return gulp.src(
			staticResources,
			{ base:'.'})
			.pipe(zip('CPT_assets.zip', {compress: true}))
			.pipe(gulp.dest('./'));
	});

	gulp.task('copy', function(){
		return gulp.src(staticResources, { base:'.'})
			.pipe(gulp.dest('C:\\Maven\\Medtronic CPT Portal\\resource-bundles\\CPT_assets.resource\\'));
	});

	gulp.task('watch', function() {
		gulp.watch('production/**/*.html', ['html']);
		gulp.watch('scss/**/*', gulpsync.sync(['scss', 'archive', 'copy']));
		gulp.watch('production/assets/images/**/*', ['archive', 'copy']);
		gulp.watch('production/assets/vendor/**/*', ['archive', 'copy']);
		gulp.watch('production/assets/javascripts/**/*', ['archive', 'copy']);
	});
	gulp.task('default', gulpsync.sync([
		[
			'html',
			'scss',
			'connect'
		],
		'archive',
		'copy',
		'watch'
	]));