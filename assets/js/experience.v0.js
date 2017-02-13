var ex = window.ex || {};
var modals = window.modals || {};


ex = {

	canvas : false,
	engine : false,
	timers : {},
	cameras : {},
	data : {},
	objects : {},

	init : function() {
		console.log('ex.init()');

		$('*[data-experience="create"]').click(function() {
			ex.create();
		});

		ex.timers.start = setTimeout(function() {

			var width = 14;

			//build modal
			var modal = {

				'intro_1' : {
					content: 'THE SMOKE ALARM HAS GONE OFF,',
					size: {
						width  : width,
						height : .8
					},
					pos : { 
						x : 0 
					},
					applyoffset : true,
					type : 'heading'
				},

				'intro_2' : {
					content: 'WHAT SHOULD YOU DO NEXT?',
					size: {
						width  : width,
						height : .8
					},
					pos : { 
						x : 0 
					},
					applyoffset : true,
					type : 'heading'
				},

				'intro_3' : {
					content: '/assets/img/icon_hand.png',
					size: {
						width  : width/2,
						height : .5
					},
					pos : { 
						x : -(width/4)
					},
					applyoffset : true,
					type : 'image'
				},

				'intro_4' : {
					content: '/assets/img/icon_hand.png',
					size: {
						width  : width/2,
						height : .5
					},
					pos : { 
						x : (width/4) 
					},
					applyoffset : false,
					type : 'image'
				},

				'intro_5' : {
					content: 'Click and drag the mouse to',
					size: {
						width  : width/2,
						height : .5
					},
					pos : { 
						x : -(width/4)
					},
					applyoffset : true,
					type : 'copy'
				},

				'intro_6' : {
					content: 'Rollover these icons to',
					size: {
						width  : width/2,
						height : .5
					},
					pos : { 
						x : (width/4) 
					},
					applyoffset : false,
					type : 'copy'
				},

				'intro_7' : {
					content: 'explore the room',
					size: {
						width  : width/2,
						height : .5
					},
					pos : { 
						x : -(width/4)
					},
					applyoffset : true,
					type : 'copy'
				},

				'intro_8' : {
					content: 'discover',
					size: {
						width  : width/2,
						height : .5
					},
					pos : { 
						x : (width/4) 
					},
					applyoffset : false,
					type : 'copy'
				},

				'intro_9' : {
					content: 'got it',
					size: {
						width  : 3,
						height : .8
					},
					pos : { 
						x : 0
					},
					applyoffset : true,
					type : 'button'
				}
			};

			modals.create(modal);

		}, 2000)

	},

	create : function() {
		console.log('ex.create()');

        // get the canvas DOM element
        ex.canvas = document.getElementById('renderCanvas');

        // load the 3D engine
       	ex.engine = new BABYLON.Engine(ex.canvas, true);

        // call the createScene function
        ex.canvas = ex.createScene();

        //before rendering the scene
		ex.scene.registerBeforeRender(function() {
			//do stuff
		});

        // run the render loop
        ex.engine.runRenderLoop(function(){
            ex.canvas.render();
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', function(){
            ex.engine.resize();
        });

        //auto optimise every 10 seconds
		ex.optimiseGame();
		ex.timers.optimiseGame = setInterval(function() {
		  	ex.optimiseGame();
		}, 10000);	

	},


	optimiseGame : function() {
		console.log('ex.optimiseGame()');
		BABYLON.SceneOptimizer.OptimizeAsync(
			ex.scene, 
			BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed(20,2000),
			function() {
				// On success
				console.log('ex.optimiseGame() - high quality')
			}, function() {
				// FPS target not reached
				console.log('ex.optimiseGame() - low quality')
			}
		);
	},

	createScene : function () {
		console.log('ex.createScene()');

		//default fov
		var fov = 1.5;

		//create
		ex.scene = new BABYLON.Scene(ex.engine);

		//CAMERAS

	    //desktop
	    ex.cameras.desktop = new BABYLON.FreeCamera("camera_desktop", new BABYLON.Vector3(0, 2, 0), ex.scene);
		ex.cameras.desktop.inputs.attached.keyboard.attachControl();
	    ex.cameras.desktop.fov = fov;

	    //set active camera
	    ex.scene.activeCamera = ex.cameras.desktop;
	    ex.scene.activeCamera.attachControl(ex.canvas, true);

	    //add video
	    ex.populateVideo("/assets/video/video1.mp4");
	    //play video
		ex.objects.videoTexture.video.play();

	    return ex.scene;
	},

	populateVideo : function(videoURL) {

		//create light source
	    ex.objects.light1 = new BABYLON.HemisphericLight("light_1", new BABYLON.Vector3(0, 0, 0), ex.scene);
	    ex.objects.light1.intensity = 10;

	    //create projection sphere
	    ex.objects.videoSphere = BABYLON.Mesh.CreateSphere("video_sphere", 32, 50, ex.scene);
	    //ex.objects.videoSphere.position.y = 1;
	    
	    //create mat
		ex.objects.videoSphereMat = new BABYLON.StandardMaterial("mat", ex.scene);
		ex.objects.videoSphereMat.backFaceCulling = false;
		ex.objects.videoSphereMat.emissiveColor = new BABYLON.Color3(1,1,1);
		
		//assign video
		ex.objects.videoTexture = new BABYLON.VideoTexture("video", [videoURL], ex.scene, true, true);
		ex.objects.videoSphereMat.diffuseTexture = ex.objects.videoTexture;
		ex.objects.videoSphere.material = ex.objects.videoSphereMat;

	}


}

modals = {
	objects : {},

	init : function() {

	},

	create : function(boxes) {

		var args = {
			'intro_0' : {
				content: '',
				size: {
					width  : 14,
					height : .5
				},
				pos : { 
					x : 0 
				},
				applyoffset : true
			}
		}

		for(key in boxes) {
			args[key] = boxes[key];
		}


		var yoffset = 0;
		var textboxes = {};
		var prevheight = 0;

		//figure out the yoffset
		for(key in args) {
			if(args[key].applyoffset) {
				yoffset += args[key].size.height;
			}
		}

		for(key in args) {

			//loop through each
			if(args[key].type == 'heading') {
				textboxes[key] = new BABYLON.Text2D(
					args[key].content, 
					{
						id: "text",
						fontName: "50pt 'Quicksand'", 
						marginAlignment: "h:center, v:center"
					}
				)

			} else if(args[key].type == 'button') {
				textboxes[key] = new BABYLON.Text2D(
					args[key].content, 
					{
						id: "text",
						fontName: "25pt 'Quicksand'", 
						marginAlignment: "h:center, v:center"
					}
				)

			} else if(args[key].type == 'image') {

				textboxes[key] = new BABYLON.Rectangle2D({ 
					parent: modals.objects[key], 
					x: 45, 
					y: 45, 
					width: 30, 
					height: 30, 
					fill: null
				});

				// var texture = new BABYLON.Texture(args[key].content, ex.scene, true, false, BABYLON.Texture.NEAREST_SAMPLINGMODE);
				// var mat = new BABYLON.StandardMaterial("mat", ex.scene);
				// mat.diffuseTexture = texture;
				// textboxes[key].material = mat;

			//default to copy
			} else {
				textboxes[key] = new BABYLON.Text2D(
					args[key].content, 
					{
						id: "text",
						fontName: "25pt 'Quicksand'", 
						marginAlignment: "h:center, v:center"
					}
				)

			}

			if(args[key].applyoffset) {
				yoffset -= ( (args[key].size.height*.5) + (prevheight*.5) );
			}

			//create modal
			modals.objects[key] = new BABYLON.WorldSpaceCanvas2D(ex.scene, new BABYLON.Size(args[key].size.width, args[key].size.height), {
			    id: "WorldSpaceCanvas",
			    worldPosition: new BABYLON.Vector3(args[key].pos.x, yoffset, 15),
			    worldRotation: BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 0),
			    renderScaleFactor: 96,
			    enableInteraction: false,
			    backgroundFill: "#00000090",
				//paddingTop: args[key].padding.top,
				//paddingBottom: args[key].padding.bottom,
			    children: [ textboxes[key] ]
			});

			// if(!prevheight) {
			// 	prevheight = args[key].size.height*.25;
			// }


			prevheight = args[key].size.height;

		}

		//modals.centerText(text2d, 300);

	},


	centerText : function(text2d, maxWidth) {
		
		var str = text2d.text;
		var arr1 = str.split(' ');
		var line = [];
		var lines = [];
		
		var texture = text2d.fontTexture;
		var spaceWidth = texture.spaceWidth;
		var lineWidth = 0;
		
		for (var i = 0; i < arr1.length; i++){
			
			var word = arr1[i];
			var wordWidth = texture.measureText(word).width;
			
			if (lineWidth + wordWidth + spaceWidth < maxWidth) {
				
				lineWidth += wordWidth + spaceWidth;
				line.push(word);
				
			} else {
				
				var numSpaces = Math.ceil(((maxWidth - lineWidth) * .5)/spaceWidth);
				var spaces = Array(numSpaces).join(' ');
				line.unshift(spaces);
				line.push(spaces);
				lines.push(line.join(' '));
				
				line.length = 0;
				lineWidth = wordWidth + spaceWidth;
				line.push(word);
				
			}
			
		}
		
		var numSpaces = Math.ceil(((maxWidth - lineWidth) * .5)/spaceWidth);
		var spaces = Array(numSpaces).join(' ');
		line.unshift(spaces);
		line.push(spaces);
		lines.push(line.join(' '));
				
		text2d.text = lines.join('\n');
		
	}
}