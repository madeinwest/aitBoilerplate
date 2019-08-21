var syntax         = 'scss', // Syntax: sass or scss;
		gulpVersion    = '4'; // Gulp version: 3 or 4
		gmWatch        = false; // ON/OFF GraphicsMagick watching "img/_src" folder (true/false). Linux install gm: sudo apt update; sudo apt install graphicsmagick

var gulp          = require('gulp'),
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		browserSync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require('gulp-notify'),
		rsync         = require('gulp-rsync'),
		// newer        = require('gulp-newer'),
		// responsive   = require('gulp-responsive'),
		// imageResize   = require('gulp-image-resize'),
		// imagemin      = require('gulp-imagemin'),
		tinypng = require('gulp-tinypng-compress'),
		del           = require('del');

// Local Server
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	});
});

// Sass|Scss Styles
gulp.task('styles', function() {
	return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	// .pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream());
});

// JS
gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/bootstrap/bootstrap.min.js',
		'app/libs/lazy/jquery.lazy.min.js',
		'app/libs/lazy/jquery.lazy.plugins.min.js',
		'app/libs/wow/wow.min.js',
		'app/libs/fancybox/jquery.fancybox.min.js',
		// 'app/libs/slick/slick.min.js',
		'app/libs/owl/owl.carousel.min.js',
		'app/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }));
});
function bsReload(done) { browserSync.reload(); done(); };
// HTML Live Reload
gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }));
});

// Deploy
gulp.task('rsync', function() {
	return gulp.src('app/**')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}));
});
gulp.task('tinypng', function () {
	gulp.src('app/img/temp/**/*.{png,jpg,jpeg}')
			.pipe(tinypng({
					key: 'qx8vgnzGq0TrNc78kw2nN2s8RP0JFykL',
					sigFile: 'images/.tinypng-sigs',
					log: true
			}))
			.pipe(gulp.dest('app/img/dep'));
});
// gulp.task('img-responsive', async function() {
// 	return gulp.src('app/img/temp/**/*.{png,jpg,jpeg,webp,raw}')
// 		.pipe(responsive({
// 			'**/*': [{
// 				// Produce @1x images
// 				width: '50%', quality: 50
// 			}]
// 		})).on('error', function () { console.log('No matching images found') })
// 		.pipe(rename(function (path) {path.extname = path.extname.replace('jpeg', 'jpg')}))
// 		.pipe(gulp.dest('app/img/dep'))
// });
// gulp.task('img', gulp.series('img-responsive', bsReload));

// Clean @*x IMG's
gulp.task('cleanimg', function() {
	return del(['app/img/@*'], { force: true })
});

// If Gulp Version 4
if (gulpVersion == 4) {

	// Img Processing Task for Gulp 4
	// gulp.task('img', gulp.parallel('img1x', 'img2x'));

	gulp.task('watch', function() {
		gulp.watch('app/'+syntax+'/**/*.'+syntax+'', gulp.parallel('styles'));
		gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
		gulp.watch('app/*.html', gulp.parallel('code'));
		gmWatch && gulp.watch('app/img/temp/**/*', gulp.parallel('img')); // GraphicsMagick watching image sources if allowed.
	});
	gmWatch ? gulp.task('default', gulp.parallel('img', 'styles', 'scripts', 'browser-sync', 'watch')) 
					: gulp.task('default', gulp.parallel('styles', 'scripts', 'browser-sync', 'watch'));

};
