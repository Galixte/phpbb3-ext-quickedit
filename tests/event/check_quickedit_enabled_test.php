<?php

use phpbb\language\language;
use phpbb\language\language_file_loader;

/**
*
* @package Quickedit
* @copyright (c) 2014 Marc Alexander ( www.m-a-styles.de )
* @license http://opensource.org/licenses/gpl-2.0.php GNU General Public License v2
*
*/

class check_quickedit_enabled_test extends \marc\quickedit\tests\event\listener_test_base
{
	public function setUp()
	{
		global $phpbb_root_path, $phpEx;

		parent::setUp();

		$this->language = new language(new language_file_loader($phpbb_root_path, $phpEx));
		$this->user = $this->getMock('\phpbb\user', array('add_lang_ext'), array($this->language, '\phpbb\datetime'));
		$this->user->data = array(
			'is_registered' => true,
			'user_id'	=> 2,
		);
		$this->auth = $this->getMock('\phpbb\auth\auth', array('acl_get'));
		$this->auth->expects($this->any())
			->method('acl_get')
			->with($this->anything())
			->will($this->returnValue(true));

		$this->template->expects($this->any())
			->method('assign_var')
			->with('S_QUICK_EDIT');
		$this->config = new \phpbb\config\config(array('allow_quick_edit' => true));
		$this->setup_listener();
	}

	public function test_check_quickedit_enabled()
	{
		$data = new \phpbb\event\data(array(
			'forum_id'	=> 1,
			'topic_data'	=> array(
				'forum_flags'	=> 128,
			),
		));

		$this->assertNull($this->listener->check_quickedit_enabled($data));
	}
}
