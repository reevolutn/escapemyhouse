<?php

if(isset($_GET['doAction']) && $_GET['doAction'] == 'streetview') {
	header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache");

	$addr = $_GET['location'];

	$headers = get_headers('http://maps.googleapis.com/maps/api/streetview?size=640x320&location='.urlencode($addr).'&fov='.$_GET['fov'].'&sensor=true&key=AIzaSyCduIoLgwzxvZmOuUMNdabtm9DnPM_ZrRE');

	if($headers[6] == 'Content-Length: 8930') {
		$addr = $_GET['fallback1'];
		$headers = get_headers('http://maps.googleapis.com/maps/api/streetview?size=640x320&location='.urlencode($addr).'&fov='.$_GET['fov'].'&sensor=true&key=AIzaSyCduIoLgwzxvZmOuUMNdabtm9DnPM_ZrRE');
	}

	if($headers[6] == 'Content-Length: 8930') {
		$addr = $_GET['fallback2'];
		$headers = get_headers('http://maps.googleapis.com/maps/api/streetview?size=640x320&location='.urlencode($addr).'&fov='.$_GET['fov'].'&sensor=true&key=AIzaSyCduIoLgwzxvZmOuUMNdabtm9DnPM_ZrRE');
	}

	header('Content-type:image/jpeg');
	echo file_get_contents('http://maps.googleapis.com/maps/api/streetview?size=640x320&location='.urlencode($addr).'&fov='.$_GET['fov'].'&sensor=true&key=AIzaSyCduIoLgwzxvZmOuUMNdabtm9DnPM_ZrRE');
}

?>