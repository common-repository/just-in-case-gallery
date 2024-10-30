=== Just In Case Gallery ===
Contributors: line5
Donate link: 
Tags: gallery, lightbox, jquery
Requires at least: 3.5.1
Tested up to: 3.5.1
Stable tag: trunk
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

The plugin creates an image wall including a nicely animated gallery out of attachments to a post.

== Description ==

The plugin creates a nicely animated gallery out of attachments to a post. A demo is available at just-in-case.tv. All pictures are shown on a kind of image wall. Once one clicks on one of them, it opens in a kind of lightbox (fullscreen). Using the arrows on the right and left side, it is possible to display the next or previous picture. Previews of next and previous picture are available.
Since version 0.5, the plugin features individual facebook LIKE buttons for each picture in the gallery. 

Technically, it uses JQuery and needs Javascript to work. 

A demo installation is available at [just-in-case.tv].

To use it, just install the plugin, attach some images to a post and insert [just_in_case_gallery] into the post. It works best with the theme Twenty Twelve.

Have fun!

[just-in-case.tv]: http://just-in-case.tv
            "Embrace your grace ... and use the case! - Just in Case..."

== Installation ==

1. Upload the folder just-in-case-gallery to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. attach some images to a post and insert the following text (including brackets) into the post: [just_in_case_gallery]

== Frequently asked questions ==
= How to add the gallery? =
<ol>
<li>Edit the intended post. Click the "Add Media" button.</li>
<li>Ensure that on the left-hand side, "Insert Media" is selected.</li>
<li>Upload the images for the gallery. Afterwards, click the "Media Library" link.</li>
<li>Ensure that "Uploaded to this post" is selected in the little dropdown box. Only then, you can order the images.</li>
<li>Order the images (drag&drop). Add titles and captions, if you like.</li>
<li>Close the "Insert Media" popup.</li>
<li>Insert [just_in_case_gallery] into the post.</li>
</ol>
Tested with WordPress 3.5.1

= How to change the order of items? =
<ol>
<li>Edit the intended post. Click the "Add Media" button.</li>
<li>Ensure that on the left-hand side, "Insert Media" is selected.</li>
<li>Ensure that "Uploaded to this post" is selected in the little dropdown box. Only then, you can order the images.</li>
<li>Order the images (drag&drop). Add titles and captions, if you like.</li>
<li>There is no need to save data within the "Add Media" popup. Just close the "Insert Media" popup and publish your post.</li>
</ol>
Tested with WordPress 3.5.1

= How to activate the facebook Like button for each picure? =
<ol>
<li>In the admin backend, go to Settings > Just In Case Gallery.</li>
<li>If you use facebook Like buttons within your blog already, it should be sufficient to set the first setting to "1". Otherwise, set both settings to "1".</li>
<li>Press "Save". Enjoy.</li>
</ol>
Tested with WordPress 3.5.1

== Screenshots ==

1. Image wall
2. Lightbox 


== Changelog ==

<ul>
<li>0.5 - Optionally display facebook Like button for each picture</li>
<li>0.42 - Activation of the "to full-size picture page" link</li>
<li>0.41 - Re-Activation of Non-Javascript alternative</li>
<li>0.4 - Works now with multiple galleries on one page.</li>
<li>0.3 - Initial creation</li>
</ul>


== Upgrade notice ==


