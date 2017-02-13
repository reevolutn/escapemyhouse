var hm = window.hm || {};

//
//	CODED BY FCBNZ - ANDREW JACKSON
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
		hm.videos.smokevideo.load();
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
		hm.scene.clearColor = new BABYLON.Color3(0, 0, 0);

		//$('#video_content').html('');
		//$('#video_content').html('<video id="video" autoplay muted playsinline preload="auto" loop src="/assets/video/stream.php?url=smoke_v2.mp4" style="display:none"></video>');
		//hm.videos.smokevideo = document.getElementById('video');

		hm.videos.smokevideo = document.createElement('video');
		hm.videos.smokevideo.preload = 'auto';
		hm.videos.smokevideo.muted = true;
		hm.videos.smokevideo.loop = true;
		hm.videos.smokevideo.playsinline = true;
		hm.videos.smokevideo.src = u.videoStream+'smoke_v2.mp4';
		hm.videos.smokevideo.load();
		hm.videos.smokevideo.play();
	 	document.getElementById("videos").appendChild(hm.videos.smokevideo);
		window.makeVideoPlayableInline(hm.videos.smokevideo);

		// hm.videos.smokevideo = document.getElementById("video_smoke");
		// window.makeVideoPlayableInline(hm.videos.smokevideo);


		$('#per_output').html('loading... 0%');
		hm.videos.smokevideo.addEventListener('progress',
			u.videoLoaded,
			false
		);

		hm.videos.smokevideo.onloadeddata = function() {
			hm.videos.smokevideo.removeEventListener('progress', u.videoLoaded, false);
			$('#behavior').html('');

			$('.loader').hide();
			hm.placeTitle(hm.videos.smokevideo);
		    hm.scene.registerBeforeRender(function() {
		    	if(hm.objects.title1Text.position.z < 5) {
			    	hm.objects.title1Text.position.z += .02
			    	hm.objects.title2Text.position.z += .02
			    	hm.objects.videoSmoke1.position.z += .02
			    	hm.objects.videoSmoke2.position.z += .02
		    	};
		    });
		    u.engine.resize();
		};

		hm.running = true;

        //auto optimise every 10 seconds
		// hm.optimiseGame();
		// hm.timers.optimiseGame = setInterval(function() {
		//   	hm.optimiseGame();
		// }, 5000);

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
	 	//if(platform == 'ios') {
			//post processing
			//var parameters = {
				//dof_aperture: 1
			//};
			//var effect = new BABYLON.LensRenderingPipeline('effect', parameters, scene, .1);
		//}

	    return scene;
	},

	placeTitle : function(smokevideo) {


		var width = 7;
		var height = width/5;
		var titleimg = "/assets/img/landing/title.png";
		var y = 0;

		if(u.d.w < 480) {
			width = 5;
			height = 5;
			titleimg = "/assets/img/landing/title-mob.png";
			y = 0;
		}
		var z = 3;

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

		//title 2
		hm.objects.title2Text = BABYLON.MeshBuilder.CreatePlane(
			"image_sphere", {
				width: 		width,
				height: 	height,
				updatable: 	true
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
		hm.objects.title2Text.material.alpha = .1;


		//create smoke 1
		hm.objects.videoSmoke1 = BABYLON.MeshBuilder.CreatePlane(
			"image_sphere", {
				width: 		20,
				height: 	10,
				updatable: 	true
			}, hm.scene
		);
		hm.objects.videoSmoke1.position.z = z-.01;

		hm.objects.videoSmokeMat = new BABYLON.StandardMaterial("mat", hm.scene);
		hm.objects.videoSmokeMat.emissiveColor = new BABYLON.Color3(1,1,1);
		//hm.objects.videoSmokeMat.backFaceCulling = false;

		hm.objects.videoSmokeMat.diffuseTexture = new BABYLON.VideoTexture("video", smokevideo, hm.scene, true, true);
		hm.objects.videoSmokeMat.alpha = .9;
		hm.objects.videoSmoke1.material = hm.objects.videoSmokeMat;
		hm.objects.videoSmoke1.material.alphaMode = BABYLON.Engine.ALPHA_MULTIPLY;

		hm.objects.videoSmokeMat.diffuseTexture.video.play();


		//create smoke 2
		hm.objects.videoSmoke2 = BABYLON.MeshBuilder.CreatePlane(
			"image_sphere", {
				width: 		20,
				height: 	10,
				updatable: 	true
			}, hm.scene
		);
		hm.objects.videoSmoke2.position.z = z+.01;

		hm.objects.videoSmokeMat2 = new BABYLON.StandardMaterial("mat", hm.scene);
		hm.objects.videoSmokeMat2.emissiveColor = new BABYLON.Color3(1,1,1);
		//hm.objects.videoSmokeMat2.backFaceCulling = false;

		hm.objects.videoSmokeMat2.diffuseTexture = new BABYLON.VideoTexture("video", smokevideo, hm.scene, true, true);
		hm.objects.videoSmokeMat2.alpha = .5;
		hm.objects.videoSmoke2.material = hm.objects.videoSmokeMat2;

		hm.objects.videoSmokeMat2.diffuseTexture.video.play();


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