var u = window.u || {};
var google = window.google || {};
var overlays = window.overlays || {};
var gm = window.gm || {};

//
//	CODED BY FCBNZ - ANDREW JACKSON
//
//	(╯°□°）╯︵ ┻━┻
//

$(document).ready(function() {
	u.organise();
	u.init();

	hm.init();
	hm.create();

	ex.init();
	//ex.create();

	overlays.init();
});

$(window).load(function() {

});

$(window).resize(function() {
	u.organise();
});


gm = {
	autocomplete : false,
	place : false,
	imageurl : '/data/?doAction=streetview&location=15 franklin rd, ponsonby&fov=80&fallback1=ponsonby&fallback2=ponsonby',
	userdata : {},

	init : function() {
		gm.autocomplete = new google.maps.places.Autocomplete(
		/** @type {!HTMLInputElement} */(document.getElementById('address_finder')),
		{types: ['geocode']});
		gm.autocomplete.addListener('place_changed', gm.getStreetMapImage);

		$('#address_finder').focus(function() {
			//alert('focused');
			$(this).parent().addClass('input_active');
		})
		$('#address_finder').focusout(function() {
			$(this).parent().removeClass('input_active');
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

   		gm.imageurl = '/data/?doAction=streetview&location='+gm.userdata.address+'&fov=80&fallback1='+gm.userdata.addressfallback1+'&fallback2='+gm.userdata.addressfallback2;
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
				if(!detect.hasGyro) {
					u.camera = 'desktop';
					hm.destroy();
					ex.create();
				} else if(u.d.w > 768) {
					u.camera = 'mobile'
					hm.destroy();
					ex.create();
				} else {
					overlays.open('#vr_select');
				}
			} else {	
				u.camera = $(this).attr('data-camera');
				hm.destroy();
				ex.create();
			}
			console.log('-----------------------');
			console.log(u.camera);
			console.log('-----------------------');

			$('body').attr('class', 'camera_'+u.camera)
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

	camera : 'mobile',
	activeCamera : 'desktop',
	cameras : {},
	hasGyro : false,
	d : {},
	engine : false,
	canvas : false,
	videoPerLoaded : 0,
	videoPerLoadedOver : 0,
	timers : {},
	objects : {},
	
	setOrientation : function(orientation) {
		if(orientation == 'landscape') {
			var lockFunction =  window.screen.orientation.lock;
			if (lockFunction.call(window.screen.orientation, 'landscape')) {
				console.log('Orientation locked')
			} else {
				console.error('There was a problem in locking the orientation')
			}
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

		window.addEventListener("devicemotion", function(event){
		    if(event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma)
		        detect.hasGyro = true;
		});

		u.canvas = document.getElementById('renderCanvas');
       	u.engine = new BABYLON.Engine(u.canvas, true);

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

  		if(platform == 'ios' && ( u.d.w > 1080 || u.d.h > 1080 ) ) {
			if(u.d.w > u.d.h) {
				u.engine.setHardwareScalingLevel(1080 / u.d.h);
			} else {
				u.engine.setHardwareScalingLevel(1080 / u.d.w);
			}
		}

        // the canvas/window resize event handler
        window.addEventListener('resize', function(){
        	if(ex.running) {
           		timer.resize();
        	}
            u.engine.resize();
        });

        

	},

	setVideoBandwidth : function() {
		console.log('ex.setVideoBandwidth()');
		if( u.speed.mbps > 20 && u.d.w > 1100 && platform != 'ios') {
			console.log('high bandwidth');
			ex.videos[ex.videos.current].current = ex.videos[ex.videos.current].desktop;
		} else {
			console.log('low bandwidth');
			ex.videos[ex.videos.current].current = ex.videos[ex.videos.current].mobile;
		}
	},

	videoLoaded : function(e) {
		//console.log(e);
		var obj = e.target;
		//u.videoPerLoadedOver += .5;
		if(obj.buffered != null && obj.readyState === 4) {
			var indexstart = obj.buffered.length - 1;
			var indexend = obj.buffered.length - 1;
			if(platform == 'ios') {
				indexstart = 0;
			}
			durationIncludingOffset = obj.duration - obj.buffered.start(indexstart);
			currentIncludingOffset = obj.buffered.end(indexend) - obj.buffered.start(indexstart);
			u.videoPerLoaded = currentIncludingOffset / durationIncludingOffset;

			var displayloaded = ( u.videoPerLoaded * 100 ) * ( 1 / ex.videos.minload[platform] );

			$('#per_output').html('Loading... '+(Math.round( displayloaded * 10 ) / 10)+'%');
			
		} else {
			u.videoPerLoaded = 0;
		}
		console.log("loading "+e.target.currentSrc+": "+u.videoPerLoaded);
		console.log('play time: '+obj.currentTime);

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
		url : "/assets/img/loadtest.png",
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
		//fade in panel
		u.timers[panel+'_in'] = setInterval(function(panel) {
			u.objects[panel].material.alpha += .1;
			if(u.objects[panel].material.alpha >= 1) {
				clearInterval(u.timers[panel+'_in']);
			}
		}, 33, panel);
	},

	fadeOutPanel : function(panel) {
		console.log('fade out '+panel);
		//fade in panel
		u.timers[panel+'_out'] = setInterval(function(panel) {
			u.objects[panel].material.alpha -= .1;
			//console.log(panel+' - '+timer.objects[panel].material.alpha)
			if(u.objects[panel].material.alpha <= 0) {
				clearInterval(u.timers[panel+'_out']);
			}
		}, 33, panel);
	},

	createPanel : function(name,img, scene) {
		//data reporter
		u.objects[name] = BABYLON.Mesh.CreatePlane(name, 4, scene, false);
		u.objects[name].parent = scene.activeCamera;
		u.objects[name].position = new BABYLON.Vector3(0, 0, 3);
		u.objects[name].hasAlpha = true;
		//timer.objects.outoftime.scaling = new BABYLON.Vector3(.5, .5, .5);

		//add the button
		var copy = new BABYLON.StandardMaterial(name+"_copy", scene);
		copy.diffuseTexture = new BABYLON.Texture(img, scene);
		copy.diffuseTexture.hasAlpha = true;
		copy.useAlphaFromDiffuseTexture = true;
		copy.backFaceCulling = true;
		copy.emissiveColor = new BABYLON.Color3(1,1,1);
		copy.alpha = 0;


		u.objects[name].material = copy;

	},

	organise : function() {
		u.d.h = $(window).height();
		u.d.w = $(window).width();
		$('.step').each(function() {
			$(this).css({
				'min-height'  : (u.d.h)+'px'
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
		// ga('send', 'pageview', {
		// 	'page': url,
		// 	'title': title
		// });
	},

	trackEvent : function(category,action,label,value) {
		console.log('google event tracked - '+category+', '+action+', '+label+', '+value)
		//ga('send', 'event', category, action, label, value);
	}



}
