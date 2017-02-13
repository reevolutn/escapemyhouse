var ex = window.ex || {};

//
//	CODED BY FCBNZ - ANDREW JACKSON
//
//	(╯°□°）╯︵ ┻━┻
//

ex = {

	canvas : false,
	engine : false,
	timers : {
		pointer_expand : false
	},
	cameras : {},
	activeCamera : 'desktop',
	lenseffects : {},
	data : {},
	objects : {
		buttons : {},
		pins : {},
		modals : {}
	},
	fade : {
		current : 0,
		speed: .01,
		to : 0
	},
	playerheight : 1,
	pointer : false,
	pointerProgress : false,
	collisiontimers : {},
	ishit : {
		pin :false,
		button:false
	},
	pointerScaling : {
		init : .06,
		current : .06,
		length : .06
	},
	usePointer : {
		vr :true,
		mobile: true,
		desktop : false
	},
	videos : {
		current : 'lounge',
		lounge : {
			mobile  : u.videoStream+'lounge_2k.mp4',
			desktop : u.videoStream+'lounge_4k.mp4',
			current : u.videoStream+'lounge_2k.mp4',
			// mobile  : 'https://player.vimeo.com/external/182609794.hd.mp4?s=097a4707c507ad285fcd155d7bcbc8266e38b3b8&profile_id=119',
			// desktop : 'https://player.vimeo.com/external/182609794.hd.mp4?s=097a4707c507ad285fcd155d7bcbc8266e38b3b8&profile_id=119',
			// current : 'https://player.vimeo.com/external/182609794.hd.mp4?s=097a4707c507ad285fcd155d7bcbc8266e38b3b8&profile_id=119',
			startrotation : {
				y : .5
			} 
		},
		hallway : {
			mobile  : u.videoStream+'hallway_2k.mp4',
			desktop : u.videoStream+'hallway_4k.mp4',
			current : u.videoStream+'hallway_2k.mp4',
			startrotation : {
				y : 2.5
			} 
		}
	},
	audio : {},
	running : false,

	init : function() {
		console.log('ex.init()');
	},

	create : function() {
		console.log('ex.create()');

        //create the scene
        ex.scene = ex.createScene();

        //set background colour
	    ex.scene.ambientColor = new BABYLON.Color3(1, 1, 1);
		ex.scene.clearColor = new BABYLON.Color3(0, 0, 0);

	    //show loader
		$('.loader').show();

		//create light source for fire
	    ex.objects.pointLight1 = new BABYLON.PointLight("pointLight1", new BABYLON.Vector3(-12, 0, 0), ex.scene);
		ex.objects.pointLight1.diffuse = new BABYLON.Color3(1, .4, 0);
		ex.objects.pointLight1.specular = new BABYLON.Color3(1, .4, 0);
	    ex.objects.pointLight1.intensity = .5;

	    //set an interval to flicker the fire
	    ex.timers.flicker = setInterval(function() {
	   		ex.objects.pointLight1.intensity = ( Math.random() * (50 - 25) + 25 ) / 100;
	    }, 100);

		//create light source for window
	    ex.objects.pointLight2 = new BABYLON.PointLight("pointLight2", new BABYLON.Vector3(0, 2, -10), ex.scene);
		ex.objects.pointLight2.diffuse = new BABYLON.Color3(1,1,1);
		ex.objects.pointLight2.specular = new BABYLON.Color3(1,1,1);
	    ex.objects.pointLight2.intensity = .35;

	    //create projection sphere
	    ex.objects.videoSphere = BABYLON.Mesh.CreateSphere("video_sphere", 32, 32, ex.scene);

        //before rendering the scene
		ex.scene.registerBeforeRender(function() {
			//temp.beforeRender();
			timer.beforeRender();
			if(ex.pointer) {
				ex.hitDetection();
			}
		});

	    //place the timer
	    timer.place();

	    //load the video
	    ex.loadVideo();

        //auto optimise every 10 seconds
		// ex.optimiseGame();
		// ex.timers.optimiseGame = setInterval(function() {
		//   	ex.optimiseGame();
		// }, 5000);

		//set this scene to active
		ex.running = true;

	},

	runRenderLoop : function() {
		if(ex.fade.current != ex.fade.to ) {
			if(ex.fade.current > ex.fade.to ) {
				ex.fade.current -= ex.fade.speed;
			} else if(ex.fade.current < ex.fade.to ) {
				ex.fade.current += ex.fade.speed;
			}
			ex.fade.current = Math.round(ex.fade.current * 1000)/1000
			ex.objects.videoSphere.material.emissiveColor = new BABYLON.Color3(ex.fade.current,ex.fade.current,ex.fade.current);
			//console.log('fade');
		}

		ex.scene.render();
	},

	loadVideo : function() {

		ex.videos.toload = document.createElement('video');
		ex.videos.toload.src = ex.videos[ex.videos.current].current;
		ex.videos.toload.autoplay = true;
		ex.videos.toload.preload = 'auto';
		ex.videos.toload.muted = true;
		ex.videos.toload.playsinline = true;
		ex.videos.toload.load();
		window.makeVideoPlayableInline(ex.videos.toload);

		//correct time
		if(timer.videoStart != 0) {
			console.log('jumping to '+timer.videoStart+'s in video' );
			ex.videos.toload.addEventListener('loadedmetadata', function() {
				this.currentTime = timer.videoStart;
			}, false);	
		}

		//create video events
		u.videoPerLoaded = 0;
		u.videoPerLoadedOver = 0;
		$('#per_output').html('loading... 0%');
		ex.videos.toload.addEventListener('progress',
			u.videoLoaded,
			false
		);

		//can play through event
		ex.videos.toload.addEventListener('canplaythrough',
			ex.canplaythrough,
			false
		);

	},

	createScene : function () {
		console.log('ex.createScene()');

		if(u.d.w < 800 && platform != 'ios') {
    		launchIntoFullscreen(document.documentElement);
		}

		//create
		var scene = new BABYLON.Scene(u.engine);

		//CAMERAS
	    //mobile - NON-VR 
	    ex.cameras.mobile = new BABYLON.DeviceOrientationCamera("ex_camera1", new BABYLON.Vector3(0, ex.playerheight, 0), scene);
	    ex.cameras.mobile.fov = 1.25;

	    //mobile - VR 
	    ex.cameras.vr = new BABYLON.VRDeviceOrientationFreeCamera("ex_camera2", new BABYLON.Vector3(0, ex.playerheight, 0), scene, false);
	    ex.cameras.vr.fov = 1;

	    //desktop
	    ex.cameras.desktop = new BABYLON.FreeCamera("ex_camera3", new BABYLON.Vector3(0, ex.playerheight, 0), scene);
	    ex.cameras.desktop.fov = 1.4;
	    ex.cameras.desktop.inputs.camera.angularSensibility = -1000;
	    ex.cameras.desktop.inputs.camera.inertia = .3;
	    //console.log( ex.cameras.desktop.inputs.camera);

	    if(u.camera == 'vr') {
	   		scene.activeCamera = ex.cameras.vr;
	   		ex.activeCamera = 'vr';
	    
	    } else if(u.camera == 'mobile') {
	   		scene.activeCamera = ex.cameras.mobile;
	   		ex.activeCamera = 'mobile';

	    } else {
	   		scene.activeCamera = ex.cameras.desktop;
	   		ex.activeCamera = 'desktop';
	    }

	    if(ex.activeCamera != 'desktop' && platform != 'ios') {
	    	u.setOrientation('landscape');
	    }

		//weird fix for ios but ohwell
		if(platform == 'ios') {
			var parameters = {
				//chromatic_aberration	: 0,
				//edge_blur				: 0,
				//distortion			: 0,
				//grain_amount			: 0,
				//dof_focus_distance	: 200,
				//dof_aperture			: 0,
				//dof_darken			: 0,
				dof_pentagon			: false,
				//dof_gain				: 0,
				//dof_threshold			: 0,
				blur_noise				: false
			};
			ex.lenseffects.main = new BABYLON.LensRenderingPipeline('mainEffect', parameters, scene, 1);
			scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline('mainEffect',  scene.activeCamera);
		}

	    //attach control
	    scene.activeCamera.attachControl(u.canvas, true);

	    return scene;
	},

	canplaythrough : function() {
		console.log('ex.canplaythrough() - video can play through');
		ex.videos.toload.removeEventListener('canplaythrough', ex.canplaythrough, false);

		//load video into scene and create light sources
		ex.populateVideo(ex.videos.toload);

		ex.timers.canplaythrough = setInterval(function() {

			//wait for the video to start playing before fading in
			//if(ex.videos.toload.currentTime > 0) {
			//if(u.videoPerLoaded > .01) {

				//ex.objects.sphereVideo.video.currentTime = timer.videoStart;
				//ex.objects.sphereVideo.video.play();
				//ex.videos.toload.play();

				//clear this interval
				clearInterval(ex.timers.canplaythrough);

				//fade out loader
				$('.loader').hide();

				//remove onprogress and canplaythrough event
				ex.videos.toload.removeEventListener('progress', u.videoLoaded, false);

			    //set sphere rotation offset
			    ex.objects.videoSphere.rotation.y = ex.videos[ex.videos.current].startrotation.y;

				//init modals
				modals.content[ex.videos.current].init();

			    //create virtual pointer
			    if(ex.usePointer[ex.activeCamera]) {
			    	ex.virtualPointer();
			    }
			    if(u.camera == 'mobile') {
			   		ex.scene.activeCamera.resetToCurrentRotation();
			    }

				//place audio
				//ex.placeAudio();

				//start timer
				timer.start();

			    //resize for some weird reason
		    	u.engine.resize();

				//ex.fade.to = 1;

		    //}

		}, 100);

	},

	hitDetection : function() {
		var wm = ex.scene.activeCamera.getWorldMatrix();
		var rayPick = new BABYLON.Ray(ex.scene.activeCamera.position, new BABYLON.Vector3(wm.m[8], wm.m[9], wm.m[10]) );
		var meshFound = ex.scene.pickWithRay(rayPick, ex.hitTest);
		var index;
		var pinexpand = false;
		
		if(meshFound.hit) {
			//console.log(meshFound.pickedMesh.name);

			//check for buttons
			if( meshFound.pickedMesh.name.match(/button/gi) ) {
				index = meshFound.pickedMesh.name.replace("button_", "");

				//check for pin expand
				if(modals.objects.modals[index].visibility == true) {
					pinexpand = true;
				}

				//click
				if( (typeof ex.collisiontimers[index+"_click"] == 'undefined' || ex.collisiontimers[index+"_click"] == false) && modals.objects.modals[index].visibility == true ) {
					console.log('creating timeout for '+index);
					clearTimeout(ex.collisiontimers[index+"_click"]);
					ex.collisiontimers[index+"_click"] = setTimeout(function(index) {
						console.log('firing '+index+' onclick');
						modals.content[ex.videos.current][index].onclick();
					}, 750, index);
					clearTimeout(modals.timers[index+"_autoout"]);
				}

			//check for pins
			} else if( meshFound.pickedMesh.name.match(/pin/gi) ) {
				index = meshFound.pickedMesh.name.replace("pin_", "");

				//check for pin expand
				if(modals.objects.modals[index].visibility != undefined && modals.objects.modals[index].visibility == true) {
					pinexpand = true;
				}

				//mouseover
				if(typeof ex.collisiontimers[index+"_mouseover"] == 'undefined' || ex.collisiontimers[index+"_mouseover"] == false) {
					//console.log('hovered on '+index);
					console.log('creating mouseover timeout for '+index);
					clearTimeout(ex.collisiontimers[index+"_mouseover"]);
					ex.collisiontimers[index+"_mouseover"] = setTimeout(function(index) {
						console.log('firing '+index+' onmouseover');
						modals.content[ex.videos.current][index].onmouseover();
					}, 10, index);
					clearTimeout(modals.timers[index+"_autoout"]);
				}

				//click
				if(typeof modals.content[ex.videos.current][index].onclick != "function" ) {
					pinexpand = false;

				} else if( (typeof ex.collisiontimers[index+"_click"] == 'undefined' || ex.collisiontimers[index+"_click"] == false) && modals.objects.modals[index].visibility == true ) {
					console.log('creating click timeout for '+index);
					clearTimeout(ex.collisiontimers[index+"_click"]);
					ex.collisiontimers[index+"_click"] = setTimeout(function(index) {
						console.log('firing '+index+' onclick');
						modals.content[ex.videos.current][index].onclick();
					}, 1500, index);
					clearTimeout(modals.timers[index+"_autoout"]);
				}

			}

		} else {

			//loop through all meshes and apply fadeout
			for( key in ex.collisiontimers ) {
				
				clearTimeout(ex.collisiontimers[key]);
				delete ex.collisiontimers[key];

				index = key.replace("_mouseover", "");
				index = index.replace("_click", "");
				console.log('creating mouseout out for '+index);

				if(typeof modals.timers[index+"_autoout"] == 'undefined' || modals.timers[index+"_autoout"] == false) {
					modals.timers[index+"_autoout"] = setTimeout(function(index) {
						delete ex.collisiontimers[index];
						modals.fadeOut(index);
					}, 750, index);
				}
			}

		}

		//resize pointer
		if(pinexpand && ex.pointer) {
			ex.pointerScaling.current += .002;
			ex.pointer.scaling = new BABYLON.Vector3(ex.pointerScaling.current, ex.pointerScaling.current, ex.pointerScaling.current);
		} else if(!pinexpand && ex.pointer && ex.pointerScaling.current > ex.pointerScaling.init) {
			ex.pointerScaling.current -= .008;
			ex.pointer.scaling = new BABYLON.Vector3(ex.pointerScaling.current, ex.pointerScaling.current, ex.pointerScaling.current);
		}

	},

	hitTest : function(mesh) {
		if ( mesh.name.match(/button/gi) || mesh.name.match(/pin/gi) ) {
			return true;
		} else {
			return false;
		}
	},

	optimiseGame : function() {
		BABYLON.SceneOptimizer.OptimizeAsync(
			ex.scene, 
			BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed(20,1000),
			function() {
				// On success
				console.log('ex.optimiseGame() - high quality')
			}, function() {
				// FPS target not reached
				console.log('ex.optimiseGame() - low quality')
			}
		);
	},

	placeAudio : function() {
		console.log('ex.placeAudio()');

		var params = {
			loop: true, 
			autoplay: true, 
			spatialSound: true,
			distanceModel: "exponential",
			rolloffFactor: 1
		}

		var basevol = 8;

		if(ex.videos.current == 'lounge') {
			//place sounds
			ex.audio.fire_crackle = new BABYLON.Sound("fire_crackle", "/assets/audio/lounge/Fire Job Lounge Room  Fire burning clothes.mp3", ex.scene, null, params);
			ex.audio.fire_crackle.setPosition(new BABYLON.Vector3(-12, 0, 11));
			ex.audio.fire_crackle.setVolume(basevol);

			ex.audio.fire_sfx = new BABYLON.Sound("fire_sfx", "/assets/audio/lounge/Fire Job Lounge Room  Fire SFX.mp3", ex.scene, null, params);
			ex.audio.fire_sfx.setPosition(new BABYLON.Vector3(-12, 0, 11));
			ex.audio.fire_sfx.setVolume(basevol);

			ex.audio.alarm = new BABYLON.Sound("alarm", "/assets/audio/lounge/Fire Job Lounge Room  Fire Alarm.mp3", ex.scene, null, params);
			ex.audio.alarm.setPosition(new BABYLON.Vector3(0, 11, 0));
			ex.audio.alarm.setVolume(basevol*.5);

			ex.audio.glass = new BABYLON.Sound("glass", "/assets/audio/lounge/Fire Job Lounge Room  Glass breaking four times.mp3", ex.scene, null, params);
			ex.audio.glass.setPosition(new BABYLON.Vector3(-13, 0, -5));
			ex.audio.glass.setVolume(basevol);

		} else if(ex.videos.current == 'hallway') {

			//place sounds
			ex.audio.fire_crackle = new BABYLON.Sound("fire_crackle", "/assets/audio/lounge/Fire Job Lounge Room  Fire burning clothes.mp3", ex.scene, null, params);
			ex.audio.fire_crackle.setPosition(new BABYLON.Vector3(-12, 0, 11));
			ex.audio.fire_crackle.setVolume(basevol);

			ex.audio.fire_sfx = new BABYLON.Sound("fire_sfx", "/assets/audio/lounge/Fire Job Lounge Room  Fire SFX.mp3", ex.scene, null, params);
			ex.audio.fire_sfx.setPosition(new BABYLON.Vector3(-12, 0, 11));
			ex.audio.fire_sfx.setVolume(basevol);

			ex.audio.alarm = new BABYLON.Sound("alarm", "/assets/audio/lounge/Fire Job Lounge Room  Fire Alarm.mp3", ex.scene, null, params);
			ex.audio.alarm.setPosition(new BABYLON.Vector3(0, 11, 0));
			ex.audio.alarm.setVolume(basevol*.5);

		}

	},

	virtualPointer : function() {

	    ex.pointer = BABYLON.MeshBuilder.CreatePlane("pointer", 1, ex.scene);
	    ex.pointer.parent = ex.scene.activeCamera;
		ex.pointer.scaling = new BABYLON.Vector3(ex.pointerScaling.init, ex.pointerScaling.length, ex.pointerScaling.init);
	    ex.pointer.position.z = 2;

	    var pointerMaterial = new BABYLON.StandardMaterial("pointerMaterial", ex.scene);
	    pointerMaterial.diffuseTexture = new BABYLON.Texture("/assets/img/pointer.v2.png", ex.scene);
	    pointerMaterial.diffuseTexture.hasAlpha = true;
	    pointerMaterial.useAlphaFromDiffuseTexture = true;
	    pointerMaterial.backFaceCulling = true;
	    pointerMaterial.emmsiveColor = new BABYLON.Color3(1, 1, 1);
	    pointerMaterial.ambientColor = new BABYLON.Color3(1, 1, 1);

	    ex.pointer.material = pointerMaterial;
	    ex.pointer.material.alpha = .75;

	},

	populateVideo : function(video) {
	    
	    //create mat
		var sphereMat = new BABYLON.StandardMaterial("mat", ex.scene);
			sphereMat.backFaceCulling = false;
			sphereMat.diffuseTexture = new BABYLON.VideoTexture("video", video, ex.scene, true, true);

		ex.objects.videoSphere.material = sphereMat;

	},

	destroy : function() {

		ex.videos.toload.pause();
		ex.videos.toload.src = '';

		for(key in ex.timers) {
			clearInterval(ex.timers[key]);
			clearTimeout(ex.timers[key]);
		}

		for(key in modals.timers) {
			clearInterval(modals.timers[key]);
			clearTimeout(modals.timers[key]);
		}

		for(key in modals.objects) {
			for(subkey in modals.objects[key]) {
				if(modals.objects[key][subkey] != null && $.isFunction(modals.objects[key][subkey].dispose) ) {
					modals.objects[key][subkey].dispose();
				}
			}
			//delete modals.objects[key];
		}

		for(key in ex.objects) {
			if(ex.objects[key] != null && $.isFunction(ex.objects[key].dispose) ) {
				console.log('disposing '+key)
				ex.objects[key].dispose();
			} else {
				for(subkey in ex.objects[key]) {
					if( ex.objects[key][subkey] != null && $.isFunction(ex.objects[key][subkey].dispose) ) {
						ex.objects[key][subkey].dispose();
					}
				}	
			}
			//delete ex.objects[key];
		}

		for(key in ex.audio) {
			ex.audio[key].pause();
			ex.audio[key].dispose();
			//delete ex.audio[key];
		}
		
		ex.objects = {};
		ex.audio = {};
		modals.objects = {
			modals : {},
			buttons : {},
			pins : {}
		};

		if(platform == 'ios') {
			ex.lenseffects.main.dispose(true);
		}

		ex.running = false;
		//ex.scene.dispose();
	}
}


    // Find the right method, call on correct element
	function launchIntoFullscreen(element) {
		if(element.requestFullscreen) {
			element.requestFullscreen();
		} else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if(element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if(element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	}