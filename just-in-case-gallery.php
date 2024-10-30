<?php
/*
 Plugin Name: Just-In-Case-Gallery
Plugin URI: http://wordpress.org/extend/plugins/just-in-case-gallery
Description: Creates a nice lightbox gallery
Author: Line5 e.K.
Version: 0.5
Author URI: http://www.line5.eu
*/

/*  Copyright 2013 Line5 e.K. (email : mail@line5.tv)

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License, version 2, as
published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

//----------------------------------------------------------------------
// Import Stylesheet
//----------------------------------------------------------------------

function add_stylesheets() {

	// change this path to load your own custom stylesheet
	$css_path = WP_PLUGIN_URL . '/just-in-case-gallery/just-in-case-gallery.css';

	// registers your stylesheet
	wp_register_style( 'justInCaseGalleryStyles', $css_path );

	// loads your stylesheet
	wp_enqueue_style( 'justInCaseGalleryStyles' );

	// Register and include the additional javascript:
	wp_register_script( 'justInCaseGallery', plugins_url( '/js/just-in-case.js', __FILE__ ), false, false, true);
	wp_enqueue_script('justInCaseGallery');
}

function add_justincase_image_sizes () {
	// this ensures that additional thumbnail sizes are being generated
	// automatically for uploaded pictures.
	add_theme_support( 'post-thumbnails' );
	add_image_size( 'bigthumba', 150, 304, true ); // Hard Crop Mode
	add_image_size( 'bigthumbb', 304, 150, true); // Hard Crop Mode
}

function add_justincase_lbx() {
	if (get_option('just_in_case_gallery_fb_include_base', '0') == 1) {
		add_justincase_fb();
	}
	$xout = '
			<div class="jicg-lbx" name="bla">
			<div class="jicg-main">
			<img src="" class="lPicA" alt="" />
			<img src="" class="lPicB" alt="" />
			<img src="" class="lPicC" alt="" />
			<img src="" class="lPicCVis" alt="" />
			<img src="" class="lPicD" alt="" />
			<img src="" class="lPicE" alt="" />
			<img src="" class="lPicEVis" alt="" />
			<img src="/wp-content/plugins/just-in-case-gallery/img/icon-close.png" alt="close" class="jicg-icon-close" />
			<img src="/wp-content/plugins/just-in-case-gallery/img/arrow-right.png" alt="next picture" class="icon-right" />
			<img src="/wp-content/plugins/just-in-case-gallery/img/arrow-left.png" alt="next picture" class="icon-left" />
			<div class="clickAreaRight"></div>
			<div class="clickAreaLeft"></div>
			<div class="linkToPicPage">Original Picture...</div>
			';
	if (get_option('just_in_case_gallery_fb_on', '0') == 1) {
		$xout .= '<div class="fblink"></div>';
	}
	$xout .= '</div>
			</div>
			';
	echo $xout;
}

function add_justincase_fb() {
	$xout .= "
			<div id='fb-root'></div>
			<script>
			window.fbAsyncInit = function() {
			// init the FB JS SDK
			FB.init({
			appId      : '459792237424401', // App ID from the App Dashboard
			channelUrl : '//just-in-case.tv/channel.html', // Channel File for x-domain communication
			status     : true, // check the login status upon init?
			cookie     : true, // set sessions cookies to allow your server to access the session?
			xfbml      : true  // parse XFBML tags on this page?
});
};
			(function (d, debug) {
			var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
			if (d.getElementById(id)) { return; }
			js = d.createElement('script'); js.id = id; js.async = true;
			js.src = '//connect.facebook.net/en_US/all' + (debug ? '/debug' : '') + '.js';
			ref.parentNode.insertBefore(js, ref);
} (document, /*debug*/false));
			</script>
			";
	echo $xout;
}

// Only add the stylesheet if we are NOT on the admin screen
if (!is_admin()) add_action( 'wp_enqueue_scripts', 'add_stylesheets' );


add_action('admin_init', 'add_justincase_image_sizes');
add_action('wp_footer', 'add_justincase_lbx');

//---------------------------------------------------------------------------------------
// Enqueue jQuery from Google
//---------------------------------------------------------------------------------------

function enqueue_jquery() {

	wp_enqueue_script('jquery');

}

// Only add the javascript if we are NOT on the admin screen
add_action("wp_enqueue_scripts", "enqueue_jquery", 11);

// Include options for this plugin
include_once( plugin_dir_path(__FILE__)."options.php");

//-------------------------------------------------------------
// Just In Case Image Gallery by Line5 e.K.
//-------------------------------------------------------------

function just_in_case_gallery() {

	global $post;

	$imgpath = WP_PLUGIN_URL . '/just-in-case-gallery/img/';
	$args = array(
			'post_parent'    => $post->ID,			// For the current post
			'post_type'      => 'attachment',		// Get all post attachments
			'post_mime_type' => 'image',			// Only grab images
			'order'			 => 'ASC',				// List in ascending order
			'orderby'        => 'menu_order',		// List them in their menu order
			'numberposts'    => -1, 				// Show all attachments
			'post_status'    => null,				// For any post status
	);

	// Retrieve the items that match our query; in this case, images attached to the current post.
	$attachments = get_posts($args);

	if ($attachments) {
		$count = 0;
		foreach ($attachments as $attachment) {
				if($count == 0) { ?>

<div class="just-in-case-gallery">
	<ul class="jicg-thumbs">
		<?php } ?>
		<li class="jicg-thumb-<?php echo $count+1; ?>"><?php if ($count==0) {

			// If this is the first thumbnail, add a class of 'selected' to it so it will be highlighted
			$thumb_attr = array(
										'class' => "thumbx selected",
									);

		} else {

									// For all other thumbnails, just add the basic class of 'thumb'
									$thumb_attr = array(
										'class' => "thumbx",
									);

								} ?> <?php
								$pagelink = get_attachment_link($attachment->ID);
								echo '<a href="'.$pagelink.'">';
								if ($count == 0) {
								echo wp_get_attachment_image($attachment->ID, 'bigthumba', false, $thumb_attr);
							    } elseif ($count == 2) {
								echo wp_get_attachment_image($attachment->ID, 'bigthumbb', false, $thumb_attr);
							    } else {
									if ($count%7 == 0) {
											echo wp_get_attachment_image($attachment->ID, 'bigthumbb', false, $thumb_attr);
									} else {
										echo wp_get_attachment_image($attachment->ID, 'thumbnail', false, $thumb_attr);

									}
							    }
							    echo '</a>';
							    ?>
		</li>
		<?php $count = $count + 1; 
} ?>
	</ul>

</div>

<?php }

}

// Create the Shortcode
add_shortcode('just_in_case_gallery', 'just_in_case_gallery');

?>