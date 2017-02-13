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

	place : function() {
		console.log('timer.place()');

		var font = new FontFaceObserver("Quicksand");
		font.load().then(function () {


			timer.objects.rect = BABYLON.MeshBuilder.CreatePlane("plane", 10.0, ex.scene);
			timer.objects.rect.position =  new BABYLON.Vector3(0, 0, 5);
			//timer.objects.rect.parent = ex.scene.activeCamera;

			timer.objects.timerOutput = new BABYLON.WorldSpaceCanvas2D(ex.scene, new BABYLON.Size(2, 2), {
				id: "WorldSpaceCanvas",
				parent : timer.objects.rect,
				worldPosition: new BABYLON.Vector3(0, 0, 5),
				enableInteraction: false,		
		   		renderScaleFactor: 64,
   			 	//backgroundFill: "#C0C0C040",
				children: [
					new BABYLON.Text2D("World Space Canvas", { 
						fontName: "20px Quicksand", 
						marginAlignment: "h: center, v: center", 
						fontSuperSample: true,
						scale : .01
					})
				]
			});



			if(!timer.isPlaced) {
				timer.isPlaced = true;
				timer.reset();
			}

			timer.update();
			timer.start();
		});
	},

	reset : function() {
		timer.current = moment('2016-01-01'); 
		timer.current.add(30, 'seconds');
		//timer.temp = 30;
	},

	start : function() {
		clearInterval(ex.timers.timer);
		ex.timers.timer = setInterval(function() {
			timer.current.add(250, 'milliseconds');
			timer.temp += .5;
			timer.update();
		}, 250);
	},

	update : function() {
		//console.log('timer.update()');
		timer.objects.timerOutput.children[0].text = timer.current.format('mm:ss')+'s, '+timer.temp+'c';
	},

	resize : function() {
        timer.objects.timerOutput.position = new BABYLON.Vector3((u.d.w-300), 0, 0);
	}

}