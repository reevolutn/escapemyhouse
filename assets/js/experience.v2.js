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
	fadeIn : 0,
	playerheight : 1,
	pointer : false,
	collisiontimers : {},
	ishit : {
		pin :false,
		button:false
	},
	pointerScaling : {
		init : .05,
		current : .05,
		length : .05
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
	running : false,

	init : function() {
		console.log('ex.init()');

		//preload video
		// var videoHTML;
		// if(u.d.w > 1100 && platform != 'ios') {
		// 	ex.videos.lounge.current = ex.videos.lounge.desktop;
		// }
		// $('#video_content2').html('<video id="video2" muted playsinline loop src="'+ex.videos.lounge.current+'" style="display:none"></video>');
		// var video = document.getElementById('video2');

	},

	create : function() {
		console.log('ex.create()');

        //create the scene
        ex.scene = ex.createScene();

        //set background colour
	    ex.scene.ambientColor = new BABYLON.Color3(1, 1, 1);
		ex.scene.clearColor = new BABYLON.Color3(0, 0, 0);

	    //show loader
		$('.loader').fadeIn(1000);

		//place video 
		$('#video_content,#video_content2').html('');
		$('#video_content').html('<video id="video" muted playsinline preload="auto" loop src="'+ex.videos[ex.videos.current].current+'" style="display:none"></video>');
		ex.videos.toload = document.getElementById('video');
		ex.videos.toload.load();
		window.makeVideoPlayableInline(ex.videos.toload);

		//correct time
		if(timer.current) {
			var s = parseInt(timer.current.format('m') * 60) + parseInt(timer.current.format('s'));
			if(s != 0) {
				console.log('jumping to '+s+'s in video' );
				ex.videos.toload.addEventListener('loadedmetadata', function() {
					this.currentTime = parseInt(timer.current.format('m') * 60) + parseInt(timer.current.format('s'))
				}, false);	
			}
		}

		//create video events
		u.videoPerLoaded = 0;
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
		// ex.timers.progress = setInterval(function() {
		// 	if(u.videoPerLoaded > .5) {
		// 		clearInterval(ex.timers.progress);
		// 		ex.canplaythrough();
		// 	}
		// }, 100)


	    //ex.particles(0,-3,7);

	    //timer
		if(!timer.isPlaced) {
			timer.isPlaced = true;
			timer.reset();
		}

        //before rendering the scene
		ex.scene.registerBeforeRender(function() {
			temp.beforeRender();
			timer.beforeRender();
			if(ex.pointer != false) {
				ex.hitDetection();
			}
		});

        //auto optimise every 10 seconds
		// ex.optimiseGame();
		// ex.timers.optimiseGame = setInterval(function() {
		//   	ex.optimiseGame();
		// }, 5000);

		//set this scene to active
		ex.running = true;

	},

	runRenderLoop : function() {
		ex.scene.render();
	},

	createScene : function () {
		console.log('ex.createScene()');

		if(u.d.w < 800) {
    		launchIntoFullscreen(document.documentElement);
		}

		//create
		var scene = new BABYLON.Scene(u.engine);

		//CAMERAS
	    //mobile - NON-VR 
	    ex.cameras.mobile = new BABYLON.DeviceOrientationCamera("ex_camera1", new BABYLON.Vector3(0, ex.playerheight, 0), scene);
	    ex.cameras.mobile.fov = 1.25;

	    //mobile - VR 
	    ex.cameras.vr = new BABYLON.VRDeviceOrientationFreeCamera("ex_camera2", new BABYLON.Vector3(0, ex.playerheight, 0), scene, true);
	    ex.cameras.vr.fov = 1;

	    //desktop
	    ex.cameras.desktop = new BABYLON.FreeCamera("ex_camera3", new BABYLON.Vector3(0, ex.playerheight, 0), scene);
	    ex.cameras.desktop.fov = 1.5;

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

		//weird fix for ios but ohwell
		//if(platform == 'ios') {
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
		//}
		scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline('mainEffect',  scene.activeCamera);

	    //attach control
	    scene.activeCamera.attachControl(u.canvas, true);
	    
	    return scene;
	},

	canplaythrough : function() {
		console.log('ex.canplaythrough() - video can play through');

		//load video into scene and create light sources
		ex.populateVideo(ex.videos.toload);

		//fade out loader
		$('.loader').fadeOut(1000);

		//remove onprogress and canplaythrough event
		ex.videos.toload.removeEventListener('progress', u.videoLoaded, false);
		ex.videos.toload.removeEventListener('canplaythrough', ex.canplaythrough, false);
		$('#behavior').html('');

	    //set sphere rotation offset
	    ex.objects.videoSphere.rotation.y = ex.videos[ex.videos.current].startrotation.y;

		//init modals
		modals.content[ex.videos.current].init();

	    //create virtual pointer
	    if(ex.activeCamera != 'desktop') {
	    	ex.virtualPointer();
	    }

		//place audio
		ex.placeAudio();

	    //place temp
		temp.init();

	    //place the timer
	    timer.place();

	    //resize for some weird reason
    	u.engine.resize();

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
				if(modals.objects.modals[index].visibility == true) {
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
			ex.pointerScaling.current += .003;
			ex.pointer.scaling = new BABYLON.Vector3(ex.pointerScaling.current, ex.pointerScaling.current, ex.pointerScaling.current);
		} else if(!pinexpand && ex.pointer && ex.pointerScaling.current > ex.pointerScaling.init) {
			ex.pointerScaling.current -= .009;
			ex.pointer.scaling = new BABYLON.Vector3(ex.pointerScaling.current, ex.pointerScaling.current, ex.pointerScaling.current);
		}

	},

	hitTest : function(mesh) {
		if (mesh.name != "pointer" && mesh.name != "video_sphere" && ( mesh.name.match(/button/gi) || mesh.name.match(/pin/gi) ) ) {
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

    	//fire position
	    //var sphere = BABYLON.Mesh.CreateSphere("fire1_shpere", 2, 2, ex.scene);
	    //sphere.position = new BABYLON.Vector3(-12, 0, 11);

    	//glass position
	    // var sphere = BABYLON.Mesh.CreateSphere("fire1_shpere", 2, 2, ex.scene);
	    // sphere.position = new BABYLON.Vector3(-13, 0, -5);

// place sounds
// var fire1 = new BABYLON.Sound("fire1", "/assets/audio/lounge/fire1.mp3", ex.scene, null, params);
// fire1.setPosition(new BABYLON.Vector3(-12, 0, 11));
// fire1.setVolume(basevol/2);

// var fire2 = new BABYLON.Sound("fire2", "/assets/audio/lounge/fire2.mp3", ex.scene, null, params);
// fire2.setPosition(new BABYLON.Vector3(-12, 0, 11));
// fire2.setVolume(basevol);

// var glass = new BABYLON.Sound("glass", "/assets/audio/lounge/glass.mp3", ex.scene, null, params);
// glass.setPosition(new BABYLON.Vector3(-13, 0, -5));
// glass.setVolume(basevol);


		// var north = new BABYLON.Sound("north", "/assets/audio/lounge/north.mp3", ex.scene, null, params);
		//   	north.setPosition(new BABYLON.Vector3(0, 0, 15));
		//   	north.setVolume(basevol/2);

		// var south = new BABYLON.Sound("south", "/assets/audio/lounge/south.mp3", ex.scene, null, params);
		//   	south.setPosition(new BABYLON.Vector3(0, 0, -15));
		//   	south.setVolume(basevol/2);

		// var east = new BABYLON.Sound("east", "/assets/audio/lounge/east.mp3", ex.scene, null, params);
		//   	east.setPosition(new BABYLON.Vector3(15, 0, 0));
		//   	east.setVolume(basevol/2);

		// var west = new BABYLON.Sound("west", "/assets/audio/lounge/west.mp3", ex.scene, null, params);
		//   	west.setPosition(new BABYLON.Vector3(-15, 0, 0));
		//   	west.setVolume(basevol/2);


		//ex.particles(-10,0,3);

	},

	virtualPointer : function() {

	    ex.pointer = BABYLON.MeshBuilder.CreatePlane("pointer", 1, ex.scene);
	    ex.pointer.parent = ex.scene.activeCamera;
		ex.pointer.scaling = new BABYLON.Vector3(ex.pointerScaling.init, ex.pointerScaling.length, ex.pointerScaling.init);
	    ex.pointer.position.z = 2;

	    var pointerMaterial = new BABYLON.StandardMaterial("pointerMaterial", ex.scene);
	    pointerMaterial.diffuseTexture = new BABYLON.Texture("/assets/img/pointer.png", ex.scene);
	    pointerMaterial.diffuseTexture.hasAlpha = true;
	    pointerMaterial.useAlphaFromDiffuseTexture = true;
	    pointerMaterial.backFaceCulling = true;
	    pointerMaterial.emmsiveColor = new BABYLON.Color3(1, 1, 1);
	    pointerMaterial.ambientColor = new BABYLON.Color3(1, 1, 1);
	    ex.pointer.material = pointerMaterial;

	    ex.pointer.material.alpha = .75;

		//pointer.hasAlpha = true;
		//pointer.alpha = .5;
	},

	populateVideo : function(video) {

		//create light source for fire
	    ex.objects.pointLight1 = new BABYLON.PointLight("pointLight1", new BABYLON.Vector3(-12, 0, 0), ex.scene);
		ex.objects.pointLight1.diffuse = new BABYLON.Color3(1, .4, 0);
		ex.objects.pointLight1.specular = new BABYLON.Color3(1, .4, 0);
	    ex.objects.pointLight1.intensity = .4;

	    //set an interval to flicker the fire
	    ex.timers.flicker = setInterval(function() {
	   		ex.objects.pointLight1.intensity = ( Math.random() * (40 - 25) + 25 ) / 100;
	    }, 100);

		//create light source for window
	    ex.objects.pointLight2 = new BABYLON.PointLight("pointLight2", new BABYLON.Vector3(0, 2, -10), ex.scene);
		ex.objects.pointLight2.diffuse = new BABYLON.Color3(1,1,1);
		ex.objects.pointLight2.specular = new BABYLON.Color3(1,1,1);
	    ex.objects.pointLight2.intensity = .35;

	    //create projection sphere
	    ex.objects.videoSphere = BABYLON.Mesh.CreateSphere("video_sphere", 32, 32, ex.scene);
	    //ex.objects.videoSphere.position.y = 1;

	    ex.objects.sphereVideo = new BABYLON.VideoTexture("video", video, ex.scene, true, true);
	    //ex.objects.sphereVideo = new BABYLON.VideoTexture("video", [ex.videos[ex.videos.current].current], ex.scene, true, true);
	    
	    //create mat
		var sphereMat = new BABYLON.StandardMaterial("mat", ex.scene);
		sphereMat.backFaceCulling = false;
		sphereMat.emissiveColor = new BABYLON.Color3(1,1,1);
		sphereMat.diffuseTexture = ex.objects.sphereVideo;

		ex.objects.videoSphere.material = sphereMat;

	    //play video
		ex.objects.sphereVideo.video.play();

	},

	destroy : function() {
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
		}
		for(key in ex.objects) {
			if(ex.objects[key] != null && $.isFunction(ex.objects[key].dispose) ) {
				ex.objects[key].dispose();
			} else {
				for(subkey in ex.objects[key]) {
					if( ex.objects[key][subkey] != null && $.isFunction(ex.objects[key][subkey].dispose) ) {
						ex.objects[key][subkey].dispose();
					}
				}	
			}
		}
		ex.running = false;
		ex.lenseffects.main.dispose(true);
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
