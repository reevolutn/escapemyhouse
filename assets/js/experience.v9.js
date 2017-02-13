var ex = window.ex || {};

//
//	DESIGNED/CODED BY FCBNZ - ANDREW JACKSON
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
		speed: .1,
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
	//you can adjust the scale of the virtual pointer here
	pointerScaling : {
		init : .11,
		current : .11,
		length : .11
	},
	//which experiences should use the virtual pointer?
	usePointer : {
		vr : 		true,
		mobile: 	true,
		desktop : 	false
	},
	//videos
	videos : {
		current : 'lounge',
		lounge : {
			current : u.videoStream+'lounge_2k.mp4',
			//video resolution 
			low 	: u.videoStream+'lounge_1k.mp4',
			medium  : u.videoStream+'lounge_2k.mp4',
			high 	: u.videoStream+'lounge_4k.mp4',
			startrotation : {
				y : .5
			} 
		},
		hallway : {
			current : u.videoStream+'hallway_2k.mp4',
			//video resolution
			low 	: u.videoStream+'hallway_1k.mp4',
			medium  : u.videoStream+'hallway_2k.mp4', 
			high	: u.videoStream+'hallway_4k.mp4',
			startrotation : {
				y : 2.5
			} 
		},
		//what percentage of the video should load before launching into the experience
		//reducing these numbers will reduce load times but increase the chance of playback issues during the experience
		minload : {
			ios 	: 	.1,
			android : 	.2,
			auto 	: 	.2
		},
		toload : {}
	},
	audio : {},
	running : false,

	init : function() {
		console.log('ex.init()');
	},

	create : function() {
		console.log('ex.create()');

		//max for vr is medium atm
		if(u.camera == 'vr' && u.bandwidth != 'low') {
			u.bandwidth = 'medium';
			u.setVideoBandwidth();
		}

		//update the hash for history
		navigate.push('experience');

		//create the scene
		u.currentScene = ex.videos.current;
		u.setBodyClass();
		ex.scene = ex.createScene();

		//track page
		google.trackPage(u.currentScene+' experience', '/experience/'+u.currentScene);

		//set background colour
		ex.scene.ambientColor = new BABYLON.Color3(1, 1, 1);
		ex.scene.clearColor = new BABYLON.Color3(0, 0, 0);

		//show loader
		if(detect.os.name != 'ios') {
			$('.bandwidthSelect').show();
		} else {
			$('.bandwidthSelect').hide();
		}
		$('.loader').show();

		//place video 
		ex.videos.toload[ex.videos.current] = document.createElement('video');
		ex.videos.toload[ex.videos.current].preload = 'auto';
		ex.videos.toload[ex.videos.current].muted = true;
		ex.videos.toload[ex.videos.current].playsinline = true;
		ex.videos.toload[ex.videos.current].src = ex.videos[ex.videos.current].current;
		ex.videos.toload[ex.videos.current].load();
 		document.getElementById("videos").appendChild(ex.videos.toload[ex.videos.current]);
		window.makeVideoPlayableInline(ex.videos.toload[ex.videos.current]);

		//jump to the correct time in the video
		if(timer.videoStart != 0) {
			console.log('jumping to '+timer.videoStart+'s in video' );
			ex.videos.toload[ex.videos.current].addEventListener('loadedmetadata', function() {
				ex.videos.toload[ex.videos.current].currentTime = timer.videoStart;
				ex.videos.toload[ex.videos.current].play();
			}, false);
		}

		//set initial loader values
		u.videoPerLoaded = 0;
		u.videoPerLoadedOver = 0;
		$('.per_output').html('0%');

		//can play through event
		ex.videos.toload[ex.videos.current].addEventListener('canplaythrough',
			ex.canplaythrough,
			false
		);

		//before rendering the scene do stuff...
		ex.scene.registerBeforeRender(function() {
			if(ex.running) {
				timer.beforeRender();
				if(ex.pointer) {
					ex.hitDetection(ex.scene);
				}
			}
		});

		//set this scene to active
		ex.running = true;

	},

	runRenderLoop : function() {
		//this function fades the scene in/out
		if(ex.fade.current != ex.fade.to && typeof ex.objects.videoSphere == 'object') {
			if(ex.fade.current > ex.fade.to ) {
				ex.fade.current -= ex.fade.speed;
			} else if(ex.fade.current < ex.fade.to ) {
				ex.fade.current += ex.fade.speed;
			}
			ex.fade.current = Math.round(ex.fade.current * 1000)/1000
			ex.objects.videoSphere.material.emissiveColor = new BABYLON.Color3(ex.fade.current,ex.fade.current,ex.fade.current);
			//console.log('fade');
		}
		if( typeof ex.objects.safezoneTitle == 'object') {
			ex.objects.safezoneTitle.rotation.y = ex.scene.activeCamera.rotation.y + .4;
		}
		//this is required to display the scene
		ex.scene.render();
	},

	createScene : function () {
		console.log('ex.createScene()');

		//try and go fulscreen, this only works on android
		if(u.d.w < 800 && detect.os.name != 'ios') {
			launchIntoFullscreen(document.documentElement);
		}

		//create the scene
		var scene = new BABYLON.Scene(u.engine);

		//u.camera = 'vr';

		//assign the correct camera settings depending on camera type
		if(u.camera == 'vr') {
			//mobile - VR 
			ex.cameras.vr = new BABYLON.VRDeviceOrientationFreeCamera("ex_camera2", new BABYLON.Vector3(0, ex.playerheight, 0), scene, false);
			ex.cameras.vr.fov = .8;
			//ex.cameras.vr.inertia = 5; //.9;
			ex.cameras.vr.speed = 10;
	   		scene.activeCamera = ex.cameras.vr;
	   		ex.activeCamera = 'vr';

		} else if(u.camera == 'mobile') {
			//mobile - NON-VR 
			ex.cameras.mobile = new BABYLON.DeviceOrientationCamera("ex_camera1", new BABYLON.Vector3(0, ex.playerheight, 0), scene);
			ex.cameras.mobile.fov = 1.25;
	   		scene.activeCamera = ex.cameras.mobile;
	   		ex.activeCamera = 'mobile';

		} else {
			//desktop
			ex.cameras.desktop = new BABYLON.FreeCamera("ex_camera3", new BABYLON.Vector3(0, ex.playerheight, 0), scene);
			ex.cameras.desktop.fov = 1.4;
			ex.cameras.desktop.inputs.camera.angularSensibility = -1000;
			ex.cameras.desktop.inputs.camera.inertia = .3;
	   		scene.activeCamera = ex.cameras.desktop;
	   		ex.activeCamera = 'desktop';
		}

		//try and force landscape, only works on android
		if(ex.activeCamera != 'desktop' && detect.os.name != 'ios') {
			u.setOrientation('landscape');
		}

		//for some reason, ios displays videos with a blue tint unless i add post processing
		if(detect.os.name == 'ios') {
			var parameters = {
				//chromatic_aberration	: 0,
				//edge_blur				: 20,
				//distortion			: 0,
				//grain_amount			: 0,
				//dof_focus_distance	: 200,
				//dof_aperture			: 0,
				//dof_darken			: 0,
				//dof_pentagon			: false,
				//dof_gain				: 0,
				//dof_threshold			: 0,
				blur_noise				: false
			};
			ex.lenseffects.main = new BABYLON.LensRenderingPipeline('mainEffect', parameters, scene, 1);
			scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline('mainEffect',  scene.activeCamera);
		}

		//attach input controls
		scene.activeCamera.attachControl(u.canvas, false);

		return scene;
	},

	canplaythrough : function(e) {
		console.log('ex.canplaythrough() - video can play through');
		ex.videos.toload[ex.videos.current].removeEventListener('canplaythrough', ex.canplaythrough, false);

		//load video into scene and create light sources
		ex.populateVideo(ex.videos.toload[ex.videos.current]);

		ex.timers.canplaythrough = setInterval(function(e) {
			u.videoLoaded(e);

			//wait for the video to start playing before fading in
			//if(ex.videos.toload[ex.videos.current].currentTime > 0) {
			if( (Math.round(u.videoPerLoaded*100)/100) >= ex.videos.minload[detect.os.name]) {

				//remove onprogress and canplaythrough event
				//ex.videos.toload[ex.videos.current].removeEventListener('progress', u.videoLoaded, false);

				//clear this interval
				clearInterval(ex.timers.canplaythrough);

				ex.videos.toload[ex.videos.current].currentTime = timer.videoStart;
				ex.videos.toload[ex.videos.current].play();

				//fade out loader
				$('.loader').hide();

				//set sphere rotation offset
				ex.objects.videoSphere.rotation.y = ex.videos[ex.videos.current].startrotation.y;

				//init modals
				modals.content[ex.videos.current].init();

				if(u.camera == 'mobile') {
			   		ex.scene.activeCamera.resetToCurrentRotation();
				}

				//place audio
				ex.placeAudio();

				//place temp
				//temp.init();

				//resize for some weird reason
				u.engine.resize();

				ex.fade.to = 1;

			}

		}, 200, e);

	},

	playAudio : function(startTime) {
		for(key in ex.audio) {
			ex.audio[key].play(0,startTime);
		}
		//fade in volume
		ex.timers.increaseVolume = setInterval(function() {
			ex.sounds.globalVolume += .02;
			BABYLON.Engine.audioEngine.setGlobalVolume(ex.sounds.globalVolume);
			if(ex.sounds.globalVolume >= 1) {
				clearInterval(ex.timers.increaseVolume);
			}
		}, 100)
	},

	hitDetection : function(scene) {
		var wm = scene.activeCamera.getWorldMatrix();
		var rayPick = new BABYLON.Ray(scene.activeCamera.position, new BABYLON.Vector3(wm.m[8], wm.m[9], wm.m[10]) );
		var meshFound = scene.pickWithRay(rayPick, ex.hitTest);
		var index;
		var pinexpand = false;
		
		if(meshFound.hit) {
			//console.log(meshFound.pickedMesh.name);

			if( meshFound.pickedMesh.name.match(/_btn1/gi) || meshFound.pickedMesh.name.match(/_btn2/gi) ) {
				index = meshFound.pickedMesh.name;

				//check for pin expand
				if(u.objects.buttons[index].visibility == true) {
					pinexpand = true;
				}

				//click
				if( (typeof ex.collisiontimers[index+"_click"] == 'undefined' || ex.collisiontimers[index+"_click"] == false) && u.objects.buttons[index].visibility == true ) {
					console.log('creating timeout for '+index);
					clearTimeout(ex.collisiontimers[index+"_click"]);
					ex.collisiontimers[index+"_click"] = setTimeout(function(index) {
						console.log('firing '+index+' onclick');
						u.objects.buttons[index].customcallback();
					}, 1500, index);
					clearTimeout(modals.timers[index+"_autoout"]);
				}


			//check for buttons
			} else if( meshFound.pickedMesh.name.match(/button/gi) ) {
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
					}, 1500, index);
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
				
				//clear collision timer
				clearTimeout(ex.collisiontimers[key]);
				delete ex.collisiontimers[key];

				index = key.replace("_mouseover", "");
				index = index.replace("_click", "");
				console.log('creating mouseout out for '+index);

				clearTimeout(modals.timers[index+"_autoout"]);
				modals.timers[index+"_autoout"] = setTimeout(function(index) {	
					delete ex.collisiontimers[index];
					if(typeof modals.content[ex.videos.current][index] == 'object') {
						modals.content[ex.videos.current][index].onmouseout();
					}
				}, 750, index);
			}

		}

		//resize pointer
		if(pinexpand && ex.pointer && ex.pointerScaling.current < .2) {
			ex.pointerScaling.current += .002;
			ex.pointer.scaling = new BABYLON.Vector3(ex.pointerScaling.current, ex.pointerScaling.current, ex.pointerScaling.current);
		} else if(!pinexpand && ex.pointer && ex.pointerScaling.current > ex.pointerScaling.init) {
			ex.pointerScaling.current -= .008;
			ex.pointer.scaling = new BABYLON.Vector3(ex.pointerScaling.current, ex.pointerScaling.current, ex.pointerScaling.current);
		}

	},

	hitTest : function(mesh) {
		if ( mesh.name.match(/button/gi) || mesh.name.match(/pin/gi) || mesh.name.match(/_btn/gi)) {
			return true;
		} else {
			return false;
		}
	},

	sounds : {
		ready : 0,
		total : 0,
		globalVolume : 0
	},
	placeAudio : function() {
		console.log('ex.placeAudio()');

		//reset vars
		ex.sounds.ready = 0;
		ex.sounds.total = 0;

		var params = {
			loop: false, 
			autoplay: false, 
			spatialSound: true,
			distanceModel: "exponential",
			rolloffFactor: 1
		}

		var basevol = 10;

		if(ex.videos.current == 'lounge') {

			//place sounds
			ex.audio.fire_crackle = new BABYLON.Sound("fire_crackle", "/assets/audio/lounge/Fire Crackle.mp3", ex.scene, ex.soundReadyCallback, params);
			ex.audio.fire_crackle.setPosition(new BABYLON.Vector3(-12, 0, 11));
			ex.audio.fire_crackle.setVolume(basevol);
			//add to the toal sound count
			ex.sounds.total ++;

			ex.audio.fire_sfx = new BABYLON.Sound("fire_sfx", "/assets/audio/lounge/Fire SFX.mp3", ex.scene, ex.soundReadyCallback, params);
			ex.audio.fire_sfx.setPosition(new BABYLON.Vector3(-12, 0, 11));
			ex.audio.fire_sfx.setVolume(basevol*1.5);
			//add to the toal sound count
			ex.sounds.total ++;

			ex.audio.alarm = new BABYLON.Sound("alarm", "/assets/audio/lounge/Fire Alarm.mp3", ex.scene, ex.soundReadyCallback, params);
			ex.audio.alarm.setPosition(new BABYLON.Vector3(0, 11, 0));
			ex.audio.alarm.setVolume(basevol*.1);
			//add to the toal sound count
			ex.sounds.total ++;

			ex.audio.glass = new BABYLON.Sound("glass", "/assets/audio/lounge/Glass breaking four times.mp3", ex.scene, ex.soundReadyCallback, params);
			ex.audio.glass.setPosition(new BABYLON.Vector3(-13, 0, -5));
			ex.audio.glass.setVolume(basevol);
			//add to the toal sound count
			ex.sounds.total ++;

			// ex.audio.breathing = new BABYLON.Sound("breathing", "/assets/audio/lounge/Breathing Rode.mp3", ex.scene, ex.soundReadyCallback, params);	
			// ex.audio.breathing.setPosition(new BABYLON.Vector3(0, 0, 0));
			// ex.audio.breathing.setVolume(basevol*.5);
			// //add to the toal sound count
			// ex.sounds.total ++;

		} else if(ex.videos.current == 'hallway') {

			//place sounds
			ex.audio.fire_crackle = new BABYLON.Sound("fire_crackle", "/assets/audio/lounge/Fire Crackle.mp3", ex.scene, ex.soundReadyCallback, params);
			ex.audio.fire_crackle.setPosition(new BABYLON.Vector3(-12, 0, 11));
			ex.audio.fire_crackle.setVolume(basevol);
			//add to the toal sound count
			ex.sounds.total ++;

			ex.audio.fire_sfx = new BABYLON.Sound("fire_sfx", "/assets/audio/lounge/Fire SFX.mp3", ex.scene, ex.soundReadyCallback, params);
			ex.audio.fire_sfx.setPosition(new BABYLON.Vector3(-12, 0, 11));
			ex.audio.fire_sfx.setVolume(basevol*1.5);
			//add to the toal sound count
			ex.sounds.total ++;

			ex.audio.alarm = new BABYLON.Sound("alarm", "/assets/audio/lounge/Fire Alarm.mp3", ex.scene, ex.soundReadyCallback, params);
			ex.audio.alarm.setPosition(new BABYLON.Vector3(0, 11, 0));
			ex.audio.alarm.setVolume(basevol*.1);
			//add to the toal sound count
			ex.sounds.total ++;

			ex.audio.glass = new BABYLON.Sound("glass", "/assets/audio/lounge/Glass breaking four times.mp3", ex.scene, ex.soundReadyCallback, params);
			ex.audio.glass.setPosition(new BABYLON.Vector3(-13, 0, -5));
			ex.audio.glass.setVolume(basevol*.5);
			//add to the toal sound count
			ex.sounds.total ++;

			// ex.audio.breathing = new BABYLON.Sound("breathing", "/assets/audio/lounge/Breathing Rode.mp3", ex.scene, ex.soundReadyCallback, params);
			// ex.audio.breathing.setPosition(new BABYLON.Vector3(0, 0, 0));
			// ex.audio.breathing.setVolume(basevol*.5);
			// //add to the toal sound count
			// ex.sounds.total ++;
		}

		//set global volue to 0 so we can fade in the sound after its loaded
		ex.sounds.globalVolume = 0;
		BABYLON.Engine.audioEngine.setGlobalVolume(ex.sounds.globalVolume);

		// if(timer.videoStart != 0) {
		// 	console.log('jumping to '+timer.videoStart+'s in audio' );
		// 	for(key in ex.audio) {
		// 		ex.audio[key].play(timer.videoStart);
		// 	}
		// }

	},

	soundReadyCallback : function() {
		ex.sounds.ready ++;
		console.log(ex.sounds.ready+'/'+ex.sounds.total+' sounds loaded');
		if(ex.sounds.ready == ex.sounds.total) {
			console.log('starting all sounds '+ex.videos.toload[ex.videos.current].currentTime+'s in');
			//play audio from correct time
			ex.playAudio(ex.videos.toload[ex.videos.current].currentTime);
		}
	},

	virtualPointer : function(scene) {
		console.log('ex.virtualPointer(scene);')

		ex.pointer = BABYLON.MeshBuilder.CreatePlane("pointer", 1, scene);
		ex.pointer.parent = scene.activeCamera;
		ex.pointerScaling.current = .5;
		ex.pointer.scaling = new BABYLON.Vector3(ex.pointerScaling.current, ex.pointerScaling.current, ex.pointerScaling.current);
		ex.pointer.position.z = 2;

		var pointerMaterial = new BABYLON.StandardMaterial("pointerMaterial", scene);
		pointerMaterial.diffuseTexture = new BABYLON.Texture("/assets/img/pointer.v4.png", scene);
		pointerMaterial.diffuseTexture.hasAlpha = true;
		pointerMaterial.useAlphaFromDiffuseTexture = true;
		pointerMaterial.backFaceCulling = true;
		pointerMaterial.emmsiveColor = new BABYLON.Color3(1, 1, 1);
		pointerMaterial.ambientColor = new BABYLON.Color3(1, 1, 1);

		ex.pointer.material = pointerMaterial;
		ex.pointer.material.alpha = .75;

	},

	populateVideo : function(video) {
		console.log('ex.populateVideo()');

		//create light source for fire
		ex.objects.pointLight1 = new BABYLON.PointLight("pointLight1", new BABYLON.Vector3(-12, 0, 0 /* 11 */), ex.scene);
		ex.objects.pointLight1.diffuse = new BABYLON.Color3(1, .4, 0);
		ex.objects.pointLight1.specular = new BABYLON.Color3(1, .4, 0);
		ex.objects.pointLight1.intensity = .5;

		// ex.objects.pointLight1a = new BABYLON.PointLight("pointLight1a", new BABYLON.Vector3(-12, 0, 0), ex.scene);
		// ex.objects.pointLight1a.diffuse = new BABYLON.Color3(1, .4, 0);
		// ex.objects.pointLight1a.specular = new BABYLON.Color3(1, .4, 0);
		// ex.objects.pointLight1a.intensity = .5;

		//set an interval to flicker the fire
		ex.timers.flicker = setInterval(function() {
	   		ex.objects.pointLight1.intensity = ( Math.random() * (50 - 25) + 25 ) / 100;
	   		//ex.objects.pointLight1a.intensity = ( Math.random() * (50 - 25) + 25 ) / 100;
		}, 100);

		//create light source for window
		ex.objects.pointLight2 = new BABYLON.PointLight("pointLight2", new BABYLON.Vector3(-12, .5, -7), ex.scene);
		ex.objects.pointLight2.diffuse = new BABYLON.Color3(1,1,1);
		ex.objects.pointLight2.specular = new BABYLON.Color3(1,1,1);
		ex.objects.pointLight2.intensity = .35;


		// ex.objects.safezone1 = BABYLON.MeshBuilder.CreatePlane(
		// 	'safezone1', {
		// 		width:  2,
		// 		height: 2
		// 	}, ex.scene
		// );
		// ex.objects.safezone1.position = new BABYLON.Vector3(-12, 0, 11);
		// ex.objects.safezone1.emissiveColor = new BABYLON.Color3(1,1,1);
		// ex.objects.safezone1.rotation.x = Math.PI / 2;


		//create projection sphere
		ex.objects.videoSphere = BABYLON.Mesh.CreateSphere("video_sphere", 32, 32, ex.scene);
		//ex.objects.videoSphere.position.y = 1;

		ex.objects.sphereVideo = new BABYLON.VideoTexture("video", video, ex.scene, true, true);
		//ex.objects.sphereVideo = new BABYLON.VideoTexture("video", [ex.videos[ex.videos.current].current], ex.scene, true, true);
		
		//create mat
		var sphereMat = new BABYLON.StandardMaterial("mat", ex.scene);
		sphereMat.backFaceCulling = false;
		sphereMat.diffuseTexture = ex.objects.sphereVideo;

		ex.objects.videoSphere.material = sphereMat;

		ex.fade.current = 0;
		ex.fade.to = 0;
		ex.objects.videoSphere.material.emissiveColor = new BABYLON.Color3(ex.fade.current,ex.fade.current,ex.fade.current);

		//play video
		ex.videos.toload[ex.videos.current].play();

		//ex.placeSafeZone();

	},

	placeSafeZone : function() {


		//place safe zone
		ex.objects.safezone = BABYLON.MeshBuilder.CreateDisc(
			'safezone', {
				radius : 13
			}, ex.scene
		);
		ex.objects.safezone.position = new BABYLON.Vector3(0, -6, 0);
		ex.objects.safezone.rotation.x = Math.PI / 2;

		var safezoneMat = new BABYLON.StandardMaterial("mat", ex.scene);
		safezoneMat.diffuseTexture = new BABYLON.Texture('/assets/img/safezone.png', ex.scene);
		safezoneMat.diffuseTexture.hasAlpha = true;
		safezoneMat.useAlphaFromDiffuseTexture = true;
		safezoneMat.backFaceCulling = true;
		safezoneMat.emissiveColor = new BABYLON.Color3(1,1,1);
		ex.objects.safezone.material = safezoneMat;
		//ex.objects.safezone.alpha = .6;

		//place safe zone title
		ex.objects.safezoneTitle = BABYLON.MeshBuilder.CreatePlane(
			"safezoneTitle", {
				width:  1.5,
				height: .75
			}, ex.scene
		);
		ex.objects.safezoneTitle.position = new BABYLON.Vector3(0, 0, 0);
		ex.objects.safezoneTitle.setPivotMatrix(BABYLON.Matrix.Translation(0, -5.25, 13));
		ex.objects.safezoneTitle.rotation.y = .4;

		var safezoneTitleMat = new BABYLON.StandardMaterial("mat", ex.scene);
		safezoneTitleMat.diffuseTexture = new BABYLON.Texture('/assets/img/safezone-title.png', ex.scene);
		safezoneTitleMat.diffuseTexture.hasAlpha = true;
		safezoneTitleMat.useAlphaFromDiffuseTexture = true;
		safezoneTitleMat.backFaceCulling = true;
		safezoneTitleMat.emissiveColor = new BABYLON.Color3(1,1,1);
		ex.objects.safezoneTitle.material = safezoneTitleMat;


	},

	destroy : function() {
		console.log('ex.destroy()');
		//this function just goes through all the objects and timers and removes/destroys them

		//ex.videos.toload[ex.videos.current].removeEventListener('canplaythrough', ex.canplaythrough, false);

		ex.pointer = false;
		ex.running = false;
		if(typeof ex.objects.videoSphere == 'object') {
			ex.objects.videoSphere.material.emissiveColor = new BABYLON.Color3(ex.fade.to,ex.fade.to,ex.fade.to);
		}

		for(key in ex.timers) {
			clearInterval(ex.timers[key]);
			clearTimeout(ex.timers[key]);
		}

		for(key in timer.objects) {
			timer.objects[key].dispose();
		}

		for(key in modals.timers) {
			clearInterval(modals.timers[key]);
			clearTimeout(modals.timers[key]);
		}

		if(detect.os.name != 'ios') {
			console.log('killing video');
			ex.videos.toload[ex.videos.current].pause();
			ex.videos.toload[ex.videos.current].src = '';
			ex.videos.toload[ex.videos.current].load();		
			console.log('killed video');
		}

		for(key in modals.objects) {
			for(subkey in modals.objects[key]) {
				if(modals.objects[key][subkey] != null && $.isFunction(modals.objects[key][subkey].dispose) ) {
					modals.objects[key][subkey].dispose();
				}
			}
		}
		console.log('killed modals.objects');

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
		console.log('killed ex.objects');

		for(key in ex.audio) {
			ex.audio[key].pause();
			ex.audio[key].dispose();	
		}
		console.log('killed ex.audio');
		
		ex.audio = {};
		ex.objects = {};
		modals.objects = {
			modals : {},
			buttons : {},
			pins : {}
		};
		u.videoPerLoaded = 0;
		u.videoPerLoadedOver = 0;
		console.log('reset vars');

		if(detect.os.name == 'ios') {
			ex.lenseffects.main.dispose(true);
		}
		timer.isPlaced = false;
		console.log('timer.isPlaced = false');
		ex.scene.dispose();
		console.log('ex.scene.dispose()');
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
