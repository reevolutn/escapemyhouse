var sv = window.sv || {};

//
//	DESIGNED/CODED BY FCBNZ - ANDREW JACKSON
//
//	(╯°□°）╯︵ ┻━┻
//

sv = {

	scene : false,
	objects : {},
	cameras : {},
	timers : {},
	running: false,
	fade : {
		current : 1,
		speed: .02,
		to : 1
	},
	videos : {},

	init : function() {

	},


	destroy : function() {
		for(key in sv.timers) {
			clearInterval(sv.timers[key]);
			clearTimeout(sv.timers[key]);
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
		for(key in sv.objects) {
			if(sv.objects[key] != null && $.isFunction(sv.objects[key].dispose) ) {
				sv.objects[key].dispose();
			} else {
				for(subkey in sv.objects[key]) {
					if( sv.objects[key][subkey] != null && $.isFunction(sv.objects[key][subkey].dispose) ) {
						sv.objects[key][subkey].dispose();
					}
				}	
			}
		}
		sv.running = false;
		//ex.scene.dispose();
	},

	create : function() {
		console.log('sv.create()');

		u.currentScene = 'streetview';
		google.trackPage(u.currentScene+' experience', '/experience/'+u.currentScene);
		u.setBodyClass();

		//show loader
		$('.loader').show();

		// call the createScene function
		sv.scene = sv.createScene();
		sv.scene.ambientColor = new BABYLON.Color3(1, 1, 1);

		//add image
		sv.populateGoogleImage();

		//before rendering the scene
		sv.scene.registerBeforeRender(function() {
			if(ex.pointer) {
				ex.hitDetection(sv.scene);
			}
		});

		sv.running = true;


		//auto optimise every 10 seconds
		// sv.optimiseGame();
		// sv.timers.optimiseGame = setInterval(function() {
		//   	sv.optimiseGame();
		// }, 5000);	

	},

	runRenderLoop : function() {
		if(sv.fade.current != sv.fade.to ) {
			if(sv.fade.current > sv.fade.to ) {
				sv.fade.current -= sv.fade.speed;
			} else if(sv.fade.current < sv.fade.to ) {
				sv.fade.current += sv.fade.speed;
			}
			sv.fade.current = Math.round(sv.fade.current * 1000)/1000
			sv.objects.fireVideo.emissiveColor = new BABYLON.Color3(sv.fade.current,sv.fade.current,sv.fade.current);
			sv.objects.smokeVideo.emissiveColor = new BABYLON.Color3(sv.fade.current,sv.fade.current,sv.fade.current);
			sv.objects.imageSphere.emissiveColor = new BABYLON.Color3(sv.fade.current,sv.fade.current,sv.fade.current);
			console.log('fade');
		}

		sv.scene.render();
	},

	optimiseGame : function() {
		//console.log('sv.optimiseGame()');
		BABYLON.SceneOptimizer.OptimizeAsync(
			sv.scene, 
			BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed(20,2000),
			function() {
				// On success
				console.log('sv.optimiseGame() - high quality')
			}, function() {
				// FPS target not reached
				console.log('sv.optimiseGame() - low quality')
			}
		);
	},


	createScene : function () {
		console.log('sv.createScene()');

		//create
		var scene = new BABYLON.Scene(u.engine);
			scene.clearColor = new BABYLON.Color3(0, 0, 0);

		//CAMERAS

		if(u.camera == 'vr') {
			sv.cameras.vr = new BABYLON.VRDeviceOrientationFreeCamera("camera2", new BABYLON.Vector3(0, 0, 0), scene, false);
			sv.cameras.vr.fov = 1;
	   		scene.activeCamera = sv.cameras.vr;
	   		sv.activeCamera = 'vr';

		} else if(u.camera == 'mobile') {
			//mobile - NON-VR 
			sv.cameras.mobile = new BABYLON.DeviceOrientationCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
			sv.cameras.mobile.fov = 1;
	   		scene.activeCamera = sv.cameras.mobile;
	   		sv.activeCamera = 'mobile';

		} else {
			//desktop
			sv.cameras.desktop = new BABYLON.FreeCamera("camera_desktop", new BABYLON.Vector3(0, 0, 0), scene);
			sv.cameras.desktop.fov = 1.5;
	   		scene.activeCamera = sv.cameras.desktop;
	   		sv.activeCamera = 'desktop';
		}

		//attach control
		//scene.activeCamera.attachControl(u.canvas, true);

		//weird fix for ios but ohwell
		if(detect.os.name == 'ios') {
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

		if(u.camera == 'mobile') {
	   		scene.activeCamera.resetToCurrentRotation();
		}

		//attach control
		scene.activeCamera.attachControl(u.canvas, false);
	   
		return scene;
	},

	particles : function(x,y,z) {


		// Fountain object
		var fountain = BABYLON.Mesh.CreateBox("foutain", 1.0, sv.scene);
		
		fountain.position.x = x;
		fountain.position.y = y;
		fountain.position.z = z;
		fountain.parent = sv.objects.imageSphere;

		//make transparent
		var fountainMaterial = new BABYLON.StandardMaterial("fountainMaterial", sv.scene);
		fountainMaterial.diffuseColor = new BABYLON.Color3(.5,.5,1); //Red
		fountainMaterial.alpha = 0;
		fountain.material = fountainMaterial;

		// Create a particle system
		var particleSystem = new BABYLON.ParticleSystem("particles", 400, sv.scene);

		//Texture of each particle
		particleSystem.particleTexture = new BABYLON.Texture(u.imageBase+"flare.png", sv.scene);
		particleSystem.hasAlpha = true;

		// Where the particles come from
		particleSystem.emitter = fountain; // the starting object, the emitter
		particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
		particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

		// Colors of all particles
		particleSystem.color1 = new BABYLON.Color4(1, .5, 0, 0);
		particleSystem.color2 = new BABYLON.Color4(1, .5, 0, 0.2);
		particleSystem.colorDead = new BABYLON.Color4(1, .5, 0, 0.0);

		// Size of each particle (random between...
		particleSystem.minSize = 0.05;
		particleSystem.maxSize = 0.1;

		// Life time of each particle (random between...
		particleSystem.minLifeTime = 4;
		particleSystem.maxLifeTime = 8;

		// Emission rate
		particleSystem.emitRate = 10;

		// Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
		particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

		// Set the gravity of all particles
		//particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
		particleSystem.gravity = new BABYLON.Vector3(0, -1, 0);

		// Direction of each particle after it has been emitted
		particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
		particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

		// Angular speed, in radians
		particleSystem.minAngularSpeed = 0;
		particleSystem.maxAngularSpeed = Math.PI;

		// Speed
		particleSystem.minEmitPower = .25;
		particleSystem.maxEmitPower = .75;
		particleSystem.updateSpeed = 0.005;

		// Start the particle system
		particleSystem.start();

		// Fountain's animation
		var keys = [];
		var animation = new BABYLON.Animation("animation", "rotation.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
		// At the animation key 0, the value of scaling is "1"
		keys.push({
			frame: 0,
			value: Math.PI*.25
		});

		// At the animation key 50, the value of scaling is "0.2"
		keys.push({
			frame: 50,
			value: Math.PI*0
		});

		// At the animation key 100, the value of scaling is "1"
		keys.push({
			frame: 100,
			value: -Math.PI*.25
		});

		// Launch animation
		animation.setKeys(keys);
		fountain.animations.push(animation);
		sv.scene.beginAnimation(fountain, 0, 100, true);
	},

	populateGoogleImage : function() {

		$('.per_output').html('<span style="font-size:.6em;">loading</span>');

		//fix for iOS
		sv.videos.videosmoke = document.createElement('video');
		sv.videos.videosmoke.preload = 'auto';
		sv.videos.videosmoke.muted = true;
		sv.videos.videosmoke.playsinline = true;
		sv.videos.videosmoke.loop = true;
		if(u.bandwidth == 'low' || detect.os.name == 'ios' || u.camera == 'vr') {
			sv.videos.videosmoke.src = u.videoStream+'streetview/smoke.v5.mp4';
		} else {
			sv.videos.videosmoke.src = u.videoStream+'streetview/smoke.v5.mp4';
		}
		sv.videos.videosmoke.load();
 		document.getElementById("videos").appendChild(sv.videos.videosmoke);
		window.makeVideoPlayableInline(sv.videos.videosmoke);


		//fix for iOS
		sv.videos.videofire = document.createElement('video');

		//create video events
		u.videoPerLoaded = 0;
		u.videoPerLoadedOver = 0;
		sv.videos.videofire.addEventListener('progress',
			u.videoLoaded,
			false
		);

		//can play through event
		sv.videos.videofire.addEventListener('canplaythrough',
			sv.canplaythrough,
			false
		);

		sv.videos.videofire.preload = 'auto';
		sv.videos.videofire.muted = true;
		sv.videos.videofire.playsinline = true;
		sv.videos.videofire.loop = true;
		if(u.bandwidth == 'low' || detect.os.name == 'ios' || u.camera == 'vr') {
			sv.videos.videofire.src = u.videoStream+'streetview/fire.v4.lowres.mp4';
		} else {
			sv.videos.videofire.src = u.videoStream+'streetview/fire.v4.mp4';
		}
		sv.videos.videofire.load();
 		document.getElementById("videos").appendChild(sv.videos.videofire);
		window.makeVideoPlayableInline(sv.videos.videofire);


	},

	canplaythrough : function() {
		console.log('sv.canplaythrough() - video can play through');
		sv.videos.videofire.removeEventListener('canplaythrough', sv.canplaythrough, false);
		modals.content.streetview.init();
		sv.timers.canplaythrough = setInterval(function() {
			//if( (Math.round(u.videoPerLoaded*100)/100) >= ex.videos.minload[detect.os.name]) {
			clearInterval(sv.timers.canplaythrough);

			//fade out loader
			$('.loader').hide();

			//place objects
			sv.placeObjects();
			sv.particles(0,0,0);

			//create panels
			u.createPanel('svpanel1', u.imageBase+'panels/_0000_you-go-out-alive-but.png', sv.scene, 0);
			u.createPanel('svpanel2', u.imageBase+'panels/_0002_without-and-agreed-meeting-point.png', sv.scene, 0);

			if(u.camera == 'vr') {
				u.createPanel('svpanel1_vr', u.imageBase+'panels/_0000_you-go-out-alive-but.png', sv.scene, Math.PI );
				u.createPanel('svpanel2_vr', u.imageBase+'panels/_0002_without-and-agreed-meeting-point.png', sv.scene, Math.PI );

				u.createPanel(
					'svpanel3', 
					u.imageBase+'panels/_0003_have-you-got-an-agreed-meeting-point.png', 
					sv.scene, 
					0, { 
						buttonImage : '_0000_try-again.png',
						onclick : function() {
							sv.destroy();
							timer.videoStart = 0; 
							ex.videos.current = 'lounge';
							u.setVideoBandwidth();
							ex.create();
						} 
					}
				);
				u.createPanel(
					'svpanel3_vr', 
					u.imageBase+'panels/_0003_have-you-got-an-agreed-meeting-point.png', 
					sv.scene, 
					Math.PI, { 
						buttonImage : '_0000_try-again.png',
						onclick : function() {
							sv.destroy();
							timer.videoStart = 0; 
							ex.videos.current = 'lounge';
							u.setVideoBandwidth();
							ex.create();
						} 
					}
				);

			} else {

				u.createPanel(
					'svpanel3', 
					u.imageBase+'panels/_0003_have-you-got-an-agreed-meeting-point.png', 
					sv.scene,
					0, { 
						buttonImage : '_0001_yes.png',
						onclick : function() {
							//alert('clicked1');
							window.location = 'http://www.fire.org.nz/escapeplan/#great_start'
						} 
					}, { 
						buttonImage : '_0002_no.png',
						onclick : function() { 
							//alert('clicked2');
							window.location = 'http://www.fire.org.nz/escapeplan/#get_sorted'
						} 
					}
				);
			}

			var int = 1;
			var timebetween = 8000;
			while(int < 4) {
				console.log('settting '+int);
				u.timers['fadein_'+int] = setTimeout(function(int) {
					u.fadeInPanel('svpanel'+int);
					if(u.camera == 'vr') {
						u.fadeInPanel('svpanel'+int+'_vr');
					}
				},timebetween,int);
				timebetween += 5000;
				if(int != 3) {
					u.timers['fadeout_'+int] = setTimeout(function(int) {
						u.fadeOutPanel('svpanel'+int);
						if(u.camera == 'vr') {
							u.fadeOutPanel('svpanel'+int+'_vr');
						}
					},timebetween,int);
				}
				//timebetween += 1000;
				int ++;
			}
			//};
		},100);
	},

	placeObjects : function() {
		console.log('sv.placeObjects();')

		//google maps image
		var width = 40;
		var height = 20;

		//image 1
		sv.objects.imageSphere = BABYLON.MeshBuilder.CreatePlane(
			"image_sphere", {
				width: 		width,
				height: 	height,
				updatable: 	true
			}, sv.scene
		);
		//if(ex.activeCamera != 'vr') {
			sv.objects.imageSphere.parent = sv.scene.activeCamera;
		//}
		sv.objects.imageSphere.position.z = width*.33;
		sv.objects.sphereMat = new BABYLON.StandardMaterial("mat", sv.scene);
		sv.objects.sphereMat.emissiveColor = new BABYLON.Color3(1,1,1);
		sv.objects.imageTexture = new BABYLON.Texture(gm.imageurl, sv.scene);
		sv.objects.sphereMat.diffuseTexture = sv.objects.imageTexture;
		sv.objects.imageSphere.material = sv.objects.sphereMat;


		//smoke
		sv.objects.smokeVideo = BABYLON.MeshBuilder.CreatePlane(
			"smoke_video", {
				width: 		width,
				height: 	height,
				updatable: 	true
			}, sv.scene
		);
		//if(ex.activeCamera != 'vr') {
			sv.objects.smokeVideo.parent = sv.objects.imageSphere;
		//}
		sv.objects.smokeVideo.rotation.x = Math.PI;
		sv.objects.smokeVideo.position.z = -1;
		sv.objects.smokeVideoMat = new BABYLON.StandardMaterial("mat", sv.scene);
		sv.objects.smokeVideoMat.emissiveColor = new BABYLON.Color3(1,1,1);
		sv.objects.smokeVideoMat.backFaceCulling = false;
		sv.objects.smokeVideoMat.diffuseTexture = new BABYLON.VideoTexture("video", sv.videos.videosmoke, sv.scene, true, true);
		sv.objects.smokeVideoMat.alpha = .9;
		sv.objects.smokeVideoMat.alphaMode = BABYLON.Engine.ALPHA_MULTIPLY;
		sv.objects.smokeVideo.material = sv.objects.smokeVideoMat;
		sv.videos.videosmoke.play();

		//fire
		sv.objects.fireVideo = BABYLON.MeshBuilder.CreatePlane(
			"fire_video", {
				width: 		width,
				height: 	height,
				updatable: 	true
			}, sv.scene
		);
		//if(ex.activeCamera != 'vr') {
			sv.objects.fireVideo.parent = sv.objects.imageSphere;
		//}
		sv.objects.fireVideo.rotation.x = Math.PI;
		sv.objects.fireVideo.position.z = -2;
		sv.objects.fireVideoMat = new BABYLON.StandardMaterial("mat", sv.scene);
		sv.objects.fireVideoMat.emissiveColor = new BABYLON.Color3(1,1,1);
		sv.objects.fireVideoMat.backFaceCulling = false;
		sv.objects.fireVideoMat.diffuseTexture = new BABYLON.VideoTexture("video", sv.videos.videofire, sv.scene, true, true);
		sv.objects.fireVideoMat.alpha = .9;
		sv.objects.fireVideoMat.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;
		sv.objects.fireVideo.material = sv.objects.fireVideoMat;
		sv.videos.videofire.play();

		//feather
		sv.objects.imageFeather = BABYLON.MeshBuilder.CreatePlane(
			"image_feather", {
				width: 		width,
				height: 	height,
				updatable: 	true
			}, sv.scene
		);
		//if(ex.activeCamera != 'vr') {
			sv.objects.imageFeather.parent = sv.objects.imageSphere;
		//}
		sv.objects.imageFeather.position.z = -.2;
		sv.objects.featherMat = new BABYLON.StandardMaterial("mat", sv.scene);
		sv.objects.featherMat.backFaceCulling = false;
		sv.objects.featherMat.emissiveColor = new BABYLON.Color3(1,1,1);
		sv.objects.featherTexture = new BABYLON.Texture(u.imageBase+"google/feather.png", sv.scene);
		sv.objects.featherMat.diffuseTexture = sv.objects.featherTexture;
		sv.objects.featherMat.diffuseTexture.hasAlpha = true;
		sv.objects.featherMat.useAlphaFromDiffuseTexture = true;
		sv.objects.imageFeather.material = sv.objects.featherMat;

		sv.objects.imageFeather.isVisible = false;
	}


}