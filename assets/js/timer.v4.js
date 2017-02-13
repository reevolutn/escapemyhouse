var timer = window.timer || {};

//
//	CODED BY FCBNZ - ANDREW JACKSON
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
				timer.placePlane('temp_display', -.75,1);
				timer.placePlane('time_display', .75,1);
			} else if(u.camera == 'vr') {
				timer.placePlane('temp_display', -1.85,4);
				timer.placePlane('time_display', 1.85,4);
			} else {
				timer.placePlane('temp_display', -.87,1);
				timer.placePlane('time_display', .87,1);
			}

			//timer.placePlane('temp_display', 0);
			//timer.placePlane('time_display', 0);

			timer.reset();
			timer.update();
			timer.start();
			timer.isPlaced = true;
		});
	},

	placePlane : function(name,pos,scale) {


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
		bar.diffuseTexture = new BABYLON.Texture('/assets/img/timerbg.png', ex.scene);
		bar.diffuseTexture.hasAlpha = true;
		bar.useAlphaFromDiffuseTexture = true;
		bar.backFaceCulling = true;
		bar.emissiveColor = new BABYLON.Color3(1,1,1);
		bar.alpha = .8;

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
			timer.current.add(ex.objects.sphereVideo.video.currentTime, 'seconds');
			timer.temp =  ((ex.objects.sphereVideo.video.currentTime*1.75 ) + 30 );
			var seconds = (timer.current.format('m')*60)+timer.current.format('s')
			if(ex.objects.sphereVideo.video.currentTime >= (ex.objects.sphereVideo.video.duration - 7) ) {
				clearInterval(ex.timers.timer);
				timer.outoftime();
			}
		}, 500);
	},

	update : function() {
		
		var tempfontsize = 20;
		var timefontsize = 20;
		var tempoffset = 29;
		var timeoffset = 112;

		if(u.camera == 'mobile') {
			//tempoffset = 460;
			//timeoffset = 1800;
		}

		timer.objects.temp_display_output.drawText( Math.round(timer.temp)+'c', 30, tempoffset, tempfontsize+"px Quicksand", "white", "#000000");
		timer.objects.time_display_output.drawText(timer.current.format('mm:ss')+'s', 30, timeoffset, timefontsize+"px Quicksand", "white", "#000000");
	},

	resize : function() {
        //timer.objects.timerOutput.position = new BABYLON.Vector3((u.d.w-300), 0, 0);
	},

	outoftime : function() {
		modals.closeAll();
		
		u.createPanel('panel1', '/assets/img/gameover/frame1.png', ex.scene);
		u.createPanel('panel2', '/assets/img/gameover/frame2.png', ex.scene);
		u.createPanel('panel3', '/assets/img/gameover/frame3.png', ex.scene);

		var int = 1;
		var timebetween = 1000;

		modals.closeAll();
		ex.fade.speed = .0015;
		ex.fade.to = 0;

		if(ex.pointer) {
			ex.pointer.visibility = false;
		}

		while(int < 4) {
			console.log('settting '+int);
			u.timers['fadein_'+int] = setTimeout(function(int) {
				u.fadeInPanel('panel'+int);
			},timebetween,int);
			timebetween += 3000;
			u.timers['fadeout_'+int] = setTimeout(function(int) {
				u.fadeOutPanel('panel'+int);
			},timebetween,int);
			timebetween += 1000;
			int ++;
		}

		//timebetween += 2500;
		timer.timers['fadeout_nextscene'] = setTimeout(function() {
			ex.destroy();
			ex.videos.current = 'streetview';
			sv.create();
		},timebetween);
	}

}