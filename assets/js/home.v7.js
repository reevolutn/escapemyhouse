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
	logo : {
		animate : 'out',
		alpha : 0
	},
	playvideo : true,
	m : {
		x : 0,
		y : 0
	},

	init : function() {
	    $(document).mousemove(function(e) {
	      hm.m.x = -(($(window).width()/2)-e.pageX);
	      hm.m.y = -(($(window).height()/2)-e.pageY);
	      //hm.mousemove(hm.m.x, hm.m.y);
	    });
	},

	mousemove : function(x,y) {
		if(hm.running && typeof hm.objects.logo_text == 'object') {
			hm.objects.logo_text.rotation.y = x*.00005;
			//hm.objects.logo_text.rotation.x = y*.0001;
		}
	},

	nextScene : function() {

		//try and go fulscreen, this only works on android
		if(u.d.w < 800 && detect.os.name != 'ios') {
			launchIntoFullscreen(document.documentElement);
		}

		if(hm.playvideo) {

			//clear the video loop
			clearInterval(hm.timers.smokeloop);
			//get the current time of the video and see how long we need to timeout for
			var timeRemaining = hm.videos.smokevideo.duration - hm.videos.smokevideo.currentTime;
			hm.timers.nextscene = setTimeout(function() {
				hm.destroy();
				ex.create();
			}, timeRemaining*1000);

			var smokeout = timeRemaining-3;
			if(smokeout < 0) {
				smokeout = 0;
			}
			hm.timers.fadeoutsmoke = setTimeout(function() {
				//hm.logo.animate = 'out';
				var easingFunction = new BABYLON.CircleEase();
				easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
				//BABYLON.Animation.CreateAndStartAnimation('logo_text_alpha', hm.objects.logo_text, 'material.alpha', 60, 100, 1, 0, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction);
				//BABYLON.Animation.CreateAndStartAnimation('logo_text_rotate', hm.objects.logo_text, 'rotation.x', 60, 100, .3, 0, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction);
				//BABYLON.Animation.CreateAndStartAnimation('cylinder_rotate', hm.objects.cylinder, 'rotation.y', 60, 100, -(Math.PI*.5), -(Math.PI), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction);
				//BABYLON.Animation.CreateAndStartAnimation('cylinder_alpha', hm.objects.cylinder, 'material.alpha', 60, 100, 1, 0, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction);
				BABYLON.Animation.CreateAndStartAnimation('light_intensity', hm.objects.light, 'intensity', 60, 100, 1, 0, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction);
				BABYLON.Animation.CreateAndStartAnimation('firelight_intensity', hm.objects.firelight, 'intensity', 60, 100, 0, .5, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction);
			}, smokeout*1000);

		} else {
			hm.destroy();
			ex.create();
		}
	},

	destroy : function() {

		if(hm.playvideo) {
			hm.videos.smokevideo.pause();
			hm.videos.smokevideo.src = '';
			delete hm.videos.smokevideo;
		}

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

		if(detect.os.name == 'ios' /* && detect.browser.name == 'chrome' && detect.browser.version < 55 */ ) {
			hm.playvideo = false;
		}

		// call the createScene function
		hm.scene = hm.createScene();
		hm.scene.ambientColor = new BABYLON.Color3(1, 1, 1);
		hm.scene.clearColor = new BABYLON.Color3(u.ambientColour.r, u.ambientColour.g, u.ambientColour.b);

		if(hm.playvideo) {

			hm.videos.smokevideo = document.createElement('video');
			hm.videos.smokevideo.preload = 'auto';
			hm.videos.smokevideo.muted = true;
			hm.videos.smokevideo.autoplay = true;
			hm.videos.smokevideo.loop = true;
			hm.videos.smokevideo.playsinline = true;
			hm.videos.smokevideo.id = 'smokevideo';

			if(u.d.w < 480) {
				if(u.bandwidth == 'low' || u.bandwidth == 'medium' || detect.os.name == 'ios' ) {
					hm.videos.smokevideo.src = u.videoStream+'home/smoke.v3.lowres.mobile.mp4';
				} else {
					hm.videos.smokevideo.src = u.videoStream+'home/smoke.v3.mobile.mp4';
				}
			} else {
				if(u.bandwidth == 'low' || u.bandwidth == 'medium' || detect.os.name == 'ios' ) {
					hm.videos.smokevideo.src = u.videoStream+'home/smoke.v3.lowres.mp4';
				} else {
					hm.videos.smokevideo.src = u.videoStream+'home/smoke.v3.mp4';
				}
			}
			
		 	document.getElementById("videos").appendChild(hm.videos.smokevideo);
			window.makeVideoPlayableInline(hm.videos.smokevideo);
			hm.videos.smokevideo.load();
			hm.videos.smokevideo.play();

			$('.per_output').html('<span style="font-size:.6em;">loading</span>');
			
			hm.videos.smokevideo.addEventListener('canplaythrough',
				hm.canplaythrough,
				false
			);

		} else {

			$('.loader').hide();
			hm.placeTitle(false);

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
		hm.videos.smokevideo.removeEventListener('canplaythrough', hm.canplaythrough, false);
		hm.timers.canplaythrough = setInterval(function(e) {
			u.videoLoaded(e);
			if( (Math.round(u.videoPerLoaded*100)/100) >= ex.videos.minload[detect.os.name]) {
				clearInterval(hm.timers.canplaythrough);
				$('.loader').hide();
				hm.placeTitle(hm.videos.smokevideo);
				u.engine.resize();
			}
		}, 33, e);
	},

	runRenderLoop : function() {
		// if(hm.logo.animate == 'in' && hm.logo.alpha < 1) {
		// 	hm.logo.alpha += .015;
		// 	for(key in hm.logoElements) {
		// 		hm.objects[key].material.alpha = hm.logo.alpha;
		// 	}
		// 	hm.objects.cylinder.rotation.y = -( (Math.PI *.5) * hm.logo.alpha/1 );
		// 	hm.objects.logo_text.rotation.x = .3 * (hm.logo.alpha/1);

		// } else if(hm.logo.animate == 'out' && hm.logo.alpha > 0) {
		// 	hm.logo.alpha -= .015;
		// 	for(key in hm.logoElements) {
		// 		hm.objects[key].material.alpha = hm.logo.alpha;
		// 	}
		// }
		hm.mousemove(hm.m.x, hm.m.y);
		hm.scene.render();
	},

	createScene : function() {
		console.log('hm.createScene()');
		$('.loader').show();
		var scene = new BABYLON.Scene(u.engine);
		hm.cameras.desktop = new BABYLON.FreeCamera("camera_desktop", new BABYLON.Vector3(0, 0, 0), scene);
		hm.cameras.desktop.fov = 1.5;
	   	scene.activeCamera = hm.cameras.desktop;
		//scene.activeCamera.attachControl(u.canvas, true);

		//weird fix for ios but ohwell
	 	if(detect.os.name == 'ios') {
			//post processing
			var parameters = {
				dof_aperture: 1
			};
			var effect = new BABYLON.LensRenderingPipeline('effect', parameters, scene, .1);
		}

		return scene;
	},

	logoElements : {
		logo_text : {
			width  : 4,
			height : 4/1.71,
			y : 0,
			img : u.imageBase+'landing/logo-animation/escape-my-house-landscape.v2.png',
			rotation : {
				x : 0,
				y : 0,
				z : 0
			}
		}, 
		cylinder : {
			y : -.3
		}
	},

	placeTitle : function(smokevideo) {


		//defaults
		var z = 4.6;
		var vwidth = 19.20;
		var vheight = 10.80;

		if(u.d.w < 480) {
			//hm.logoElements.logo_text.width = 2.6;
			//hm.logoElements.logo_text.height = 2.6/1.71;
			hm.logoElements.logo_text.img = u.imageBase+'landing/logo-animation/escape-my-house-portrait.v2a.png';
			vwidth = 10.80 * .6;
			vheight = 19.20 * .6;
		}

		//create light source
		hm.objects.light = new BABYLON.PointLight("pointLight2", new BABYLON.Vector3(-50, 2, -2), hm.scene);
		hm.objects.light.diffuse = new BABYLON.Color3(1,1,1);
		hm.objects.light.specular = new BABYLON.Color3(1,1,1);
		hm.objects.light.intensity = 1;

		hm.objects.firelight = new BABYLON.PointLight("pointLight2", new BABYLON.Vector3(-100, 60, -10), hm.scene);
		hm.objects.firelight.diffuse = new BABYLON.Color3(1,0,0);
		hm.objects.firelight.specular = new BABYLON.Color3(1,0,0);
		hm.objects.firelight.intensity = 0;


		//create logo text
		hm.objects.logo_text = BABYLON.MeshBuilder.CreatePlane(
			"image_sphere", {
				width: 		hm.logoElements.logo_text.width,
				height: 	hm.logoElements.logo_text.height
			}, hm.scene
		);
		hm.objects.logo_text.rotation = hm.logoElements.logo_text.rotation
		hm.objects.logo_text.position.z = z;
		hm.objects.logo_text.position.y = hm.logoElements.logo_text.y;
		hm.objects.logo_text.setPivotMatrix(BABYLON.Matrix.Translation(0, hm.logoElements.logo_text.height/2, 0));

		hm.objects.logo_text_mat = new BABYLON.StandardMaterial('logo_text_mat', hm.scene);
		hm.objects.logo_text_mat.emissiveColor = new BABYLON.Color3(0,0,0);
	   	hm.objects.logo_text_mat.useAlphaFromDiffuseTexture = true;
		hm.objects.logo_text_mat.diffuseTexture = new BABYLON.Texture(hm.logoElements.logo_text.img, hm.scene);
		hm.objects.logo_text_mat.diffuseTexture.hasAlpha = true;
		hm.objects.logo_text.material = hm.objects.logo_text_mat;
		hm.objects.logo_text.material.hasAlpha = true;
		hm.objects.logo_text.material.alpha = hm.logo.alpha;
		hm.objects.logo_text.material.backFaceCulling = false;


		var uv = [];
		uv[0] = new BABYLON.Vector4(0, 0, 0, 0);
		uv[1] = new BABYLON.Vector4(0, 0, 1, 1);
		uv[2] = new BABYLON.Vector4(0, 0, 0, 0);
		uv[3] = new BABYLON.Vector4(0, 0, 0, 0);

		hm.objects.cylinder = BABYLON.MeshBuilder.CreateCylinder("cyl", {
			height : .18,
			diameter: .18*15,
			tessellation : 64,
			subdivisions : 1,
			faceUV : uv
		}, hm.scene);
		hm.objects.cylinder.position.z = z+.5;
		hm.objects.cylinder.position.y = hm.logoElements.cylinder.y;
		hm.objects.cylinder.rotation.y = 0; //-(Math.PI *.5);

		hm.objects.cylinder_mat = new BABYLON.StandardMaterial('360_mat', hm.scene);
		hm.objects.cylinder_mat.backFaceCulling = false;
		hm.objects.cylinder_mat.emissiveColor = new BABYLON.Color3(0,0,0);
		hm.objects.cylinder_mat.useAlphaFromDiffuseTexture = true;
		hm.objects.cylinder_mat.diffuseTexture = new BABYLON.Texture(u.imageBase+'landing/logo-animation/360-ring-nofade.png', hm.scene);
		hm.objects.cylinder_mat.alpha = 0;
		hm.objects.cylinder_mat.diffuseTexture.hasAlpha = true;
		hm.objects.cylinder.material = hm.objects.cylinder_mat;

		var easingFunction = new BABYLON.CircleEase();
		easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

		BABYLON.Animation.CreateAndStartAnimation('logo_text_alpha', hm.objects.logo_text, 'material.alpha', 60, 200, 0, 1, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction);
		BABYLON.Animation.CreateAndStartAnimation('logo_text_rotate', hm.objects.logo_text, 'rotation.x', 60, 200, 0, .1, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction);
		BABYLON.Animation.CreateAndStartAnimation('light_pos', hm.objects.light, 'position.x', 60, 200, -50, 0, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction);

		hm.timers.cylinderin = setTimeout(function() {
			BABYLON.Animation.CreateAndStartAnimation('cylinder_rotate', hm.objects.cylinder, 'rotation.y', 60, 100, 0, -(Math.PI *.5), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction);
			BABYLON.Animation.CreateAndStartAnimation('cylinder_alpha', hm.objects.cylinder, 'material.alpha', 60, 100, 0, 1, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction);
		}, 500)


		if(hm.playvideo) {


			//create smoke 2
			hm.objects.videoSmoke2 = BABYLON.MeshBuilder.CreatePlane(
				"image_sphere", {
					width: 		vwidth,
					height: 	vheight
				}, hm.scene
			);
			hm.objects.videoSmoke2.position.z = z+.8;
			hm.objects.videoSmoke2.rotation.x = Math.PI;
			hm.objects.videoSmokeMat2 = new BABYLON.StandardMaterial("mat", hm.scene);
			hm.objects.videoSmokeMat2.emissiveColor = new BABYLON.Color3(1,1,1);
			hm.objects.videoSmokeMat2.backFaceCulling = false;
			hm.objects.videoSmokeMat2.diffuseTexture = new BABYLON.VideoTexture("video", smokevideo, hm.scene, true, true);
			hm.objects.videoSmokeMat2.alpha = 1;
			hm.objects.videoSmoke2.material = hm.objects.videoSmokeMat2;
			hm.videos.smokevideo.currentTime = 0;
			hm.videos.smokevideo.play();

			//create loop timers
			hm.timers.smokeloop = setInterval(function() {
				if(hm.videos.smokevideo.currentTime > 8) {
					hm.videos.smokevideo.currentTime = 6;
				}
			}, 100);

		}


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