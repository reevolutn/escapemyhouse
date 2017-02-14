var u = window.u || {};
var google = window.google || {};
var overlays = window.overlays || {};
var gm = window.gm || {};
var navigate = window.navigate || {};

//
//	DESIGNED/CODED BY FCBNZ - ANDREW JACKSON
//
//	(╯°□°）╯︵ ┻━┻
//

$(document).ready(function() {
	detect.do();
	navigate.init();

	overlays.init();
	u.organise();

	//default timeout to fade the first modal in
	var timeout = 4000;
	//chrome on ios doesnt like playing videos, so we need to reduce the timeout and place an image instead
	if(detect.os.name == 'ios' /* && detect.browser.name == 'chrome' && detect.browser.version < 55 */ ) {
		timeout = 1000;
	}

	//if the users browser doesnt meet minimum reqs, then display the bad browser message
	if(!detect.meetsRequirements) {
		console.log('webgl not detected');
		//hide loader
		$('.loader').hide();
		//fade in bad browser message
		u.timers.overlay = setTimeout(function() {
			overlays.open('#techology');
			$('body').addClass('up');
		}, 0);
		//add a class to the body for a couple of other css tweaks
		$('body').addClass('bad_browser');
	} else {
		console.log('webgl detected');
		//fade in the address selector
		u.timers.overlay = setTimeout(function() {
			overlays.open('#address');
			$('body').addClass('up');
		}, timeout);
		//initiate general functions
		u.init();
		//initiate home scene
		hm.init();
		//create home scene
		hm.create();
		//initiate experience
		ex.init();
	}
});

$(window).load(function() {

});

$(window).resize(function() {
	u.organise();
	// if(detect.os.name == 'ios' ) {
	// 	if(u.d.w > u.d.h) {
	// 		u.engine.setHardwareScalingLevel(1080 / u.d.h);
	// 	} else {
	// 		u.engine.setHardwareScalingLevel(1080 / u.d.w);
	// 	}
	// }
});

navigate = {
	//current hash to prevent loops
	currentHash : '',
	//callbacks, name each callback the name of the hash you want it to fire on
	callbacks : {
		home : function() {
			console.log('navigate.callbacks.home();');
			location.reload();
		}
	},
	//place hashchange detector
	init : function() {
		//force remove the hash on pageload
		//history.pushState('', document.title, window.location.pathname);
		//hashchange detector
		$(window).bind('hashchange', function(e) {
			var hash = window.location.hash.replace('#', '');
			console.log('hashchange detected - new hash:'+hash+', old hash:'+navigate.currentHash)
			//make sure the new hash is different to the current hash to prevent loops
			if(hash != navigate.currentHash) {
				navigate.navigateTo(hash);
			}
		});
	},
	//push new hash into url
	push : function(hash) {
		navigate.currentHash = hash;
		window.location.hash = hash;
	},
	//when the hashchange is detected, fire the callback (if it is defined)
	navigateTo : function(hash) {
		console.log('navigate.navigateTo("'+hash+'")');
		//if the hash is empty but something has changed, we can assume the user wants to go to the home state
		if(hash == '') {
			hash = 'home';
		}
		if(typeof navigate.callbacks[hash] == 'function') {
			navigate.callbacks[hash]();
		}
	}
}
	


gm = {
	autocomplete : false,
	place : false,
	imageurl : '/data/?doAction=streetview&location=66 Clarence st Ponsonby&fov=80&fallback1=ponsonby&fallback2=ponsonby',
	userdata : {},

	init : function() {
		gm.autocomplete = new google.maps.places.Autocomplete(
		/** @type {!HTMLInputElement} */(document.getElementById('address_finder')),
		{types: ['geocode']});
		gm.autocomplete.addListener('place_changed', gm.getStreetMapImage);

		$('#address_finder').focus(function() {
			//alert('focused');
			$(this).parent().addClass('input_active');
			$('body').removeClass('up');
		})
		$('#address_finder').focusout(function() {
			$(this).parent().removeClass('input_active');
			$('body').addClass('up');
		})
	},


	getStreetMapImage : function() {
   		gm.place = gm.autocomplete.getPlace();

		gm.userdata.address = gm.place.address_components[0].short_name
		gm.userdata.addressfallback1 = gm.place.address_components[0].short_name;
		gm.userdata.addressfallback2 = gm.place.address_components[0].short_name;

		if(gm.place.address_components[1] != undefined && gm.place.address_components[1].short_name != undefined) {
			gm.userdata.address += ', '+gm.place.address_components[1].short_name;
			gm.userdata.addressfallback1 = gm.place.address_components[1].short_name;
		}

		if(gm.place.address_components[2] != undefined && gm.place.address_components[2].short_name != undefined) {
			gm.userdata.address += ', '+gm.place.address_components[2].short_name;
			gm.userdata.addressfallback1 += ', '+gm.place.address_components[2].short_name
			gm.userdata.addressfallback2 = gm.place.address_components[2].short_name
		}

		if(gm.place.address_components[3] != undefined && gm.place.address_components[3].short_name != undefined) {
			gm.userdata.address += ', '+gm.place.address_components[3].short_name;
			gm.userdata.addressfallback1 += ', '+gm.place.address_components[3].short_name;
			gm.userdata.addressfallback2 += ', '+gm.place.address_components[3].short_name;
		}

   		$(this).parent().removeClass('input_active');
   		console.log(gm.place.address_components);

   		gm.imageurl = u.base+'data/?doAction=streetview&location='+gm.userdata.address+'&fov=80&fallback1='+gm.userdata.addressfallback1+'&fallback2='+gm.userdata.addressfallback2;
   		console.log(gm.imageurl);
   		$('#address_go').trigger('click');



   		//gm.placeHouseImage(u.userdata.address,80,u.userdata.addressfallback1,u.userdata.addressfallback2);
	}
}

function initAutocomplete() {
  gm.init();
}



overlays = {
	init : function() {

		$('*[data-overlay="open"]').click(function() {
			overlays.open($(this).attr('data-overlay-id'));
		})

		$('*[data-overlay="close"]').click(function() {
			overlays.close();
		})

		$('*[data-experience="create"]').click(function() {
			overlays.close();
			var camera = $(this).attr('data-camera');
			if(camera == 'auto') {

				//detect if mobile device has gyro
				//detect.hasGyro = false;

				//tablet with gyro
				if(detect.os.name != 'auto' && detect.hasGyro && u.d.w > 700) {
					u.camera = 'mobile'
					hm.nextScene();

				//mobile with gyro
				} else if(detect.os.name != 'auto' && detect.hasGyro) {
					overlays.open('#vr_select');

				//mobile without gyro
				} else if(detect.os.name != 'auto' && !detect.hasGyro) {
					detect.meetsRequirements = false;
					$('body').addClass('bad_browser');
					$('.no_gyro').show();
					$('.has_gyro').hide();
					overlays.open('#techology');

				//desktop
				} else {
					u.camera = 'desktop';
					hm.nextScene();
				}

			} else {
				u.camera = $(this).attr('data-camera');
				hm.nextScene();
			}
			console.log('-----------------------');
			console.log(u.camera);
			console.log('-----------------------');
			u.setBodyClass();
		});

	},
	open : function(id) {
		$('.overlay').removeClass('active');
		$('.overlays').addClass('active');
		$(id).addClass('active');
	},

	close : function() {
		$('.overlays').removeClass('active');
		$('.overlay').removeClass('active');
	}
}


u = {
	base : '/',
	videoStream : '/assets/video/stream.php?url=',
	imageBase : '/assets/img/',
	audioBase : '/assets/audio/',
	offline : false,
	camera : 'mobile',
	activeCamera : 'desktop',
	cameras : {},
	d : {},
	engine : false,
	canvas : false,
	videoPerLoaded : 0,
	videoPerLoadedOver : 0,
	timers : {},
	objects : {
		buttons : {}
	},
	bandwidth : 'low',
	currentScene : 'home',
	ambientColour : {
		r : 0,//.7,
		g : 0, //.2,
		b : 0 //.2
	},

	setBodyClass : function() {
		$('body').removeClass('camera_vr camera_mobile camera_desktop scene_home scene_lounge scene_hallway scene_streetview');
		$('body').addClass('camera_'+u.camera+' scene_'+u.currentScene);
	},
	
	setOrientation : function(orientation) {
		if(orientation == 'landscape') {
			//if(detect.os.name == 'phonegap') {
				//var so = cordova.plugins.screenorientation;
				//so.setOrientation(so.Orientation.LANDSCAPE);
			//} else {
				var lockFunction =  window.screen.orientation.lock;
				if (lockFunction.call(window.screen.orientation, 'landscape')) {
					console.log('Orientation locked')
				} else {
					console.error('There was a problem in locking the orientation')
				}	
			//}
		}
	},

	optimiseGame : function(scene) {
		BABYLON.SceneOptimizer.OptimizeAsync(
			scene, 
			BABYLON.SceneOptimizerOptions.LowDegradationAllowed(20,1000),
			function() {
				// On success
				console.log('u.optimiseGame() - high quality')
			}, function() {
				// FPS target not reached
				console.log('u.optimiseGame() - low quality')
			}
		);
	},


	init : function() {
		$('*[data-do="step"]').click(function() {
			var step = $(this).attr('data-id');
			u.gotoStep(step);
		});

		u.speedTest();

		u.canvas = document.getElementById('renderCanvas');
	    //u.engine = new BABYLON.Engine(u.canvas, true);

	    var maxResolutionScale = 2;
	   	if(detect.os.name == 'ios' ) {
	   		maxResolutionScale = 1.5;
	   	}
	   	BABYLON.Engine.ShadersRepository = null;
	   	u.engine = new BABYLON.Engine(
	   		u.canvas, 
	   		true, 
	   		{ 
		   		antialias: false,
		   		preserveDrawingBuffer: false, //http://stackoverflow.com/questions/27746091/preservedrawingbuffer-false-is-it-worth-the-effort
		   		limitDeviceRatio: maxResolutionScale, //res scaling
		   		generateDepthBuffer: false,
		   		generateMipMaps: false,
		   		samplingMode: 2
			},
	   		true
	   	);

		// run the render loop
		u.engine.runRenderLoop(function(){
			if(hm.running) {
				hm.runRenderLoop();
			} else if(ex.running) {
				ex.runRenderLoop();
			} else if(sv.running) {
				sv.runRenderLoop();
			}
		});

  		//	if(detect.os.name == 'ios' ) {
		// 	if(u.d.w > u.d.h) {
		// 		u.engine.setHardwareScalingLevel(720 / u.d.h);
		// 	} else {
		// 		u.engine.setHardwareScalingLevel(720 / u.d.w);
		// 	}
		// }

		// the canvas/window resize event handler
		window.addEventListener('resize', function(){
			if(ex.running) {
		   		timer.resize();
			}
			u.engine.resize();
		});


		$('*[data-do="set_bandwidth"]').click(function() {
			u.bandwidth = $(this).attr('data-bandwidth');
			ex.destroy();
			u.setVideoBandwidth();
			ex.create();
		});

	},

	setVideoBandwidth : function(manual) {
		console.log('ex.setVideoBandwidth() - '+ex.videos.current);
		console.log(u.bandwidth+' bandwidth');
		ex.videos[ex.videos.current].current = ex.videos[ex.videos.current][u.bandwidth];
		$('*[data-do="set_bandwidth"]').removeClass('active');
		$('*[data-bandwidth="'+u.bandwidth+'"]').addClass('active');
	},

	videoLoaded : function(e) {
		var obj = e.target;
		var displayloaded;
		var todisplay = 0;
		var currentLoaded = u.videoPerLoaded;

		//u.videoPerLoadedOver += .5;
		console.log('------------------------------------ '+ obj.buffered.length);
		console.log(obj.buffered);
		console.log("loading: "+e.target.currentSrc);

		//if the platform is ios, we jus play the video through to make sure its buffered
		if((detect.os.name == 'ios' && obj.buffered != null && obj.readyState > 0 && obj.duration != null) || obj.buffered.length == 0 || ( obj.currentTime > 0 && u.videoPerLoaded == 0 ) ) {
			u.videoPerLoaded = obj.currentTime/obj.duration;
			if(u.videoPerLoaded < currentLoaded) {
				u.videoPerLoaded = currentLoaded;
			}
			displayloaded = ( u.videoPerLoaded * 100 ) * ( 1 / ex.videos.minload[detect.os.name] );
			todisplay = (Math.round( displayloaded * 1 ) / 1);

		//check to see if the video has loaded enough to play
		} else if(obj.buffered != null && obj.readyState == 4 && obj.duration != null) {
			//get the start and and buffer values
			var indexstart = obj.buffered.length - 1;
			var indexend = obj.buffered.length - 1;
			if(indexstart < 0) {
				indexstart = 0;
			}
			if(indexend < 0) {
				indexend = 0;
			}
			// if(detect.os.name == 'ios') {
			// 	indexstart = 0;
			// }
			durationIncludingOffset = obj.duration - obj.buffered.start(indexstart);
			currentIncludingOffset = obj.buffered.end(indexend) - obj.buffered.start(indexstart);
			u.videoPerLoaded = currentIncludingOffset / durationIncludingOffset;
			if(u.videoPerLoaded < currentLoaded) {
				u.videoPerLoaded = currentLoaded;
			}
			displayloaded = ( u.videoPerLoaded * 100 ) * ( 1 / ex.videos.minload[detect.os.name] );
			todisplay = (Math.round( displayloaded * 1 ) / 1);

		} else {
			displayloaded = 0;
			u.videoPerLoaded = 0;
			if(u.videoPerLoaded < currentLoaded) {
				u.videoPerLoaded = currentLoaded;
				displayloaded = ( u.videoPerLoaded * 100 ) * ( 1 / ex.videos.minload[detect.os.name] );
			}
			todisplay = (Math.round( displayloaded * 1 ) / 1);
		}

		if(todisplay == NaN || todisplay == 0) {
			$('.per_output').html('<span style="font-size:.6em;">loading</span>');
		} else {
			$('.per_output').html(todisplay+'%');
		}

		console.log("percent loaded: "+u.videoPerLoaded)
		console.log("current play time: "+obj.currentTime);
		console.log('------------------------------------');
	},

	gotoStep : function(step) {
		console.log('u.gotoStep('+step+')');
		$('.step.current').removeClass('current');
		$(step).addClass('current');
		$('body').attr('class', 'state-'+step.replace('#',''));
		google.trackPage(step.replace('#',''), step.replace('#',''));
		u.organise();
		$('body,html').scrollTop(0);
		if(step == '#results' && email) {
			u.submitEmail(email);
		}
	},

	speed : {
		url : u.imageBase+"loadtest.png",
		filesize : 2334720, //bytes
		mbps : 0
	},

	speedTest : function() {
		if (window.addEventListener) {
			window.addEventListener('load', u.InitiateSpeedDetection, false);
		} else if (window.attachEvent) {
			window.attachEvent('onload', u.InitiateSpeedDetection);
		}
	},

	InitiateSpeedDetection : function() {
		u.ShowProgressMessage("Bandwidth test started...");
		window.setTimeout(u.MeasureConnectionSpeed, 1);
	},

	MeasureConnectionSpeed : function() {
		var startTime, endTime;
		var download = new Image();
		download.onload = function () {
			endTime = (new Date()).getTime();
			showResults();
		}
		
		download.onerror = function (err, msg) {
			u.ShowProgressMessage("Invalid image, or error downloading");
		}
		
		startTime = (new Date()).getTime();
		var cacheBuster = "?nnn=" + startTime;
		download.src = u.speed.url + cacheBuster;
		
		function showResults() {
			var duration = (endTime - startTime) / 1000;
			var bitsLoaded = u.speed.filesize * 8;
			var speedBps = (bitsLoaded / duration).toFixed(2);
			var speedKbps = (speedBps / 1024).toFixed(2);
			var speedMbps = (speedKbps / 1024).toFixed(2);
			u.ShowProgressMessage([
				speedMbps + " Mbps"
			]);
			u.speed.mbps = speedMbps;
			//some conditional settings
			if(detect.os.name == 'ios' || u.speed.mbps < 10) {
				u.bandwidth = 'low';
			} else if( u.speed.mbps > 25 && u.d.w > 1700) {
				u.bandwidth = 'high';
			} else {
				u.bandwidth = 'medium';
			}

			if(detect.os.name == 'phonegap') {
				u.bandwidth = 'medium';
			}

			//update
			u.setVideoBandwidth();
		}
	},

	ShowProgressMessage : function(msg) {
		if (console) {
			if (typeof msg == "string") {
				console.log(msg);
			} else {
				for (var i = 0; i < msg.length; i++) {
					console.log(msg[i]);
				}
			}
		}
	},


	fadeInPanel : function(panel) {
		console.log('fade in '+panel);
		google.trackEvent('panel','show',panel,1);

		u.objects[panel].visibility = true;
		
		// if(ex.activeCamera == 'vr') {
		// 	if(ex.videos.current == 'lounge' || ex.videos.current == 'hallway') {
		// 		u.objects[panel].rotation.x = ex.scene.activeCamera.rotation.x;
		// 		u.objects[panel].rotation.y = ex.scene.activeCamera.rotation.y;
		// 	} else {
		// 		u.objects[panel].rotation.x = sv.scene.activeCamera.rotation.x;
		// 		u.objects[panel].rotation.y = sv.scene.activeCamera.rotation.y;
		// 	}
		// }

		if(typeof u.objects.buttons[panel+'_btn1'] == 'object') {
			u.objects.buttons[panel+'_btn1'].visibility = true;
		}

		if(typeof u.objects.buttons[panel+'_btn2'] == 'object') {
			u.objects.buttons[panel+'_btn2'].visibility = true;
		}
		
		//fade in panel
		u.timers[panel+'_in'] = setInterval(function(panel) {
			u.objects[panel].material.alpha += .1;
			if(typeof u.objects.buttons[panel+'_btn1'] == 'object') {
				u.objects.buttons[panel+'_btn1'].material.alpha += .1;
			}
			if(typeof u.objects.buttons[panel+'_btn2'] == 'object') {
				u.objects.buttons[panel+'_btn2'].material.alpha += .1;
			}
			if(u.objects[panel].material.alpha >= 1) {
				clearInterval(u.timers[panel+'_in']);
			}
		}, 33, panel);
	},

	fadeOutPanel : function(panel) {
		console.log('fade out '+panel);
		google.trackEvent('panel','hide',panel,1);
		//fade in panel
		u.timers[panel+'_out'] = setInterval(function(panel) {
			u.objects[panel].material.alpha -= .1;
			if(typeof u.objects.buttons[panel+'_btn1'] == 'object') {
				u.objects.buttons[panel+'_btn1'].material.alpha -= .1;
			}
			if(typeof u.objects.buttons[panel+'_btn2'] == 'object') {
				u.objects.buttons[panel+'_btn2'].material.alpha -= .1;
			}
			//console.log(panel+' - '+timer.objects[panel].material.alpha)
			if(u.objects[panel].material.alpha <= 0) {
				clearInterval(u.timers[panel+'_out']);
				u.objects[panel].visibility = false;
				if(typeof u.objects.buttons[panel+'_btn1'] == 'object') {
					u.objects.buttons[panel+'_btn1'].visibility = false;
				}
				if(typeof u.objects.buttons[panel+'_btn2'] == 'object') {
					u.objects.buttons[panel+'_btn2'].visibility = false;
				}
			}
		}, 33, panel);
	},

	createPanel : function(name,img, scene, rotation, button1, button2) {
		img = img+'?v=2';

		//data reporter
		u.objects[name] = BABYLON.MeshBuilder.CreatePlane(
			name, {
				width:  12,
				height: 8
			}, scene
		);
		var objY = 0;//ex.playerheight;
		if(ex.activeCamera != 'vr') {
			u.objects[name].parent = scene.activeCamera;
			objY = 0;
		} 
		u.objects[name].setPivotMatrix(BABYLON.Matrix.Translation(objY, 0, 4));
		u.objects[name].hasAlpha = true;
		u.objects[name].visibility = false;
		u.objects[name].rotation.y = rotation;
		//timer.objects.outoftime.scaling = new BABYLON.Vector3(.5, .5, .5);

		//add the img
		var copy = new BABYLON.StandardMaterial(name+"_copy", scene);
		copy.diffuseTexture = new BABYLON.Texture(img, scene);
		copy.diffuseTexture.hasAlpha = true;
		copy.useAlphaFromDiffuseTexture = true;
		copy.backFaceCulling = true;
		copy.emissiveColor = new BABYLON.Color3(1,1,1);
		copy.alpha = 0;
		u.objects[name].material = copy;



		var scale = 1;
		if(u.camera != 'desktop') {
			scale = 1.5;
		}

		var btn_pos = {
			x : 0*scale,
			y : -.4*scale, //.1
			z : -.3
		}

		//add buttons
		if(button1) {
			u.objects.buttons[name+'_btn1'] = BABYLON.MeshBuilder.CreatePlane(
				name+'_btn1', {
					width:  .9*scale,
					height: .3*scale
				}, scene
			);
			u.objects.buttons[name+'_btn1'].parent = u.objects[name];
			u.objects.buttons[name+'_btn1'].position = new BABYLON.Vector3(btn_pos.x, btn_pos.y, btn_pos.z);
			u.objects.buttons[name+'_btn1'].visibility = false;
			var btn1 = new BABYLON.StandardMaterial(name+'_btn1', scene);
			btn1.diffuseTexture = new BABYLON.Texture(u.imageBase+'buttons/'+button1.buttonImage, scene);
			btn1.diffuseTexture.hasAlpha = true;
			btn1.useAlphaFromDiffuseTexture = true;
			btn1.backFaceCulling = true;
			btn1.emissiveColor = new BABYLON.Color3(1,1,1);
			btn1.alpha = 0;
			u.objects.buttons[name+'_btn1'].material = btn1;
			u.objects.buttons[name+'_btn1'].actionManager = new BABYLON.ActionManager(scene);
			u.objects.buttons[name+'_btn1'].customcallback = button1.onclick;
			u.objects.buttons[name+'_btn1'].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function(evt) {
				//alert(evt.meshUnderPointer.customcallback);
				evt.meshUnderPointer.customcallback();
			}));
		}

		if(button2) {
			u.objects.buttons[name+'_btn2'] = BABYLON.MeshBuilder.CreatePlane(
				name+'_btn2', {
					width:  .9*scale,
					height: .3*scale
				}, scene
			);
			u.objects.buttons[name+'_btn2'].parent = u.objects[name];
			u.objects.buttons[name+'_btn2'].position = new BABYLON.Vector3(btn_pos.x, btn_pos.y, btn_pos.z);
			u.objects.buttons[name+'_btn2'].visibility = false;
			var btn2 = new BABYLON.StandardMaterial(name+'_btn2', scene);
			btn2.diffuseTexture = new BABYLON.Texture(u.imageBase+'buttons/'+button2.buttonImage, scene);
			btn2.diffuseTexture.hasAlpha = true;
			btn2.useAlphaFromDiffuseTexture = true;
			btn2.backFaceCulling = true;
			btn2.emissiveColor = new BABYLON.Color3(1,1,1);
			btn2.alpha = 0;
			u.objects.buttons[name+'_btn2'].material = btn2;
			u.objects.buttons[name+'_btn2'].actionManager = new BABYLON.ActionManager(scene);
			u.objects.buttons[name+'_btn2'].customcallback = button2.onclick;
			u.objects.buttons[name+'_btn2'].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function(evt) {
				//alert(evt.meshUnderPointer.customcallback);
				evt.meshUnderPointer.customcallback();
			}));
		}

		if(button1 && button2) {
			u.objects.buttons[name+'_btn1'].position = new BABYLON.Vector3(-.5*scale, btn_pos.y, btn_pos.z);
			u.objects.buttons[name+'_btn2'].position = new BABYLON.Vector3(.5*scale, btn_pos.y, btn_pos.z);
		}
		
		//create color overlay
		// u.objects[name+'_overlay'] = BABYLON.Mesh.CreatePlane(name, 4, scene, false);
		// u.objects[name+'_overlay'] = scene.activeCamera;
		// u.objects[name+'_overlay'].position = new BABYLON.Vector3(0, 0, 3);
		// var mat = new BABYLON.StandardMaterial("mat", scene);
		// mat.diffuseColor = new BABYLON.Color3(1, .1, .1);
		// mat.emissiveColor = new BABYLON.Color3(1, .1, .1);
		// mat.alpha = .8;
		// u.objects[name+'_overlay'].material = mat;
		// u.objects[name+'_overlay'].material.alphaMode = BABYLON.Engine.ALPHA_ADD;
	},

	organise : function() {
		u.d.h = $(window).height();
		u.d.w = $(window).width();

		if(u.d.h < 340) {
			u.d.h = 340;
		}

		$('.step,.overlays,body,html').each(function() {
			$(this).css({
				'min-height'  : (u.d.h-1)+'px'
			})
		});
		var minh = u.d.h;
		$('.step .inner.centered, .overlay .inner.centered').each(function() {
			var ptop = ( ( u.d.h - $(this).height() ) * .5 );
			if(ptop < 0) {
				ptop = 0;
			}
			$(this).css({
				'padding-top' : ptop+'px'
			});
			if( minh < $(this).outerHeight() ) {
				minh = $(this).outerHeight();
			}
		});
		u.setBodyClass();
	}
}




//google tracking events
google = {

	init : function() {
		
		//track page
		$('body').on('click', 'a[data-g-track="page"]', function() {
			var title = $(this).attr('data-g-title')
			var url = $(this).attr('data-g-url')
			google.trackPage(title,url);
		});

		//track event
		$('body').on('click', 'a[data-g-track="event"]', function() {
			var action = $(this).attr('data-g-action')
			var label = $(this).attr('data-g-label')
			google.trackEvent('click',action,label,1);
		});

	},

	trackPage : function(title,url) {
		console.log('google page tracked - '+title+', '+url)
		ga('send', 'pageview', {
			'page': url,
			'title': title
		});
	},

	trackEvent : function(category,action,label,value) {
		console.log('google event tracked - '+category+', '+action+', '+label+', '+value)
		ga('send', 'event', category, action, label, value);
	}

}
