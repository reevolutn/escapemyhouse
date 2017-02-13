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

	place : function() {
		console.log('timer.place()');

		var font = new FontFaceObserver("Quicksand");
		font.load().then(function () {

			timer.objects.timerOutput = new BABYLON.ScreenSpaceCanvas2D(ex.scene, {
			    id: "ScreenCanvas",
			    size: new BABYLON.Size(300, 100),
	    		position: new BABYLON.Vector3( ((u.d.w/2)-150), 0, 0),
			    //backgroundFill: "#4040408F",
			    children: [
			        new BABYLON.Text2D("00:00s", {
			            id: "text",
			            marginAlignment: "h: center, v:center",
			            fontName: "50px Quicksand"
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
	},

	start : function() {
		clearInterval(ex.timers.timer);
		ex.timers.timer = setInterval(function() {
			timer.current.add(1000, 'milliseconds');
			timer.update();
		}, 1000);
	},

	update : function() {
		//console.log('timer.update()');
		timer.objects.timerOutput.children[0].text = timer.current.format('mm:ss')+'s';
	},

	resize : function() {
        timer.objects.timerOutput.position = new BABYLON.Vector3((u.d.w-300), 0, 0);
	}

}