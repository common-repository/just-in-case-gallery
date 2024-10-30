<?php
class justInCaseOptions{
	public function __construct(){
		if(is_admin()){
			add_action('admin_menu', array($this, 'add_plugin_page'));
			add_action('admin_init', array($this, 'page_init'));
		}
	}

	public function add_plugin_page(){
		// This page will be under "Settings"
		add_options_page('Just In Case Gallery', 'Just In Case Gallery', 'manage_options', 'test-setting-admin', array($this, 'create_admin_page'));
	}

	public function create_admin_page(){
		echo '
				<div class="wrap">
				';
		screen_icon();
		echo '
				<h2>Just In Case Gallery Settings</h2>
				<form method="post" action="options.php">
				';
		// This prints out all hidden setting fields
		settings_fields('just_in_case_gallery_option_group');
		do_settings_sections('test-setting-admin');
		submit_button();
		echo '</form>
				</div>';
	}

	public function page_init(){
		register_setting('just_in_case_gallery_option_group', 'array_key', array($this, 'check_FB_On'));

		add_settings_section(
		'setting_section_id',
		'Facebook Like Integration',
		array($this, 'print_section_info'),
		'test-setting-admin'
				);

		add_settings_field(
		'just_in_case_gallery_fb_on',
		'Facebook Like for each picture (1 = on, 0 = off)',
		array($this, 'create_fb_on_field'),
		'test-setting-admin',
		'setting_section_id'
				);
		add_settings_field(
		'just_in_case_gallery_fb_include_base',
		'Include facebook JavaScript Base (1 = on, 0 = off)',
		array($this, 'create_fb_js_on_field'),
		'test-setting-admin',
		'setting_section_id'
				);
	}

	public function check_FB_On($input){
		echo "######";
		print_r($input);
		if(is_numeric($input['just_in_case_gallery_fb_on'])){
			$mid = $input['just_in_case_gallery_fb_on'];
			if(get_option('just_in_case_gallery_fb_on') === FALSE){
				add_option('just_in_case_gallery_fb_on', $mid);
			}else{
				update_option('just_in_case_gallery_fb_on', $mid);
			}
		}else{
			$mid = '';
		}
		if(is_numeric($input['just_in_case_gallery_fb_include_base'])){
			$mid = $input['just_in_case_gallery_fb_include_base'];
			if(get_option('just_in_case_gallery_fb_include_base') === FALSE){
				add_option('just_in_case_gallery_fb_include_base', $mid);
			}else{
				update_option('just_in_case_gallery_fb_include_base', $mid);
			}
		}else{
			$mid = '';
		}
		return $mid;
	}

	public function print_section_info(){
		print 'If you want want to use Facebook, set both values to "1".';
	}

	public function create_fb_on_field(){
		echo '<input
				type="text" id="just_in_case_gallery_fb_on"
				name="array_key[just_in_case_gallery_fb_on]"
				value="'.get_option('just_in_case_gallery_fb_on', 0).'" />';
	}
	
	public function create_fb_js_on_field(){
		echo '<input
				type="text" id="just_in_case_gallery_fb_include_base"
				name="array_key[just_in_case_gallery_fb_include_base]"
				value="'.get_option('just_in_case_gallery_fb_include_base', 0).'" />';
	}
}

$justInCaseOptions = new justInCaseOptions();
