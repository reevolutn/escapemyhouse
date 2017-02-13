var hm = window.hm || {};

//
//	DESIGNED/CODED BY FCBNZ - ANDREW JACKSON
//
//	(╯°□°）╯︵ ┻━┻
//

var infoCanvas;

hm = {

	scene : false,
	objects : {},
	cameras : {},
	timers : {},
	videos : {},
	running : false,

	init : function() {

	},

	destroy : function() {

		hm.videos.smokevideo.pause();
		hm.videos.smokevideo.src = '';

		if(detect.os.name != 'ios') {
			hm.videos.smokevideo.load();
		}

		delete hm.videos.smokevideo;

		//$('#video_content,#video_content2').html('');
		
		for(key in hm.timers) {
			clearInterval(hm.timers[key]);
			clearTimeout(hm.timers[key]);
		}

		for(key in hm.objects) {
			if(hm.objects[key] != null && $.isFunction(hm.objects[key].dispose) ) {
				hm.objects[key].dispose();
			} else {
				for(subkey in hm.objects[key]) {
					if( hm.objects[key][subkey] != null && $.isFunction(hm.objects[key][subkey].dispose) ) {
						hm.objects[key][subkey].dispose();
					}
				}	
			}
			delete hm.objects[key];
		}
		hm.scene.dispose();
		hm.running = false;
	},

	create : function() {

		// call the createScene function
		hm.scene = hm.createScene();
		hm.scene.ambientColor = new BABYLON.Color3(1, 1, 1);
		//hm.scene.clearColor = new BABYLON.Color3((132/255), (43/255), (39/255));
		hm.scene.clearColor = new BABYLON.Color3(u.ambientColour.r, u.ambientColour.g, u.ambientColour.b);

		//$('#video_content').html('');
		//$('#video_content').html('<video id="video" autoplay muted playsinline preload="auto" loop src="/assets/video/stream.php?url=smoke_v2.mp4" style="display:none"></video>');
		//hm.videos.smokevideo = document.getElementById('video');

		hm.videos.smokevideo = document.createElement('video');
		hm.videos.smokevideo.preload = 'auto';
		hm.videos.smokevideo.muted = true;
		hm.videos.smokevideo.autoplay = true;
		hm.videos.smokevideo.loop = true;
		hm.videos.smokevideo.playsinline = true;
		hm.videos.smokevideo.id = 'smokevideo';
		if(u.bandwidth != 'high' || detect.os.name == 'ios') {
			hm.videos.smokevideo.src = u.videoStream+'EMH_loading_seq.mp4'; //smoke_v2_lowres
		} else {
			hm.videos.smokevideo.src = u.videoStream+'EMH_loading_seq.mp4'; //smoke_v2
		}
	 	document.getElementById("videos").appendChild(hm.videos.smokevideo);
		//hm.videos.smokevideo = document.getElementById("smokevideo");	
		window.makeVideoPlayableInline(hm.videos.smokevideo);

		hm.videos.smokevideo.load();
		hm.videos.smokevideo.play();

		// hm.videos.smokevideo = document.getElementById("video_smoke");
		// window.makeVideoPlayableInline(hm.videos.smokevideo);


		$('.per_output').html('0%');
		// hm.videos.smokevideo.addEventListener('progress',
		// 	u.videoLoaded,
		// 	false
		// );

		if(detect.os.name == 'iosi' /* && detect.browser.name == 'chrome' && detect.browser.version < 55 */ ) {
			$('.loader').hide();
			hm.placeTitle(hm.videos.smokevideo);
		} else {
			hm.videos.smokevideo.addEventListener('canplaythrough',
				hm.canplaythrough,
				false
			);
		}

		hm.running = true;

		//auto optimise every 10 seconds
		// hm.optimiseGame();
		// hm.timers.optimiseGame = setInterval(function() {
		//   	hm.optimiseGame();
		// }, 5000);

	},

	canplaythrough : function(e) {
		console.log('ex.canplaythrough() - video can play through');
		//alert('can play through');
		hm.videos.smokevideo.removeEventListener('canplaythrough', hm.canplaythrough, false);
		hm.videos.smokevideo.play();
		hm.timers.canplaythrough = setInterval(function(e) {
			u.videoLoaded(e);
			//wait for the video to start playing before fading in
			//if(ex.videos.toload[ex.videos.current].currentTime > 0) {
			if( (Math.round(u.videoPerLoaded*100)/100) >= ex.videos.minload[detect.os.name]) {
				clearInterval(hm.timers.canplaythrough);
				//hm.videos.smokevideo.removeEventListener('progress', u.videoLoaded, false);
				$('.loader').hide();
				hm.placeTitle(hm.videos.smokevideo);
				// hm.scene.registerBeforeRender(function() {
				// 	if(hm.objects.title1Text.position.z < 5) {
				// 		hm.objects.title1Text.position.z += .02
				// 		hm.objects.title2Text.position.z += .02
				// 		hm.objects.videoSmoke1.position.z += .02
				// 		hm.objects.videoSmoke2.position.z += .02
				// 	};
				// });
				u.engine.resize();
			}
		}, 33, e);
	},

	runRenderLoop : function() {
		hm.scene.render();
	},

	createScene : function() {
		console.log('hm.createScene()');
		$('.loader').show();

		//create
		var scene = new BABYLON.Scene(u.engine);

		//desktop
		hm.cameras.desktop = new BABYLON.FreeCamera("camera_desktop", new BABYLON.Vector3(0, 0, 0), scene);
		hm.cameras.desktop.fov = 1.5;
	   	scene.activeCamera = hm.cameras.desktop;

	   	//attach control
		scene.activeCamera.attachControl(u.canvas, true);

		//weird fix for ios but ohwell
	 	//if(detect.os.name == 'ios') {
			//post processing
			//var parameters = {
				//dof_aperture: 1
			//};
			//var effect = new BABYLON.LensRenderingPipeline('effect', parameters, scene, .1);
		//}

		return scene;
	},

	placeTitle : function(smokevideo) {


		var width = 6;
		var height = width/3;
		var titleimg = "/assets/img/landing/title.v3.png";
		var y = 0;

		if(u.d.w < 480) {
			width = 4;
			height = 4;
			titleimg = "/assets/img/landing/title-mob.v3.png";
			y = 1;
		}
		var z = 5;

		//title 1
		hm.objects.title1Text = BABYLON.MeshBuilder.CreatePlane(
			"image_sphere", {
				width: 		width,
				height: 	height,
				updatable: 	true
			}, hm.scene
		);
		hm.objects.title1Text.position.z = z;
		hm.objects.title1Text.position.y = y;
		//create mat
		hm.objects.title1TextMat = new BABYLON.StandardMaterial("mat", hm.scene);
		hm.objects.title1TextMat.emissiveColor = new BABYLON.Color3(1,1,1);
	   	hm.objects.title1TextMat.useAlphaFromDiffuseTexture = true;
		//assign image
		hm.objects.title1TextMat.diffuseTexture = new BABYLON.Texture(titleimg, hm.scene);
		hm.objects.title1TextMat.diffuseTexture.hasAlpha = true;
		hm.objects.title1Text.material = hm.objects.title1TextMat;


		if(detect.os.name == 'iosi' /* && detect.browser.name == 'chrome' && detect.browser.version < 55 */) {

		} else {

			//title 2
			hm.objects.title2Text = BABYLON.MeshBuilder.CreatePlane(
				"image_sphere", {
					width: 		width,
					height: 	height
				}, hm.scene
			);
			hm.objects.title2Text.position.z = z-.02;
			hm.objects.title2Text.position.y = y;
			//create mat
			hm.objects.title2TextMat = new BABYLON.StandardMaterial("mat", hm.scene);
			hm.objects.title2TextMat.emissiveColor = new BABYLON.Color3(1,1,1);
		   	hm.objects.title2TextMat.useAlphaFromDiffuseTexture = true;
			//assign image
			hm.objects.title2TextMat.diffuseTexture = new BABYLON.Texture(titleimg, hm.scene);
			hm.objects.title2TextMat.diffuseTexture.hasAlpha = true;
			hm.objects.title2Text.material = hm.objects.title2TextMat;
			hm.objects.title2Text.material.alpha = .1

			//create smoke 1
			hm.objects.videoSmoke1 = BABYLON.MeshBuilder.CreatePlane(
				"image_sphere", {
					width: 		20,
					height: 	10
				}, hm.scene
			);
			hm.objects.videoSmoke1.position.z = z-.01;

			hm.objects.videoSmokeMat = new BABYLON.StandardMaterial("mat", hm.scene);
			hm.objects.videoSmokeMat.emissiveColor = new BABYLON.Color3(1,1,1);
			hm.objects.videoSmokeMat.backFaceCulling = false;

			hm.objects.videoSmokeMat.diffuseTexture = new BABYLON.VideoTexture("video", smokevideo, hm.scene, true, true);
			hm.objects.videoSmokeMat.alpha = .9;
			hm.objects.videoSmoke1.material = hm.objects.videoSmokeMat;
			hm.objects.videoSmoke1.rotation.x = Math.PI;
			//hm.objects.videoSmoke1.material.alphaMode = BABYLON.Engine.ALPHA_MULTIPLY;

			hm.objects.videoSmokeMat.diffuseTexture.video.play();


			//create smoke 2
			hm.objects.videoSmoke2 = BABYLON.MeshBuilder.CreatePlane(
				"image_sphere", {
					width: 		20,
					height: 	10
				}, hm.scene
			);
			hm.objects.videoSmoke2.position.z = z+.01;
			hm.objects.videoSmokeMat2 = new BABYLON.StandardMaterial("mat", hm.scene);
			hm.objects.videoSmokeMat2.emissiveColor = new BABYLON.Color3(1,1,1);
			//hm.objects.videoSmokeMat2.backFaceCulling = false;
			hm.objects.videoSmokeMat2.diffuseTexture = new BABYLON.VideoTexture("video", smokevideo, hm.scene, true, true);
			hm.objects.videoSmokeMat2.alpha = .45;
			hm.objects.videoSmoke2.material = hm.objects.videoSmokeMat2;
			hm.objects.videoSmokeMat2.diffuseTexture.video.play();

			//create color overlay
			// hm.objects.coloroverlay = BABYLON.MeshBuilder.CreatePlane(
			// 	"image_sphere", {
			// 		width: 		20,
			// 		height: 	10
			// 	}, hm.scene
			// );
			// hm.objects.coloroverlay.position.z = z-.01;
			// //create mat
			// hm.objects.coloroverlayMat = new BABYLON.StandardMaterial("mat", hm.scene);
			// //hm.objects.coloroverlayMat.diffuseColor = new BABYLON.Color3((132/255), (43/255), (39/255));
			// hm.objects.coloroverlayMat.diffuseColor = new BABYLON.Color3(u.ambientColour.r, u.ambientColour.g, u.ambientColour.b);
			// hm.objects.coloroverlayMat.emissiveColor = new BABYLON.Color3(u.ambientColour.r, u.ambientColour.g, u.ambientColour.b);
			// hm.objects.coloroverlayMat.alpha = .9;
			// hm.objects.coloroverlay.material = hm.objects.coloroverlayMat;
		
			// hm.objects.coloroverlay.material.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;
		}
		hm.objects.videoSmoke2.isVisible = false;
		hm.objects.title1Text.isVisible = false;
		hm.objects.title2Text.isVisible = false;



	},

	optimiseGame : function() {
		//console.log('ex.optimiseGame()');
		BABYLON.SceneOptimizer.OptimizeAsync(
			hm.scene, 
			BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed(20,2000),
			function() {
				// On success
				console.log('hm.optimiseGame() - high quality')
			}, function() {
				// FPS target not reached
				console.log('hm.optimiseGame() - low quality')
			}
		);
	}
}