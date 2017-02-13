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
	temp : {
		floor : 0,
		ceiling : 0
	},
	timers : {},
	videoStart : 0,
	placement : {
		desktop : {
			top : .72,
			bottom: -.72,
			scale : .9
		},
		mobile : {
			top : .55,
			bottom: -.55,
			scale : 1.2
		},
		vr : {
			//top : 1.4,
			//bottom: -1.4,
			top : .8,
			bottom: -.8,
			scale : 2.7
		}
	},

	place : function() {
		console.log('timer.place()');
		var font = new FontFaceObserver("Quicksand");
		font.load().then(function () {
			timer.placePlane('temp_ceiling_display',u.imageBase+'_0000_top.png', timer.placement[u.camera].top, timer.placement[u.camera].scale);
			timer.placePlane('time_display', u.imageBase+'_0002_top_blank.png', timer.placement[u.camera].top, timer.placement[u.camera].scale);
			timer.placePlane('temp_floor_display',u.imageBase+'_0001_bottom.png', timer.placement[u.camera].bottom, timer.placement[u.camera].scale);
			timer.reset();
			timer.update();
			timer.start();
			timer.isPlaced = true;
		});
	},

	placePlane : function(name,bgimg,pos,scale) {
		console.log('timer.placePlane('+name+','+pos+','+scale+')');

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

		if(bgimg) {
			var bar = new BABYLON.StandardMaterial("bar"+name, ex.scene);
			bar.diffuseTexture = new BABYLON.Texture(bgimg, ex.scene);
			bar.diffuseTexture.hasAlpha = true;
			bar.useAlphaFromDiffuseTexture = true;
			bar.backFaceCulling = true;
			bar.emissiveColor = new BABYLON.Color3(1,1,1);
			bar.alpha = 1;
			timer.objects[name+'_bg'].material = bar;
		}

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
		timer.temp.floor = 30;
		timer.temp.ceiling = 30;
	},

	start : function() {
		clearInterval(ex.timers.timer);
		ex.timers.timer = setInterval(function() {
			timer.current = moment('2016-01-01'); 
			timer.current.add((ex.objects.sphereVideo.video.duration - 4), 'seconds');
			timer.current.subtract((ex.objects.sphereVideo.video.currentTime*1000), 'milliseconds');

			timer.temp.floor = ( ( ex.objects.sphereVideo.video.currentTime * ex.objects.sphereVideo.video.currentTime ) * .015 ) + 20 ;
			timer.temp.ceiling = ( ( ex.objects.sphereVideo.video.currentTime * ex.objects.sphereVideo.video.currentTime ) * .1 ) + 20 ;

			//var seconds = (timer.current.format('m')*60)+timer.current.format('s')
			if(ex.objects.sphereVideo.video.currentTime >= (ex.objects.sphereVideo.video.duration - 5) ) {
				clearInterval(ex.timers.timer);
				timer.outoftime();
			}
		}, 100);
	},

	update : function() {
		
		var tempfontsize = 30;
		var timefontsize = 17;

		var temp_floor_offset = 120;
		var temp_ceiling_offset = 43;
		var timeoffset = 90;


		//ceiling temperature
		timer.objects.temp_ceiling_display_output.drawText( Math.round(timer.temp.ceiling), null, temp_ceiling_offset, tempfontsize+"px Quicksand", "white", "#000000");

		var timedisp = timer.current.format('mm:ss');
		if(timer.current.format('s') % 2) {
			timedisp = timer.current.format('mm ss');
		}
		//timer
		timer.objects.time_display_output.drawText(timedisp, null, timeoffset, timefontsize+"px Courier", "white", "#000000");

		//floor temperature
		timer.objects.temp_floor_display_output.drawText( Math.round(timer.temp.floor), null, temp_floor_offset, tempfontsize+"px Quicksand", "white", "#000000");
	},

	resize : function() {
        //timer.objects.timerOutput.position = new BABYLON.Vector3((u.d.w-300), 0, 0);
	},

	outoftime : function() {
		modals.closeAll();
		
		u.createPanel(
			'panel1', 
			u.imageBase+'panels/_0004_this-room-is-now-unsurvivable.png', 
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
				u.imageBase+'panels/_0004_this-room-is-now-unsurvivable.png', 
				ex.scene,
				Math.PI, { 
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