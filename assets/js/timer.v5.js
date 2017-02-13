var timer = window.timer || {};

//
//	DESIGNED/CODED BY FCBNZ - ANDREW JACKSON
//
//	(╯°□°）╯︵ ┻━┻
//

timer = {
	current : false,
	objects : {},
	isPlaced : false,
	temp : 0,
	timers : {},
	videoStart : 0,

	place : function() {
		console.log('timer.place()');

		var font = new FontFaceObserver("Quicksand");
		font.load().then(function () {

			if(u.camera == 'mobile') {
				timer.placePlane('temp_display', .55, 1.5);
				timer.placePlane('time_display', -.78, 1.5);

			} else if(u.camera == 'vr') {
				timer.placePlane('temp_display', 1.35, 2.7);
				timer.placePlane('time_display', -1.7, 2.7);

			} else {
				timer.placePlane('temp_display', .74, .8);
				timer.placePlane('time_display', -.87, .8);
			}

			timer.reset();
			timer.update();
			timer.start();
			timer.isPlaced = true;
		});
	},

	placePlane : function(name,pos,scale) {
		console.log('timer.placePlane('+name+','+pos+','+scale+')');

		var bgimg = '/assets/img/_0000_timer.png?v=2';
		if(name == 'temp_display') {
			bgimg = '/assets/img/_0001_temp.png?v=2'
		}

		//data reporter
		timer.objects[name] = BABYLON.Mesh.CreatePlane(name, .25, ex.scene, false);
		timer.objects[name].scaling = new BABYLON.Vector3(scale, scale, scale);
		timer.objects[name].position = new BABYLON.Vector3(0, pos,1);
		timer.objects[name].parent = ex.scene.activeCamera;
		timer.objects[name+'_output'] = new BABYLON.DynamicTexture("dynamic texture", 128, ex.scene, true);
	    timer.objects[name+'_output'].hasAlpha = true;
	    timer.objects[name+'_output'].useAlphaFromDiffuseTexture = true;
	    timer.objects[name+'_output'].backFaceCulling = true;

		timer.objects[name].material = new BABYLON.StandardMaterial(name, ex.scene);
		timer.objects[name].material.diffuseTexture = timer.objects[name+'_output'];
		timer.objects[name].material.specularColor = new BABYLON.Color3(0, 0, 0);
		timer.objects[name].material.emissiveColor = new BABYLON.Color3(1, 1, 1);
		timer.objects[name].material.backFaceCulling = true;
		timer.objects[name].material.alpha = .9;

		//add the button
		timer.objects[name+'_bg'] = BABYLON.Mesh.CreatePlane(name, .25, ex.scene, false);
		timer.objects[name+'_bg'].scaling = new BABYLON.Vector3(scale, scale, scale);
		timer.objects[name+'_bg'].position = new BABYLON.Vector3(0, pos,1);
		timer.objects[name+'_bg'].parent = ex.scene.activeCamera;

		var bar = new BABYLON.StandardMaterial("bar"+name, ex.scene);
		bar.diffuseTexture = new BABYLON.Texture(bgimg, ex.scene);
		bar.diffuseTexture.hasAlpha = true;
		bar.useAlphaFromDiffuseTexture = true;
		bar.backFaceCulling = true;
		bar.emissiveColor = new BABYLON.Color3(1,1,1);
		bar.alpha = 1;

		timer.objects[name+'_bg'].material = bar;

		timer.objects[name].material.alphaMode = BABYLON.Engine.ALPHA_ADD;

	},

	beforeRender : function() {
		if(timer.isPlaced && ex.running) {
			timer.update();
		}
	},

	reset : function() {
		timer.current = moment('2016-01-01'); 
		//timer.current.add(20, 'seconds');
		timer.temp = 30;
	},

	start : function() {
		clearInterval(ex.timers.timer);
		ex.timers.timer = setInterval(function() {
			timer.current = moment('2016-01-01'); 
			timer.current.add((ex.objects.sphereVideo.video.duration - 4), 'seconds');
			timer.current.subtract((ex.objects.sphereVideo.video.currentTime*1000), 'milliseconds');

			timer.temp = ( ( ex.objects.sphereVideo.video.currentTime * ex.objects.sphereVideo.video.currentTime ) * .1 ) + 20 ;
			//var seconds = (timer.current.format('m')*60)+timer.current.format('s')
			if(ex.objects.sphereVideo.video.currentTime >= (ex.objects.sphereVideo.video.duration - 5) ) {
				clearInterval(ex.timers.timer);
				timer.outoftime();
			}
		}, 100);
	},

	update : function() {
		
		var tempfontsize = 30;
		var timefontsize = 20;

		var tempoffset = 79;
		var timeoffset = 28;

		if(u.camera == 'mobile') {

		}

		//temperature
		timer.objects.temp_display_output.drawText( Math.round(timer.temp), null, tempoffset, tempfontsize+"px Quicksand", "white", "#000000");

		//timer
		timer.objects.time_display_output.drawText(timer.current.format('mm:ss')+'s', 36, timeoffset, timefontsize+"px Quicksand", "white", "#000000");
	},

	resize : function() {
        //timer.objects.timerOutput.position = new BABYLON.Vector3((u.d.w-300), 0, 0);
	},

	outoftime : function() {
		modals.closeAll();
		
		u.createPanel(
			'panel1', 
			'/assets/img/panels/_0004_this-room-is-now-unsurvivable.png', 
			ex.scene,
			0, { 
				buttonImage : '_0003_exit-house.png',
				onclick : function() {
					ex.destroy();
					ex.videos.current = 'streetview';
					sv.create();
				}
			},{
				buttonImage : '_0000_try-again.png',
				onclick : function() { 
					ex.destroy();
					timer.videoStart = 0; 
					ex.videos.current = 'lounge';
					u.setVideoBandwidth();
					ex.create();
				}
			}
		);
		if(u.camera == 'vr') {
			u.createPanel(
				'panel1_vr', 
				'/assets/img/panels/_0004_this-room-is-now-unsurvivable.png', 
				ex.scene,
				Math.PI/2, { 
					buttonImage : '_0003_exit-house.png',
					onclick : function() {
						ex.destroy();
						ex.videos.current = 'streetview';
						sv.create();
					}
				},{
					buttonImage : '_0000_try-again.png',
					onclick : function() { 
						ex.destroy();
						timer.videoStart = 0; 
						ex.videos.current = 'lounge';
						u.setVideoBandwidth();
						ex.create();
					}
				}
			);
		}

		var int = 1;
		var timebetween = 1000;
		
		ex.fade.speed = .0015;
		ex.fade.to = 0;

		if(ex.pointer && u.camera == 'mobile') {
			ex.pointer.visibility = false;
		}

		u.timers['fadein_'+int] = setTimeout(function(int) {
			u.fadeInPanel('panel'+int);
			if(u.camera == 'vr') {
				u.fadeInPanel('panel'+int+'_vr');
			}
		},timebetween,int);

		//timebetween += 2500;
		// timer.timers['fadeout_nextscene'] = setTimeout(function() {
		// 	ex.destroy();
		// 	ex.videos.current = 'streetview';
		// 	sv.create();
		// },timebetween);
	}

}