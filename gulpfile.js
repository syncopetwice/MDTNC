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

	gulp.task('clean', function() {
		return gulp.src('production/assets/css/**/*', { read: true })
			.pipe(rimraf());
	});

	gulp.task('scss', function () {
		return scss(['scss/app.stylesheets.scss'], { sourcemap: true, style: 'compact', compass: true})
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
			[
			'production/assets/css/**/*',
			'production/assets/images/**/*',
			'production/assets/js/**/*',
			'production/assets/vendor/**/*',
			'scss/**/*',
			'gulpfile.js',
			'package.json'
			],
			{ base:'.'})
			.pipe(zip('CPT.zip', {compress: true}))
			.pipe(gulp.dest('./'));
	});
	gulp.task('watch', function() {
		gulp.watch('production/**/*.html', ['html']);
		gulp.watch('scss/**/*', gulpsync.sync(['scss', 'archive']));
		gulp.watch('production/assets/images/**/*', ['archive']);
		gulp.watch('production/assets/vendor/**/*', ['archive']);
		gulp.watch('production/assets/js/**/*', ['archive']);
	});
	gulp.task('default', gulpsync.sync([
		// async
		[
			'html',
			'clean',
			'scss',
			'connect',
		],
		// sync 
		'archive',
		'watch'
	]));