<?php 
	
	include_once('../php/videoStream.php');
	$stream = new VideoStream($_GET['url']);
	$stream->start();

?>