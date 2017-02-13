var sv = window.sv || {};

//
//	CODED BY FCBNZ - ANDREW JACKSON
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

        // call the createScene function
        sv.scene = sv.createScene();
	    sv.scene.ambientColor = new BABYLON.Color3(1, 1, 1);

	    //add image
	    sv.setGoogleImageScene();

        //before rendering the scene
		sv.scene.registerBeforeRender(function() {

		});

        sv.running = true;

        modals.content.streetview.init();

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
	    scene.activeCamera.attachControl(u.canvas, true);

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

	    if(u.camera == 'mobile') {
	   		scene.activeCamera.resetToCurrentRotation();
	    }
	   
	    return scene;
	},

	setGoogleImageScene : function() {
		sv.populateGoogleImage(gm.imageurl);
		//create particles
		sv.particles(0,0,7); //x,y,z

		// sv.timers.finalpanel = setTimeout(function() {
		// 	u.createPanel('panel4', '/assets/img/gameover/frame3.png', sv.scene);
		// 	u.fadeInPanel('panel4');
		// }, 6000)
	},

	particles : function(x,y,z) {


	    // Fountain object
	    var fountain = BABYLON.Mesh.CreateBox("foutain", 1.0, sv.scene);
	    
	    fountain.position.x = x;
	    fountain.position.y = y;
	    fountain.position.z = z;
		fountain.parent = sv.scene.activeCamera;

	    //make transparent
	    var fountainMaterial = new BABYLON.StandardMaterial("fountainMaterial", sv.scene);
	    fountainMaterial.diffuseColor = new BABYLON.Color3(.5,.5,1); //Red
	    fountainMaterial.alpha = 0;
	    fountain.material = fountainMaterial;

	    // Create a particle system
	    var particleSystem = new BABYLON.ParticleSystem("particles", 400, sv.scene);

	    //Texture of each particle
	    particleSystem.particleTexture = new BABYLON.Texture("/assets/img/flare.png", sv.scene);
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

	populateGoogleImage : function(img1) {

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
		sv.objects.imageSphere.parent = sv.scene.activeCamera;
	    sv.objects.imageSphere.position.z = width*.33;
	    //create mat
		sv.objects.sphereMat = new BABYLON.StandardMaterial("mat", sv.scene);
		sv.objects.sphereMat.emissiveColor = new BABYLON.Color3(1,1,1);
		//assign image
		sv.objects.imageTexture = new BABYLON.Texture(img1, sv.scene);
		sv.objects.sphereMat.diffuseTexture = sv.objects.imageTexture;
		sv.objects.imageSphere.material = sv.objects.sphereMat;

		//fix for iOS
		var videosmoke = document.createElement('video');
		videosmoke.preload = 'auto';
		videosmoke.muted = true;
		videosmoke.playsinline = true;
		videosmoke.loop = true;
		videosmoke.src = u.videoStream+'house_smoke.mp4';
		videosmoke.load();
 		document.getElementById("videos").appendChild(videosmoke);
		window.makeVideoPlayableInline(videosmoke);

		videosmoke.onloadeddata = function() {
			//create fire
			sv.objects.smokeVideo = BABYLON.MeshBuilder.CreatePlane(
				"smoke_video", {
					width: 		width,
					height: 	height,
					updatable: 	true
				}, sv.scene
			);
			sv.objects.smokeVideo.parent = sv.objects.imageSphere;
			sv.objects.smokeVideo.rotation.x = Math.PI;
		    sv.objects.smokeVideo.position.z = -.1;
		    sv.objects.smokeVideoMat = new BABYLON.StandardMaterial("mat", sv.scene);
		    sv.objects.smokeVideoMat.emissiveColor = new BABYLON.Color3(1,1,1);
			sv.objects.smokeVideoMat.backFaceCulling = false;
		    sv.objects.smokeVideoMat.diffuseTexture = new BABYLON.VideoTexture("video", videosmoke, sv.scene, true, true);
		    sv.objects.smokeVideoMat.alpha = .9999;

		    //smoke
		    sv.objects.smokeVideoMat.alphaMode = BABYLON.Engine.ALPHA_MULTIPLY;

		    sv.objects.smokeVideo.material = sv.objects.smokeVideoMat;
		    videosmoke.play();
		};

		//fix for iOS
		var videofire = document.createElement('video');
		videofire.preload = 'auto';
		videofire.muted = true;
		videofire.playsinline = true;
		videofire.loop = true;
		videofire.src = u.videoStream+'house_fire.mp4';
		videofire.load();
 		document.getElementById("videos").appendChild(videofire);
		window.makeVideoPlayableInline(videofire);

		videofire.onloadeddata = function() {
			//create fire
			sv.objects.fireVideo = BABYLON.MeshBuilder.CreatePlane(
				"fire_video", {
					width: 		width,
					height: 	height,
					updatable: 	true
				}, sv.scene
			);
			sv.objects.fireVideo.parent = sv.objects.imageSphere;
			sv.objects.fireVideo.rotation.x = Math.PI;
		    sv.objects.fireVideo.position.z = -.2;
		    sv.objects.fireVideoMat = new BABYLON.StandardMaterial("mat", sv.scene);
		    sv.objects.fireVideoMat.emissiveColor = new BABYLON.Color3(1,1,1);
			sv.objects.fireVideoMat.backFaceCulling = false;
		    sv.objects.fireVideoMat.diffuseTexture = new BABYLON.VideoTexture("video", videofire, sv.scene, true, true);
		    sv.objects.fireVideoMat.alpha = .9999;

		    //fire
		    sv.objects.fireVideoMat.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;

		    sv.objects.fireVideo.material = sv.objects.fireVideoMat;
		    videofire.play();
		};


		//create smoke
		// sv.objects.imageVideoSmoke = BABYLON.MeshBuilder.CreatePlane(
		// 	"image_sphere", {
		// 		width: 		width,
		// 		height: 	height,
		// 		updatable: 	true
		// 	}, sv.scene
		// );
		// sv.objects.imageVideoSmoke.parent = sv.scene.activeCamera;
		// sv.objects.imageVideoSmoke.rotation.x = Math.PI;
		// sv.objects.imageVideoSmoke.position.z = 5;

		// sv.objects.googleSmokeVideo = new BABYLON.StandardMaterial("mat", sv.scene);
		// sv.objects.googleSmokeVideo.emissiveColor = new BABYLON.Color3(1,1,1);
		// sv.objects.googleSmokeVideo.backFaceCulling = false;

		// sv.objects.googleSmokeVideo.diffuseTexture = new BABYLON.VideoTexture("video", ["/assets/img/google/smoke.mp4"], sv.scene, true, true);
		// sv.objects.googleSmokeVideo.alpha = .5;
		// sv.objects.googleSmokeVideo.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;

		// sv.objects.imageVideoSmoke.material = sv.objects.googleSmokeVideo;
		// sv.objects.googleSmokeVideo.diffuseTexture.video.play();


		//create feather
		sv.objects.imageFeather = BABYLON.MeshBuilder.CreatePlane(
			"image_feather", {
				width: 		width,
				height: 	height,
				updatable: 	true
			}, sv.scene
		);
		sv.objects.imageFeather.parent = sv.objects.imageSphere;
	    sv.objects.imageFeather.position.z = -.2;

	    //create mat
		sv.objects.featherMat = new BABYLON.StandardMaterial("mat", sv.scene);
		sv.objects.featherMat.backFaceCulling = false;
		sv.objects.featherMat.emissiveColor = new BABYLON.Color3(1,1,1);
		
		//assign image
		sv.objects.featherTexture = new BABYLON.Texture("/assets/img/google/feather.png", sv.scene);
		sv.objects.featherMat.diffuseTexture = sv.objects.featherTexture;
	    sv.objects.featherMat.diffuseTexture.hasAlpha = true;
	    sv.objects.featherMat.useAlphaFromDiffuseTexture = true;

		sv.objects.imageFeather.material = sv.objects.featherMat;

	}


}