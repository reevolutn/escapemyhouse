<?php $base = str_replace('index.php', '', $_SERVER['REQUEST_URI']); ?>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html" charset="utf-8"/>
	<meta http-equiv="Content-Security-Policy" content="script-src 'self' http://*  https://* 'unsafe-inline' 'unsafe-eval'; style-src 'self' http://*  https://* 'unsafe-inline' 'unsafe-eval'">

	<title>Escape My House | NZ Fire Service</title>
	<meta name="mobile-web-app-capable" content="yes">
	<link rel="icon" sizes="192x192" href="/launcher-icon-4x.png"> 
	<link rel="manifest" href="manifest.json">
	
	<!-- <meta name="theme-color" content="#821d1d"> -->
	<meta name="theme-color" content="#444444">
	<meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1, initial-scale=1, user-scalable=no">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:300,400,700|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">
    <link rel="stylesheet" href="<?php echo $base; ?>assets/css/main.v3.css">
    <!-- <script src="https://use.fontawesome.com/bc730c5fa6.js"></script> -->

    <script src="<?php echo $base; ?>assets/js/3rdparty/jquery.min.js"></script>
    <script src="<?php echo $base; ?>assets/js/3rdparty/babylon.2.5.js"></script>
    <script src="<?php echo $base; ?>assets/js/3rdparty/canvas2d.js"></script>
    <script src="<?php echo $base; ?>assets/js/3rdparty/moment.min.js"></script>
	<script src="<?php echo $base; ?>assets/js/3rdparty/iphone-inline-video.browser.js"></script>
	<script src="<?php echo $base; ?>assets/js/3rdparty/promise.min.js"></script>
	<script src="<?php echo $base; ?>assets/js/3rdparty/fontfaceobserver.standalone.js"></script>
    <script src="<?php echo $base; ?>assets/js/3rdparty/bowser.min.js"></script>
	
    <script src="assets/js/detect.v1.js"></script>
    <script src="assets/js/main.v4.js"></script>
    <?php //detect special conditions devices
		
		$iPod    = stripos($_SERVER['HTTP_USER_AGENT'],"iPod");
		$iPhone  = stripos($_SERVER['HTTP_USER_AGENT'],"iPhone");
		$iPad    = stripos($_SERVER['HTTP_USER_AGENT'],"iPad");
		$Android = stripos($_SERVER['HTTP_USER_AGENT'],"Android");
		
		if($iPod || $iPhone || $iPad) {
			$platform = 'ios';
		} else if($Android) {
			$platform = 'android';
		} else {
			$platform = 'auto';
		}

	?>
	<script> 
		detect.os.name = '<?php echo $platform; ?>';
		u.base = '<?php echo $base; ?>';
		u.videoStream = '<?php echo $base; ?>assets/video/stream.php?url='; 
		u.imageBase = '<?php echo $base; ?>assets/img/';
		u.audioBase = '<?php echo $base; ?>assets/audio/';
		u.speed.url = u.imageBase+"loadtest.png";
		gm.imageurl = u.base+'data/?doAction=streetview&location=66 Clarence st Ponsonby&fov=80&fallback1=ponsonby&fallback2=ponsonby';
	</script>
    <script src="<?php echo $base; ?>assets/js/timer.v6.js"></script>
    <script src="<?php echo $base; ?>assets/js/experience.v10.js"></script>
    <script src="<?php echo $base; ?>assets/js/home.v7.js"></script>
    <script src="<?php echo $base; ?>assets/js/streetview.v5.js"></script>
    <script src="<?php echo $base; ?>assets/js/modals.v8.js"></script>
    <script src="<?php echo $base; ?>assets/js/modal.content.v9.js"></script>

	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA56-JZrOFme8dsFTWCKrVfpgVGxSPL6c4&libraries=places&callback=initAutocomplete" async defer></script>

</head>
<body class="">
	<div id="copyright" class="lounge_hide hallway_hide streetview_hide">Copyright New Zealand Fire Service 2016</div>
	<a id="make_a_plan" class="btn blue lounge_hide hallway_hide streetview_hide small" href="http://www.fire.org.nz/escapeplan/#great_start"><i class="fa fa-home" aria-hidden="true"></i> &nbsp; Make an escape plan</a>
	<a target="_blank" href="http://www.fire.org.nz/" id="logo" class="lounge_hide hallway_hide streetview_hide"></a>

	<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-66540225-2', 'auto');
		ga('send', 'pageview');
	</script>

	<div id="videos"></div>

	<div class="step current" id="experience">
    	<canvas id="renderCanvas"></canvas>
	</div>

	<div class="overlays">

		<div id="techology" class="overlay">
			<div class="no_gyro" style="display:none;">
				<h4>Sorry, your mobile device doesn't have a gyro</h4>
			</div>
			<div class="has_gyro">
				<h4>Sorry, your browser is out of date</h4>
				<p>Please update to a newer browser.</p>
				<div class="browserlist">
					<a target="_blank" href="https://www.google.com/chrome/"><i class="fa fa-chrome" aria-hidden="true"></i><br>Chrome <span class="min_chrome"></span></a>
					<a target="_blank" href="https://www.microsoft.com/en-us/windows/microsoft-edge"><i class="fa fa-edge" aria-hidden="true"></i><br>Edge/IE <span class="min_ie"></span></a>
					<a target="_blank" href="https://www.mozilla.org/en-US/firefox/new/"><i class="fa fa-firefox" aria-hidden="true"></i><br>Frefox <span class="min_firefox"></span></a>
					<a target="_blank" href="https://support.apple.com/downloads/safari"><i class="fa fa-safari" aria-hidden="true"></i><br>Safari <span class="min_safari"></span></a>
					<div class="clear"></div>
				</div>
			</div>
			<p><a class="btn blue" href="https://www.youtube.com/watch?v=ru4MpYw05dU">Watch the 360 experience on YouTube</a></p>
			<div class="seperator double"></div>
			<!-- <h4>Make an escape plan</h4> -->
			<h4>With a fire escape plan, you'll be better prepared to handle a fire emergency in your home</h4>
			<p><a class="btn blue" href="http://www.fire.org.nz/escapeplan/"><i class="fa fa-home" aria-hidden="true"></i> &nbsp; Make an escape plan</a></p>
		</div>

		<div id="address" class="overlay">
			<h4>Find out what it's like to experience a real house fire</h4>
			<div class="input withButton">
				<input name="address" value="" id="address_finder" class="large" placeholder="Enter your address..." /><a class="btn blue large" id="address_go" data-experience="create" data-camera="auto">Go &nbsp;<i class="fa fa-angle-right" aria-hidden="true"></i></a>
			</div>
			<p><br><a data-experience="create" data-camera="auto">skip this step <i class="fa fa-angle-right" aria-hidden="true"></i></a></p>
		</div>
	
		<div id="vr_select" class="overlay">
			<div class="inner">
				<img class="cardboard-icon" src="<?php echo $base; ?>assets/img/cardboard-icon.png" />
				<h4>Do you have google cardboard?</h4>
				<div class="btnGroup" style="margin-bottom:10px;">
					<a class="btn blue large" data-overlay="open" data-overlay-id="#skip" data-do="step" data-id="#experience" data-experience="create" data-camera="vr"><i class="fa fa-check" aria-hidden="true"></i> &nbsp; Yes</a><a class="btn blue large" data-overlay="open" data-overlay-id="#skip" data-do="step" data-id="#experience" data-experience="create" data-camera="mobile"><i class="fa fa-times" aria-hidden="true"></i> &nbsp; No</a>
				</div>
			</div>
		</div>

	</div>

	<div class="loader">
		<div class="inner">

			<div class="loaderWrap">
				<div class="loaderanimation"></div>
				<div class="per_output"></div>
			</div>

			<div class="loaderWrap camera_vr_display">
				<div class="loaderanimation"></div>
				<div class="per_output"></div>
			</div>
			
			<div class="viewLandscape camera_mobile_display hallway_hide streetview_hide">
				<div class="seperator home_hide"></div>
				<img class="mobile-icon home_hide camera_mobile_display" src="<?php echo $base; ?>assets/img/mobile-icon.png" />
				<p class="home_hide">Put on your headphones and make sure your phone is in landscape&nbsp;mode.</p>
				<div class="home_hide seperator"></div>
				<div class="bandwidthSelect">
					<p>Loading slow on your connection? Choose a different&nbsp;stream:</p>
					<p><a class="qual low" data-do="set_bandwidth" data-bandwidth="low">low</a><a class="qual med" data-do="set_bandwidth" data-bandwidth="medium">med</a><a class="qual high" data-do="set_bandwidth" data-bandwidth="high">high</a></p>
				</div>
			</div>

			<div class="viewLandscape camera_vr_display hallway_hide streetview_hide">
				<img style="width:50px;" class="mobile-icon" src="<?php echo $base; ?>assets/img/cardboard-icon.png" />
				<p style="font-size:.7em;font-weight: 900;">Put on your <br>Google Cardboard <br>and&nbsp;headphones</p>
			</div>

			<div class="viewLandscape camera_desktop_display hallway_hide streetview_hide">
				<div class="seperator"></div>
				<img class="mobile-icon camera_desktop_display" src="<?php echo $base; ?>assets/img/cardboard-icon.png" />
				<p>Best experienced with Google Cardboard</p>
				<div class="seperator"></div>
				<img class="mobile-icon camera_desktop_display" src="<?php echo $base; ?>assets/img/headphones-icon.png" />
				<p>Put your headphones on and turn up your&nbsp;volume</p>
				<div class="seperator"></div>
				<div class="bandwidthSelect">
					<h5>Loading slow on your connection?</h5>
					<p>Choose a different&nbsp;stream:</p>
					<p><a class="qual low" data-do="set_bandwidth" data-bandwidth="low">low</a><a class="qual med" data-do="set_bandwidth" data-bandwidth="medium">med</a><a class="qual high" data-do="set_bandwidth" data-bandwidth="high">high</a></p>
				</div>
			</div>

			<div id="moving_you" class="viewLandscape next_room lounge_hide streetview_hide home_hide">
				<h4>Moving you into the hallway. <br>Keep low.</h4>
				<h4 class="camera_vr_display">Moving you into the hallway. <br>Keep low.</h4>
			</div>

		</div>
	</div>


</body>

</html>