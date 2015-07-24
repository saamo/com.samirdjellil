var gulp = require('gulp'),
		autoprefixer = require('gulp-autoprefixer'),
		clean = require('gulp-clean'),
		concat = require('gulp-concat'),
		cssCacheBust = require('gulp-css-cache-bust'),
		gutil = require('gulp-util'),
		imagemin = require('gulp-imagemin'),
		jshint = require('gulp-jshint'),
		pngquant = require('imagemin-pngquant'),
		sourcemaps = require('gulp-sourcemaps');

var files = {
	'input': {
		'css': 'src/css/**/*.css',
		'img': 'src/img/**/*',
		'js': 'src/js/**/*.js'
	},
	'output': {
		'css': 'public/assets/css',
		'img': 'public/assets/img',
		'js': 'public/assets/js'
	}
};

gulp.task('default', ['watch']);

gulp.task('watch', function() {
	gulp.watch(files.input.css, ['build-css']);
	gulp.watch(files.input.img, ['build-img']);
	gulp.watch(files.input.js, ['jshint', 'build-js']);
});

gulp.task('clean', function() {
	return gulp.src('public/assets', {read: false})
		.pipe(clean());
});

gulp.task('build-css', function() {
	return gulp.src(files.input.css)
		.pipe(cssCacheBust())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest(files.output.css));
});

gulp.task('build-img', function() {
	return gulp.src(files.input.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(files.output.img));
});

gulp.task('jshint', function() {
	return gulp.src(files.input.js)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-js', function() {
	return gulp.src(files.input.js)
		.pipe(sourcemaps.init())
		.pipe(concat('bundle.js'))
		.pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(files.output.js));
});
