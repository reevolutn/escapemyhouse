var ex = window.ex || {};

//
//	CODED BY FCBNZ - ANDREW JACKSON
//
//	(╯°□°）╯︵ ┻━┻
//


ex = {

	canvas : false,
	engine : false,
	timers : {},
	cameras : {},
	activeCamera : 'desktop',
	lenseffects : {},
	data : {},
	objects : {
		temperatureGauge : false,
		buttons : {},
		pins : {},
		modals : {}
	},
	fadeIn : 0,
	playerheight : 1,
	pointer : false,
	collisiontimers : {
		pointer_expand : false
	},
	ishit : {
		pin :false,
		button:false
	},
	pointerScaling : {
		init : .1,
		current : .1,
		length : 6,
	},
	videos : {
		current : 'lounge',
		lounge : {
			mobile  : u.videoStream+'lounge_2k.mp4',
			desktop : u.videoStream+'lounge_4k.mp4',
			startrotation : {
				y : .5
			} 
		},
		hallway : {
			mobile  : u.videoStream+'hallway_2k.mp4',
			desktop : u.videoStream+'hallway_4k.mp4',
			startrotation : {
				y : 2.5
			} 
		}
	},

	init : function() {
		console.log('ex.init()');

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
			for(subkey in ex.objects[key]) {
				if( ex.objects[key][subkey] != null && $.isFunction(ex.objects[key][subkey].dispose) ) {
					ex.objects[key][subkey].dispose();
				}
			}
		}
		ex.scene.dispose();
	},

	create : function() {
		console.log('ex.create()');

        // get the canvas DOM element
        ex.canvas = document.getElementById('renderCanvas');

        // load the 3D engine
       	ex.engine = new BABYLON.Engine(ex.canvas, true);

        // call the createScene function
        ex.canvas = ex.createScene();
	    ex.scene.ambientColor = new BABYLON.Color3(1, 1, 1);

        //before rendering the scene
		ex.scene.registerBeforeRender(function() {

			//do stuff
			// if(ex.fadeIn != 1) {
			// 	ex.fadeIn += .0075;
			// 	ex.objects.sphereMat.emissiveColor = new BABYLON.Color3(ex.fadeIn,ex.fadeIn,ex.fadeIn);
			// }

			if(ex.activeCamera == 'vr') {
				//ex.objects.temperatureGauge.position.y = -(ex.scene.activeCamera.upVector.x * 8);
			} else {
				if(ex.objects.temperatureGauge != false) {
					ex.objects.temperatureGauge.position.y = ex.scene.activeCamera.rotation.x * 6;
				}
			}
			//$('#debug').html(ex.scene.activeCamera.upVector.x+'<br>'+ex.scene.activeCamera.upVector.y+'<br>'+ex.scene.activeCamera.upVector.z)

			//fix for interactivity
			//for(key in modals.objects.modals) {
				//if(modals.content[ex.videos.current][key].attachtocamera) {
					//console.log(key+' is attached to camera')
					//console.log(modals.objects.modals[key].position);
					//modals.objects.modals[key].position.x = 0;
				//}
			//}

			if(ex.pointer != false) {
				ex.hitDetection();
			}

		});

        // run the render loop
        ex.engine.runRenderLoop(function(){
            ex.canvas.render();
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', function(){
            ex.engine.resize();
        });

        //auto optimise every 10 seconds
		ex.optimiseGame();
		ex.timers.optimiseGame = setInterval(function() {
		  	ex.optimiseGame();
		}, 5000);	

	},

	hitDetection : function() {
		var index;
		var hashit = false;


		//check collisions for buttons
		for(key in modals.objects.buttons) {
			index = key+'button';

			if(ex.pointer.intersectsMesh(modals.objects.buttons[key], true)) {
				ex.ishit.button = true;
				hashit = true;
			} else {
				ex.ishit.button = false;
			}
		
			if(ex.ishit.button && (typeof ex.collisiontimers[index] == 'undefined' || ex.collisiontimers[index] == false) ) {
				
				//console.log('hovered on '+index)
				console.log('creating timeout for '+index);
				clearTimeout(ex.collisiontimers[index]);
				ex.collisiontimers[index] = setTimeout(function(key) {
					console.log('firing '+key+' onclick');
					modals.content[ex.videos.current][key].onclick();
				}, 1000, key);

				clearTimeout(modals.timers[index+"_autoout"]);

			} else if(!ex.ishit.button && typeof ex.collisiontimers[index] != 'undefined' && ex.collisiontimers[index] != false) {
				console.log('clearing timeout for '+index)
				clearTimeout(ex.collisiontimers[index]);
				ex.collisiontimers[index] = false;

				clearTimeout(modals.timers[index+"_autoout"]);
				modals.timers[index+"_autoout"] = setTimeout(function(modal) {
					modals.fadeOut(index);
				},1000,index);

			}
		}

		//check collisions for pins
		for(key in modals.objects.pins) {
			index = key+'pin';

			if(ex.pointer.intersectsMesh(modals.objects.pins[key], true)) {
				ex.ishit.pin = true;
				hashit = true;
			} else {
				ex.ishit.pin = false;
			}

			if(ex.ishit.pin && (typeof ex.collisiontimers[index] == 'undefined' || ex.collisiontimers[index] == false) ) {
				
				//console.log('hovered on '+index);
				console.log('creating timeout for '+index);
				clearTimeout(ex.collisiontimers[index]);
				ex.collisiontimers[index] = setTimeout(function(key) {
					console.log('firing '+key+' onmouseover');
					modals.content[ex.videos.current][key].onmouseover();
				}, 250, key);

				clearTimeout(modals.timers[index+"_autoout"]);

			} else if(!ex.ishit.pin && typeof ex.collisiontimers[index] != 'undefined' && ex.collisiontimers[index] != false) {
				
				console.log('clearing timeout for '+index)
				clearTimeout(ex.collisiontimers[index]);
				ex.collisiontimers[index] = false;

				clearTimeout(modals.timers[index+"_autoout"]);
				modals.timers[index+"_autoout"] = setTimeout(function(modal) {
					modals.fadeOut(index);
				},1000,index);

			}

		}

		if(hashit && ex.collisiontimers['pointer_expand'] == false  ) {
			console.log('expanding pointer');

			clearInterval(ex.collisiontimers['pointer_expand']);
			ex.collisiontimers['pointer_expand'] = setInterval(function() {
				if(ex.pointerScaling.current < .2) {
					ex.pointerScaling.current += .004;
					ex.pointer.scaling = new BABYLON.Vector3(ex.pointerScaling.current, ex.pointerScaling.length, ex.pointerScaling.current);
				}
			}, 33);

		} else if(!hashit && ex.collisiontimers['pointer_expand'] != false) {
			console.log('resetting pointer')
			ex.resetPointer();
		}

		//console.log(i);

	},

	resetPointer : function() {
		clearInterval(ex.collisiontimers['pointer_expand']);
		ex.collisiontimers['pointer_expand'] = false;
		ex.pointerScaling.current = ex.pointerScaling.init;
		ex.pointer.scaling = new BABYLON.Vector3(ex.pointerScaling.current, ex.pointerScaling.length, ex.pointerScaling.current);
	},

	optimiseGame : function() {
		//console.log('ex.optimiseGame()');
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

	createScene : function () {
		console.log('ex.createScene()');

		if(u.d.w < 800) {
    		launchIntoFullscreen(document.documentElement);
		}

		//create
		ex.scene = new BABYLON.Scene(ex.engine);
		ex.scene.clearColor = new BABYLON.Color3(0, 0, 0);

		//CAMERAS

	    //mobile - NON-VR 
	    ex.cameras.mobile = new BABYLON.DeviceOrientationCamera("camera1", new BABYLON.Vector3(0, ex.playerheight, 0), ex.scene);
	    ex.cameras.mobile.fov = 1;

	    //mobile - VR 
	    ex.cameras.vr = new BABYLON.VRDeviceOrientationFreeCamera("camera2", new BABYLON.Vector3(0, ex.playerheight, 0), ex.scene, true);
	    ex.cameras.vr.fov = 1;

	    //desktop
	    ex.cameras.desktop = new BABYLON.FreeCamera("camera_desktop", new BABYLON.Vector3(0, ex.playerheight, 0), ex.scene);
		//ex.cameras.desktop.inputs.attached.keyboard.attachControl();
	    ex.cameras.desktop.fov = 1.5;

	    if(u.camera == 'vr') {
	   		ex.scene.activeCamera = ex.cameras.vr;
	   		ex.activeCamera = 'vr';

	    } else if(u.camera == 'mobile') {
	   		ex.scene.activeCamera = ex.cameras.mobile;
	   		ex.activeCamera = 'mobile';

	    } else {
	   		ex.scene.activeCamera = ex.cameras.desktop;
	   		ex.activeCamera = 'desktop';
	    }

	    //set active camera
	    // if(u.d.w > 800) {
	   	// 	ex.scene.activeCamera = ex.cameras.desktop;
	   	// 	ex.activeCamera = 'desktop';
	    // } else {
	   	// 	ex.scene.activeCamera = ex.cameras.vr;
	   	// 	ex.activeCamera = 'vr';
	   	// 	//ex.scene.activeCamera = ex.cameras.mobile;
	   	// 	//ex.activeCamera = 'mobile';
	    // }
	    ex.scene.activeCamera.attachControl(ex.canvas, true);

	    //lens effect
		//post processing
		var parameters = {
			//edge_blur: 10,
			chromatic_aberration: 1,
			grain_amount: 1,
			//dof_focus_distance : 0.25,
			//distortion: 10
		};
		// ex.lenseffects.effect1 = new BABYLON.LensRenderingPipeline('lensEffect1', parameters, ex.scene, 1.0, ex.cameras.mobile);
		// ex.lenseffects.effect2 = new BABYLON.LensRenderingPipeline('lensEffect2', parameters, ex.scene, 1.0, ex.cameras.vr);
		// ex.lenseffects.effect3 = new BABYLON.LensRenderingPipeline('lensEffect3', parameters, ex.scene, 1.0, ex.cameras.desktop);


	    //add image
	    ex.setFireVideoScene();
	   
	    return ex.scene;
	},

	setFireVideoScene : function() {

	    //create virtual pointer
	    if(ex.activeCamera != 'desktop') {
	    	ex.virtualPointer();
	    }
	   	
	   	//add temp gauge
	    //ex.temperatureGauge();
	    //ex.temperatureDisplay();

	    //set active camera
	    var videoURL;
		if(ex.activeCamera == 'desktop') {
			videoURL = ex.videos[ex.videos.current].desktop;
		} else {
			videoURL = ex.videos[ex.videos.current].mobile;
		}

		//fix for iOS
		$('#video_content').html('');
		$('#video_content').html('<video id="video" autoplay muted playsinline loop src="'+videoURL+'" style="display:none"></video>');
		var video = document.querySelector('video', false);
		makeVideoPlayableInline(video);

		video.addEventListener('loadeddata', function() {
			ex.populateVideo(videoURL);

		    //set sphere rotation offset
		    ex.objects.videoSphere.rotation.y = ex.videos[ex.videos.current].startrotation.y;

		    //play video
			ex.objects.videoTexture.video.play();

			//init modals
			if(ex.videos.current == 'lounge') {
				//ex.timers.start = setTimeout(function() {
					modals.show('intro');
				//}, 500);	
			} else if(ex.videos.current == 'hallway') {
				//ex.timers.start = setTimeout(function() {
					modals.show('lounge');
					modals.show('hallway_fire');
					modals.show('no_exit');
					modals.show('exit_other_window');
					modals.show('bojangles');
					//modals.show('tablet');
					modals.show('keys');
					modals.show('locked_door');
					modals.show('exit_door');
				//}, 500);	
			}

			ex.placeAudio();

		}, false);
	},

	placeAudio : function() {

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

		//place sounds
		var fire1 = new BABYLON.Sound("fire1", "/assets/audio/lounge/fire1.mp3", ex.scene, null, params);
    	fire1.setPosition(new BABYLON.Vector3(-12, 0, 11));
    	fire1.setVolume(basevol/2);

		var fire2 = new BABYLON.Sound("fire2", "/assets/audio/lounge/fire2.mp3", ex.scene, null, params);
    	fire2.setPosition(new BABYLON.Vector3(-12, 0, 11));
    	fire2.setVolume(basevol);

		var glass = new BABYLON.Sound("glass", "/assets/audio/lounge/glass.mp3", ex.scene, null, params);
    	glass.setPosition(new BABYLON.Vector3(-13, 0, -5));
    	glass.setVolume(basevol);


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

	temperatureDisplay : function() {

		ex.objects.temperatureCrosshair = BABYLON.Mesh.CreatePlane("temperatureCrosshair", 6, ex.scene, false);
		ex.objects.temperatureCrosshair.material = new BABYLON.StandardMaterial("temperatureCrosshair", ex.scene);
	    ex.objects.temperatureCrosshair.material.diffuseTexture = new BABYLON.Texture("/assets/img/crosshair.png", ex.scene);

	    ex.objects.temperatureCrosshair.material.diffuseTexture.hasAlpha = true;
	    ex.objects.temperatureCrosshair.material.useAlphaFromDiffuseTexture = true;
	    ex.objects.temperatureCrosshair.material.backFaceCulling = true;

		ex.objects.temperatureCrosshair.position = new BABYLON.Vector3(0, 0, 15);
		ex.objects.temperatureCrosshair.parent = ex.scene.activeCamera;

		ex.objects.temperatureCrosshair.scaling = new BABYLON.Vector3(.25, .25, .25);


		ex.objects.temperatureReadout = BABYLON.Mesh.CreatePlane("temperatureReadout", 6, ex.scene, false);
		ex.objects.temperatureReadout.material = new BABYLON.StandardMaterial("temperatureReadout", ex.scene);
		ex.objects.temperatureReadout.position = new BABYLON.Vector3(0, 0, 15);
		ex.objects.temperatureReadout.parent = ex.scene.activeCamera;

		ex.objects.temperatureReadout.material.diffuseTexture = new BABYLON.DynamicTexture("dynamic texture", 256, ex.scene, true);
		ex.objects.temperatureReadout.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
		ex.objects.temperatureReadout.material.backFaceCulling = false;
	    ex.objects.temperatureReadout.material.diffuseTexture.hasAlpha = true;

		ex.objects.temperatureReadout.scaling = new BABYLON.Vector3(.5, .5, .5);

		ex.objects.temperatureReadout.material.diffuseTexture.drawText("30 degrees", null, 230, "20px Quicksand", "white");


	},

	virtualPointer : function() {

	    ex.pointer = BABYLON.MeshBuilder.CreateCylinder("pointer", { diameterTop: .5, diameterBottom: .5 }, ex.scene);
	    ex.pointer.parent = ex.scene.activeCamera;
		ex.pointer.scaling = new BABYLON.Vector3(ex.pointerScaling.init, ex.pointerScaling.length, ex.pointerScaling.init);
	    ex.pointer.position.z = 8;
	    ex.pointer.rotation.x = Math.PI/2;

	    var pointerMaterial = new BABYLON.StandardMaterial("pointerMaterial", ex.scene);
	    pointerMaterial.emmsiveColor = new BABYLON.Color3(1, 1, 0);
	    pointerMaterial.ambientColor = new BABYLON.Color3(1, 1, 0);
	    ex.pointer.material = pointerMaterial;

	    ex.pointer.material.alpha = .75;

		//pointer.hasAlpha = true;
		//pointer.alpha = .5;
	},

	populateVideo : function(videoURL) {

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
		ex.objects.pointLight2.diffuse = new BABYLON.Color3(1, 1, 1);
		ex.objects.pointLight2.specular = new BABYLON.Color3(1, 1, 1);
	    ex.objects.pointLight2.intensity = .35;

	    //create projection sphere
	    ex.objects.videoSphere = BABYLON.Mesh.CreateSphere("video_sphere", 32, 32, ex.scene);
	    //ex.objects.videoSphere.position.y = 1;
	    
	    //create mat
		ex.objects.sphereMat = new BABYLON.StandardMaterial("mat", ex.scene);
		ex.objects.sphereMat.backFaceCulling = false;
		//ex.objects.sphereMat.emissiveColor = new BABYLON.Color3(ex.fadeIn,ex.fadeIn,ex.fadeIn);
		ex.objects.sphereMat.emissiveColor = new BABYLON.Color3(1,1,1);
		
		//assign video
		ex.objects.videoTexture = new BABYLON.VideoTexture("video", video, ex.scene, true, true);
		ex.objects.sphereMat.diffuseTexture = ex.objects.videoTexture;
		ex.objects.videoSphere.material = ex.objects.sphereMat;

	},

	temperatureGauge : function() {

		ex.objects.temperatureGauge = BABYLON.MeshBuilder.CreatePlane(
			"plane", {
				width: 		1,
				height: 	24,
				updatable: 	true
			}, ex.scene
		);

		//ex.objects.temperatureGauge.position.z = 2;
		//ex.objects.temperatureGauge.position.x = 1.5;
		if(ex.activeCamera == 'vr') {
			ex.objects.temperatureGauge.rotation.y = -Math.PI/4;
		} else {
			ex.objects.temperatureGauge.parent = ex.scene.activeCamera;
		}

		ex.objects.temperatureGaugeMat = new BABYLON.StandardMaterial("texture2", ex.scene);
		//ex.objects.temperatureGaugeMat.diffuseColor = new BABYLON.Color3(0,0,0);

	    ex.objects.temperatureGaugeMat.diffuseTexture = new BABYLON.Texture('/assets/img/temp.png', ex.scene);
	    ex.objects.temperatureGaugeMat.diffuseTexture.hasAlpha = true;
	    ex.objects.temperatureGaugeMat.useAlphaFromDiffuseTexture = true;

		ex.objects.temperatureGaugeMat.alpha = 0.5;

	    ex.objects.temperatureGaugeMat.emmsiveColor = new BABYLON.Color3(1, 1, 1);
	    ex.objects.temperatureGaugeMat.ambientColor = new BABYLON.Color3(1, 1, 1);

		ex.objects.temperatureGaugeMat.backFaceCulling = false;
		ex.objects.temperatureGauge.material = ex.objects.temperatureGaugeMat;


   	 	ex.objects.temperatureGauge.setPivotMatrix(BABYLON.Matrix.Translation((u.d.w*.0028), 0, 5));


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
