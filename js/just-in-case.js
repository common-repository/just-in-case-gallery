/*
 *  Project: just-in-case Gallery (Wordpress Plugin)
 *  Description:
 *  Author: Line5 e.K.
 *  Version: 0.42
 *  License:
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;
(function($, window, document, undefined) {
	var myObj = null;
	var maxPic = 0;
	var myGalleryOnPage = null;
	var jicgMyCurrentPic = 1;
	var overNextImageWidth = 0;
	var overNextImageHeight = 0;
	var nextImageWidth = 0;
	var nextImageHeight = 0;
	var overPrevImageWidth = 0;
	var overPrevImageHeight = 0;
	var prevImageWidth = 0;
	var prevImageHeight = 0;
	var canTurnRight = true;
	var preloadImage = '/wp-content/plugins/just-in-case-gallery/img/preloader.gif';
	// var preloadImage = 'uploads/preloader.gif';
	var firstPic = true;
	var thumbLeftPos = 0;
	var thumbTopPos = 0;
	var screenWidth = 0;
	var screenHeight = 0;
	var aniSpeed = 800;
	var centrScreenH = 0;
	var centrScreenV = 0;
	var thumbWidth = 50;
	var nextLoading = false;
	var imageHeight = new Array();
	var imageWidth = new Array();
	var imagePageLink = new Array();
	var hoverSpeed = 200;
	var arrowTopPos = 0;
	var gal;

	// undefined is used here as the undefined global variable in ECMAScript 3
	// is
	// mutable (ie. it can be changed by someone else). undefined isn't really
	// being
	// passed in so we can ensure the value of it is truly undefined. In ES5,
	// undefined
	// can no longer be modified.

	// window and document are passed through as local variable rather than
	// global
	// as this (slightly) quickens the resolution process and can be more
	// efficiently
	// minified (especially when both are regularly referenced in your plugin).

	// Create the defaults once
	var justInCaseGallery = "justInCaseGallery", defaults = {};

	// The actual plugin constructor
	function Plugin(element, options) {
		this.element = element;
		// jQuery has an extend method which merges the contents of two or
		// more objects, storing the result in the first object. The first
		// object
		// is generally empty as we don't want to alter the default options for
		// future instances of the plugin
		this.options = $.extend({}, defaults, options);

		this._defaults = defaults;
		this._name = justInCaseGallery;

		this.init();
	}

	Plugin.prototype = {

		init : function() {
			// Place initialization logic here
			// You already have access to the DOM element and
			// the options via the instance, e.g. this.element
			// and this.options
			// you can add more functions like the one below and
			// call them like so: this.yourOtherFunction(this.element,
			// this.options).
			// this.yourOtherFunction(this.element, this.options);

			myGalleryOnPage = this.options['myGalleryOnPage'];
			this.initialiseEvents();

			this.switchMeOn(this.options['currentPic']);
		},
		initialiseEvents : function() {
			/**
			 * event handling for mouseclicks
			 */
			var that = this;
			// close button closes lightbox
			$('.jicg-icon-close').click(function() {
				that.switchMeOff();
			});
			// click on right preview image shows next picture
			$('.jicg-main').delegate('.lPicCVis', 'click', function() {
				that.giveMeTheNextOne(1);
			});
			$('.jicg-main').delegate('.lPicB', 'click', function() {
				that.giveMeTheNextOne(1);
			});
			// click somewhere in the right 30% of the browser window shows next
			// picture.
			$('.clickAreaRight').bind('click', function() {
				that.giveMeTheNextOne(1);
			});
			// click on the left preview image shows previous picture
			$('.jicg-main').delegate('.lPicEVis', 'click', function() {
				that.giveMeTheNextOne(-1);
			});
			$('.jicg-main').delegate('.lPicD', 'click', function() {
				that.giveMeTheNextOne(-1);
			});
			// click somewhere in the left 30% of the browser window shows
			// previous
			// picture.
			$('.clickAreaLeft').bind('click', function() {
				that.giveMeTheNextOne(-1);
			});
			// ensure that clicking a picture in the image wall does not invoke
			// the
			// underlying link. this is important, because that link refers to
			// the
			// attachment page - for people who have not enabled javascript.
			$('.jicg-thumbs li').hover(function() {
				$(this).children("a").click(function() {
					return false;
				})
			})
			$('.clickAreaRight')
					.bind(
							'mouseover',
							function() {
								$('.icon-right').stop(0, 0);
								$('.icon-right')
										.attr('src',
												'/wp-content/plugins/just-in-case-gallery/img/arrow-right-hover.png');
								$('.icon-right').animate({
									width : 60,
									right : 60,
									top : arrowTopPos - 4
								}, hoverSpeed);
							});
			$('.clickAreaRight')
					.bind(
							'mouseout',
							function() {
								$('.icon-right').stop(0, 0);
								$('.icon-right')
										.attr('src',
												'/wp-content/plugins/just-in-case-gallery/img/arrow-right.png');
								$('.icon-right').animate({
									width : 50,
									right : 65,
									top : arrowTopPos
								}, hoverSpeed);
							});
			$('.clickAreaLeft')
					.bind(
							'mouseover',
							function() {
								$('.icon-left').stop(0, 0);
								$('.icon-left')
										.attr('src',
												'/wp-content/plugins/just-in-case-gallery/img/arrow-left-hover.png');
								$('.icon-left').animate({
									width : 60,
									left : 60,
									top : arrowTopPos - 4
								}, hoverSpeed);
							});
			$('.clickAreaLeft')
					.bind(
							'mouseout',
							function() {
								$('.icon-left').stop(0, 0);
								$('.icon-left')
										.attr('src',
												'/wp-content/plugins/just-in-case-gallery/img/arrow-left.png');
								$('.icon-left').animate({
									width : 50,
									left : 65,
									top : arrowTopPos
								}, hoverSpeed);
							});
			$('.jicg-icon-close')
					.bind(
							'mouseover',
							function() {
								$('.jicg-icon-close').stop(0, 0);
								$('.jicg-icon-close')
										.attr('src',
												'/wp-content/plugins/just-in-case-gallery/img/icon-close-hover.png');
								$('.jicg-icon-close').animate({
									width : 50,
									right : 0,
									top : 25
								}, hoverSpeed);
							});
			$('.jicg-icon-close')
					.bind(
							'mouseout',
							function() {
								$('.jicg-icon-close').stop(0, 0);
								$('.jicg-icon-close')
										.attr('src',
												'/wp-content/plugins/just-in-case-gallery/img/icon-close.png');
								$('.jicg-icon-close').animate({
									width : 40,
									right : 5,
									top : 30
								}, hoverSpeed);
							});

			/**
			 * catch keyboard inputs.
			 */

			$(document).keyup(function(e) {
				if (e.which == 27) {
					// Escape closes the lightbox.
					that.switchMeOff();
				} else if (e.which == 39) {
					// Right arrow key proceeds to next picture.
					that.giveMeTheNextOne(1);
				} else if (e.which == 37) {
					// Left arrow key returns to previous picture.
					that.giveMeTheNextOne(-1);
				}
			});

		},

		/**
		 * opens the fullscreen lightbox, displaying the picture # picnr
		 */
		switchMeOn : function(picnr) {
			// the animation for the first picture is different from other
			// pictures.
			// hence, we need a variable to determine that we have the first
			// picture
			// in the process here.
			firstPic = true;

			// figure out screen sizes and some basic data...
			this.initL5Gallery();

			// we pretend displaying the previous picture at the moment.
			// this trick allows us to use our standard picture loading
			// procedures for loading the first picture.
			jicgMyCurrentPic = picnr - 1;
			if (jicgMyCurrentPic == 0) {
				// if user clicked on the first picture in the gallery,
				// previous picture is the last one of the gallery.
				jicgMyCurrentPic = maxPic;
			}
			// display the lightbox background (usually black, fullscreen)
			$('.jicg-lbx').fadeIn();

			// position the images, determine start positions for
			// preloaders and animations
			$('.lPicA').css({
				width : '35px',
				height : '35px',
				top : centrScreenV,
				left : centrScreenH
			});
			$('.lPicB').css({
				visibility : 'hidden'
			});
			// show preloaders
			$('.lPicA').attr('src', preloadImage);
			$('.lPicB').attr('src', preloadImage);
			$('.lPicC').attr('src', preloadImage);
			// preload images. after preloading, images will
			// automatically be displayed.
			this.preloadFirstImage(this.getPicUrl(picnr), this
					.getPicUrl(jicgMyCurrentPic), picnr, jicgMyCurrentPic);
		},

		/**
		 * closes and hides the lightbox
		 */
		switchMeOff : function() {
			$('.jicg-lbx').fadeOut();
		},

		/**
		 * initialize sizes
		 */
		initL5Gallery : function() {

			maxPic = myGalleryOnPage.children('ul').children('li').length;

			// store screen width and height in global vars
			screenHeight = parseInt($(window).height());
			screenWidth = parseInt($(window).width());
			// store 35px-width preloader position in global vars
			centrScreenH = Math.round(parseInt($(window).width()) / 2 - 35 / 2);
			centrScreenV = Math
					.round(parseInt($(window).height()) / 2 - 35 / 2);
			// determine position of the right thumb: 55 pix left of right end
			// of
			// the world,
			// and about vertical center of screen. Determine width of
			// preview-thumbnails.
			thumbLeftPos = $(window).width() - 55;

			thumbTopPos = Math.round($(window).height() / 2) - 20;
			thumbWidth = 50;

			// positioning of arrows
			arrowTopPos = Math.round(screenHeight / 2 - 35);
			$('.icon-right').css({
				right : 65,
				top : arrowTopPos,
				width : 50
			});
			$('.icon-left').css({
				left : 65,
				top : arrowTopPos,
				width : 50
			});
		},

		/**
		 * show next - or previous - picture direction = 1 >> show next picture
		 * direction = -1 >> show previous picture
		 */
		giveMeTheNextOne : function(direction) {
			if (canTurnRight == true && nextLoading == false) {
				canTurnRight = false;
				nextLoading = true;

				this.initL5Gallery();

				// determine the id and path of the next picture
				nextPic = jicgMyCurrentPic + 1;
				if (nextPic > maxPic) {
					nextPic = 1;
				}
				nextPicSrc = this.getPicUrl(nextPic);

				// determine the id and path of the picture after the next
				// picture
				overNextPic = nextPic + 1;
				if (overNextPic > maxPic) {
					overNextPic = 1;
				}
				overNextPicSrc = this.getPicUrl(overNextPic);

				// determine the id and path of the previous picture
				prevPic = jicgMyCurrentPic - 1;
				if (prevPic < 1) {
					prevPic = maxPic;
				}
				prevPicSrc = this.getPicUrl(prevPic);

				// determine the id and path of the picture before the previous
				// picture
				overPrevPic = prevPic - 1;
				if (overPrevPic < 1) {
					overPrevPic = maxPic;
				}
				overPrevPicSrc = this.getPicUrl(overPrevPic);
				// determine starting position of infading picture
				if (direction == 1) { // forward
					$('.lPicB').attr('src', nextPicSrc);
					if (firstPic == true) {
						// center and prepare for preloader
						$('.lPicB').css({
							'left' : thumbLeftPos,
							'width' : 35,
							'top' : Math.round(screenHeight / 2 - 17.5),
							'left' : Math.round(screenWidth / 2 - 17.5)
						});
					} else {
						// set to the right hand side, where the thumbnail is
						$('.lPicB').css({
							'left' : thumbLeftPos,
							'width' : thumbWidth,
							'top' : thumbTopPos
						});
					}
				} else { // rewind
					$('.lPicD').attr('src', prevPicSrc);
					// set to the left hand side, where the thumbnail is
					$('.lPicB').css({
						'left' : 5,
						'width' : thumbWidth,
						'top' : thumbTopPos
					});
				}

				// show preloader on the right/left side of the screen
				if (direction == 1) { // forward
					$('.lPicCVis').attr('src', preloadImage);
					$('.lPicCVis').css({
						left : thumbLeftPos,
						width : 35,
						top : thumbTopPos
					});
				} else { // rewind
					$('.lPicEVis').attr('src', preloadImage);
					$('.lPicEVis').css({
						left : 5,
						width : 35,
						top : thumbTopPos
					});
				}

				// buffer image size
				nextImageWidth = overNextImageWidth;
				nextImageHeight = overNextImageHeight;
				prevImageWidth = overPrevImageWidth;
				prevImageHeight = overPrevImageHeight;

				/* calculate max dimensions of the image */
				if (direction == 1) { // forward
					incomingPictureId = nextPic;
				} else { // rewind
					incomingPictureId = prevPic;
				}
				thisPicWidth = imageWidth[incomingPictureId];
				thisPicHeight = imageHeight[incomingPictureId];
				thisPicRatio = thisPicWidth / thisPicHeight;
				thisPicNewWidth = Math.round(screenHeight * thisPicRatio);
				thisPicNewLeftPos = Math.round(screenWidth / 2
						- thisPicNewWidth / 2);

				// alert("incoming: " + incomingPictureId + ", orig: " +
				// thisPicWidth + "x" + thisPicHeight + ", w: " +
				// thisPicNewWidth +
				// " h: " + screenHeight);

				// start preloading the next but one picture
				// when this finished loading, it slides in from the right-hand
				// side.
				// #lPicCVis / #lPicEVis is used for this.
				if (direction == 1) { // forward
					this.preloadMyImage(overNextPicSrc, 1, overNextPic);
				} else { // rewind
					this.preloadMyImage(overPrevPicSrc, -1, overPrevPic);
				}

				if (firstPic == false) {
					if (direction == 1) { // forward

						// set position of outfading container D according to
						// that
						// of presentation container A
						// and copy the image from A to D
						$('.lPicD').css({
							left : $('.lPicA').css('left'),
							width : $('.lPicA').css('width'),
							height : $('.lPicA').css('height'),
							top : $('.lPicA').css('top')
						});
						$('.lPicD').attr('src', $('.lPicA').attr('src'));
					} else { // rewind

						// set position of outfading container B according to
						// that
						// of presentation container A
						// and copy the image from A to B
						$('.lPicB').css({
							left : $('.lPicA').css('left'),
							width : $('.lPicA').css('width'),
							height : $('.lPicA').css('height'),
							top : $('.lPicA').css('top')
						});
						$('.lPicB').attr('src', $('.lPicA').attr('src'));
					}
				}

				/* move IN */
				if (direction == 1) { // forward
					// infading container B moves from the right side to the
					// center.
					$('.lPicB').css('visibility', 'visible');
					$('.lPicB').animate({
						left : thisPicNewLeftPos,
						width : thisPicNewWidth,
						top : '0px'
					}, aniSpeed, function() {
						// presentation container takes over image and final
						// style
						// of infading container B
						$('.lPicA').css({
							'top' : $('.lPicB').css('top'),
							'left' : $('.lPicB').css('left'),
							'width' : $('.lPicB').css('width'),
							'height' : $('.lPicB').css('height'),
							visibility : 'visible'
						});
						$('.lPicA').attr('src', $('.lPicB').attr('src'));
						// infading container B can return back to initial
						// position,
						// hide and wait there
						$('.lPicB').css('visibility', 'hidden');
						$('.lPicB').css({
							width : thumbWidth,
							left : thumbLeftPos,
							'top' : thumbTopPos
						});

						canTurnRight = true;
					});
				} else { // rewind
					// infading container D moves from the left side to the
					// center.
					$('.lPicD').css('visibility', 'visible');
					$('.lPicD').animate({
						left : thisPicNewLeftPos,
						width : thisPicNewWidth,
						top : '0px'
					}, aniSpeed, function() {
						// presentation container takes over image and final
						// style
						// of infading container D
						$('.lPicA').css({
							'top' : $('.lPicD').css('top'),
							'left' : $('.lPicD').css('left'),
							'width' : $('.lPicD').css('width'),
							'height' : $('.lPicD').css('height'),
							visibility : 'visible'
						});
						$('.lPicA').attr('src', $('.lPicD').attr('src'));
						// infading container D can return back to initial
						// position,
						// hide and wait there
						$('.lPicD').css('visibility', 'hidden');
						$('.lPicD').css({
							width : thumbWidth,
							left : 5,
							'top' : thumbTopPos
						});

						canTurnRight = true;
					});
				}

				/* move OUT */
				if (direction == 1) { // forward
					// container D takes over the picture from presentation
					// container A and moves to the left hand side
					if (firstPic == false) {
						$('.lPicD').css('visibility', 'visible');
					}
					$('.lPicA').css('visibility', 'hidden');
					$('.lPicD').css('height', 'auto'); // ensures that the
					// ratio of
					// the picture remains
					// correct
					$('.lPicD').animate({
						left : 5,
						width : 50,
						top : thumbTopPos
					}, aniSpeed, function() {
						// copy image from D to outmoving container EVis
						$('.lPicEVis').attr('src', $('.lPicD').attr('src'));
					});

					// container EVis moves from the left side of the screen to
					// the
					// left, out of the screen.
					if (firstPic == false) {
						$('.lPicEVis').css('left', 5);
						$('.lPicEVis').animate({
							left : -50
						});
					}
					jicgMyCurrentPic = nextPic;
				} else { // rewind
					// container B takes over the picture from presentation
					// container A and moves to the right hand side
					$('.lPicB').css('visibility', 'visible');

					$('.lPicA').css('visibility', 'hidden');
					$('.lPicB').css('height', 'auto'); // ensures that the
					// ratio of
					// the picture remains
					// correct
					$('.lPicB').animate({
						left : thumbLeftPos,
						width : 50,
						top : thumbTopPos
					}, aniSpeed, function() {
						// copy image from B to outmoving container CVis
						$('.lPicCVis').attr('src', $('.lPicB').attr('src'));

					});

					// container CVis moves from the right side of the screen to
					// the
					// right, out of the screen.
					$('.lPicCVis').css('left', thumbLeftPos);
					$('.lPicCVis').animate({
						left : screenWidth
					});
					jicgMyCurrentPic = prevPic;
				}
				var fblink = '<div class="fb-like" data-href="'+imagePageLink[jicgMyCurrentPic]+'" data-send="true" data-width="450" data-show-faces="false" data-colorscheme="dark"></div>';
				$('.fblink').html(fblink);
				$('.linkToPicPage').html(
						
						'<a href="' + imagePageLink[jicgMyCurrentPic]
								+ '">Original size...</a>');
				window.fbAsyncInit();

			}
			firstPic = false;
		},

		getPicUrl : function(picId) {
			src = $('.jicg-thumb-' + picId + ' img', myGalleryOnPage).attr(
					'src').replace('-150x150', '');
			src = src.replace('-150x304', '');
			src = src.replace('-304x150', '');
			imagePageLink[picId] = $('.jicg-thumb-' + picId + ' img',
					myGalleryOnPage).parent().attr('href');
			return src;
		},

		preloadImageLoaded : function(myimg, picid, srcpic, direction) {
			if (direction == 1) { // forward
				overNextImageWidth = myimg.width;
				overNextImageHeight = myimg.height;

				$('.lPicC').attr('src', srcpic);
				$('.lPicCVis').attr('src', srcpic);
				$('.lPicCVis').css({
					'width' : '50',
					'left' : screenWidth
				});
				$('.lPicCVis').animate({
					left : thumbLeftPos
				}, aniSpeed);
			} else {
				overPrevImageWidth = myimg.width;
				overPrevImageHeight = myimg.height;
				$('.lPicE').attr('src', srcpic);
				$('.lPicEVis').attr('src', srcpic);
				$('.lPicEVis').css({
					'width' : '50',
					'left' : -50
				});
				$('.lPicEVis').animate({
					left : 5
				}, aniSpeed);
			}
			imageHeight[picid] = myimg.height;
			imageWidth[picid] = myimg.width;
			nextLoading = false;
		},
		preloadMyImage : function(srcpic, direction, picid) {
			var myImg = new Image();
			var that = this;
			myImg.src = srcpic;
			myImg.onload = function() {
				that.preloadImageLoaded(myImg, picid, srcpic, direction);
			}

		},
		firstImageLoaded : function(myImg, picid, srcpic) {
			// myImg.src = srcpic;
			nextImageWidth = this.width;
			if (myImg.width == 0) {
				console.log("Error loading picture " + picid + " (" + srcpic
						+ ")");
			}
			// $(myImg).attr("src", srcpic);
			nextImageHeight = myImg.height;
			overNextImageWidth = myImg.width;
			overNextImageHeight = myImg.height;
			imageHeight[picid] = myImg.height;
			imageWidth[picid] = myImg.width;
			$('.lPicC').attr('src', srcpic);
			$('.lPicCVis').attr('src', srcpic);
			this.giveMeTheNextOne(1);
			nextLoading = false;
		},
		firstBackImageLoaded : function(myBackImg, prevpicid, srcbackpic) {
			// myBackImg.src = srcbackpic;
			if (myBackImg.width == 0) {
				console.log("Error loading picture " + prevpicid + " ("
						+ srcbackpic + "): " + myBackImg);
			}
			prevImageWidth = myBackImg.width;
			prevImageHeight = myBackImg.height;
			overPrevImageWidth = myBackImg.width;
			overPrevImageHeight = myBackImg.height;
			imageHeight[prevpicid] = myBackImg.height;
			imageWidth[prevpicid] = myBackImg.width;
			// alert(srcpic + " // " + nextImageWidth + " / " +
			// nextImageHeight);
			$('.lPicE').attr('src', srcbackpic);
			$('.lPicD').attr('src', srcbackpic);
			$('.lPicD').css('visibility', 'hidden');
			$('.lPicEVis').attr('src', srcbackpic);
			$('.lPicEVis').css({
				left : -50,
				width : '50',
				top : thumbTopPos
			});
			$('.lPicEVis').animate({
				left : 5
			}, aniSpeed);
		},
		preloadFirstImage : function(srcpic, srcbackpic, picid, prevpicid) {
			var myImg = new Image();
			$('.lPicCVis').attr('src', preloadImage);
			$('.lPicCVis').css({
				top : thumbTopPos,
				left : thumbLeftPos,
				width : 35
			});
			myImg.src = srcpic;
			var that = this;
			myImg.onload = function() {
				that.firstImageLoaded(myImg, picid, srcpic);
			};

			var myBackImg = new Image();
			$('.lPicEVis').attr('src', preloadImage);
			$('.lPicEVis').css({
				left : 5,
				top : thumbTopPos
			});
			myBackImg.src = srcbackpic;
			myBackImg.onload = function() {
				that.firstBackImageLoaded(myBackImg, prevpicid, srcbackpic);
			}
		}

	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[justInCaseGallery] = function(options) {
		myObj = null;
		myObj = new Plugin(this, options);

		return myObj;
	};

})(jQuery, window, document);

jQuery(document).ready(
		function() {
			jQuery('.just-in-case-gallery a').click(function() {
				return false;
			});
			jQuery('.jicg-thumbs li a img').click(
					function() {
						// figure out picture id
						jicgMyCurrentPic = jQuery(this).parent().parent().attr(
								'class').split('-')[2];
						jQuery('body').justInCaseGallery(
								{
									'myGalleryOnPage' : jQuery(this).parent()
											.parent().parent().parent(),
									'currentPic' : jicgMyCurrentPic
								});

					});

		});