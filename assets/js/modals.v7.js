var modals = window.modals || {};

//
//	DESIGNED/CODED BY FCBNZ - ANDREW JACKSON
//
//	(╯°□°）╯︵ ┻━┻
//

modals = {
	objects : {
		modals : {},
		buttons : {},
		pins : {}
	},
	content : {},
	timers : {},
	data : {},
	scale : {
		desktop : 1,
		mobile : 1.25,
		vr : 2
	},

	init : function() {

	},

	clearTimers : function(modal, hard) {
		console.log('ex.clearTimers('+modal+', '+hard+')');
		var re = new RegExp(modal, 'g');
		for(key in modals.timers) {
			if(key.match(re) && ( (key != modal+'_animate_rot' && key != modal+'_animate_alpha' && key != modal+'_animate_z' && key != modal+'_animate_rot') || hard ) ) {
				console.log('clearing '+key);
				clearInterval(modals.timers[key]);
			}
		}
	},

	closeAll : function() {
		for(key in modals.content[ex.videos.current]) {
			if(key != 'init' && typeof modals.objects.modals[key] == 'object') {
				modals.remove(key);
			}
		}
	},

	fadeOutPanel : function(modal) {
		console.log('modals.fadeOutPanel('+modal+')');
		google.trackEvent('modal','hide',modal,1);

		modals.clearTimers(modal,false);
		//only do fade out if mouseout isnt
		if(typeof modals.content[ex.videos.current][modal] == 'undefined') {
			console.log('modal doesnt exist anymore');
		} else if(typeof modals.content[ex.videos.current][modal].doMouseOuts == 'undefined' || modals.content[ex.videos.current][modal].doMouseOuts) {
			modals.timers[modal+'_onmouseover_animate_out'] = setInterval(function(modal) {
				if(modals.objects.modals[modal] != undefined && modals.objects.modals[modal].material.alpha > 0) {
					modals.objects.modals[modal].material.alpha -= .1;
				} else if(modals.objects.modals[modal] != undefined && !modals.objects.modals[modal].isDisposed) {
					modals.objects.modals[modal].visibility = false;
					clearInterval(modals.timers[modal+'_onmouseover_animate_out']);
				}
			}, 33, modal);
		} else {
			console.log('fade out overridden');
		}
	},

	fadeInPanel : function(modal) {
		console.log('modals.fadeInPanel('+modal+')');
		google.trackEvent('modal','show',modal,1);

		modals.clearTimers(modal,false);
		if(typeof modals.content[ex.videos.current][modal] == 'undefined' || modals.objects.modals[modal] == 'undefined') {
			console.log('modal doesnt exist anymore');

		} else {
			//make sure modal is set to visible
			modals.objects.modals[modal].visibility = true;
			//create the timer that brings the modal into view
			modals.timers[modal+'_onmouseover_animate'] = setInterval(function(modal) {
				if(modals.objects.modals[modal] != undefined && modals.objects.modals[modal].material.alpha < 1) {
					modals.objects.modals[modal].material.alpha += .1;
				} else {
					//clear the interval
					clearInterval(modals.timers[modal+'_onmouseover_animate']);
				}
			}, 33, modal);
		}
	},

	remove : function(modal) {
		modals.clearTimers(modal,true);
		console.log('modals.remove('+modal+') - '+ex.videos.current);
		if(typeof modals.objects.modals["modal_"+modal] == 'object') {
			modals.objects.modals["modal_"+modal].dispose();
		}
		if(typeof modals.objects.modals[modal] == 'object') {
			modals.objects.modals[modal].dispose();
		}
		if(typeof modals.objects.pins["pin_"+modal] == 'object') {
			modals.objects.pins["pin_"+modal].dispose();
		}
	},

	place : function(modal) {
		console.log('modals.place('+modal+') - '+ex.videos.current);

		var emmsiveColor = .75;
		var scale = modals.scale.desktop;
		
		if(u.camera == 'vr') {
			scale = modals.scale.vr;
		} else if(u.d.w < 800) {
			scale = modals.scale.mobile;
		}

		var thisscene = ex.scene;
		if(ex.videos.current == 'streetview') {
			thisscene = sv.scene;
		}


		//--------CONTENT
		modals.objects.modals[modal] = BABYLON.MeshBuilder.CreatePlane(
			"modal_"+modal, {
				width: 		modals.content[ex.videos.current][modal].size.width*scale,
				height: 	modals.content[ex.videos.current][modal].size.height*scale//,
				//updatable: 	true
			}, thisscene
		);
		//position
		modals.objects.modals[modal].rotation.y = modals.content[ex.videos.current][modal].position.rotate;
		modals.objects.modals[modal].rotation.x = modals.content[ex.videos.current][modal].position.y - ((scale-1)*.1);
		modals.objects.modals[modal].setPivotMatrix(BABYLON.Matrix.Translation(0, ex.playerheight, modals.content[ex.videos.current][modal].position.z));
		//default content
		var content = new BABYLON.StandardMaterial("modaltexture_"+modal, thisscene);
		if(typeof modals.content[ex.videos.current][modal].img == 'object') {
	  		content.diffuseTexture = new BABYLON.Texture(modals.content[ex.videos.current][modal].img[ex.activeCamera], thisscene);
		} else {
			content.diffuseTexture = new BABYLON.Texture(modals.content[ex.videos.current][modal].img, thisscene);
		}
		content.diffuseTexture.hasAlpha = true;
		content.useAlphaFromDiffuseTexture = true;
		content.backFaceCulling = true;
		content.emissiveColor = new BABYLON.Color3(emmsiveColor,emmsiveColor,emmsiveColor);
   	 	modals.objects.modals[modal].material = content;

   	 	if(typeof modals.content[ex.videos.current][modal].alpha == 'number') {
			modals.objects.modals[modal].material.alpha = modals.content[ex.videos.current][modal].alpha;
			if(modals.content[ex.videos.current][modal].alpha == 0) {
				modals.objects.modals[modal].visibility = false;
			}
   	 	}

   	 	if(modals.content[ex.videos.current][modal].attachtocamera == true ) { //&& ex.activeCamera == 'desktop'
   	 		modals.objects.modals[modal].rotation.y = 0;
   	 		modals.objects.modals[modal].rotation.x = 0;
			modals.objects.modals[modal].parent = thisscene.activeCamera;
			//if so, fade out also
			//ex.fade.to = .5;
   	 	}

   	 	//--------PIN
   	 	if(modals.content[ex.videos.current][modal].hasPin) {
   	 		//if there is a pin, assume that the modal should be off by default
			modals.objects.modals[modal].material.alpha = 0;
			modals.objects.modals[modal].visibility = false;
			//create the pin
			modals.objects.pins[modal] = BABYLON.MeshBuilder.CreatePlane(
				"pin_"+modal, {
					width:  (modals.content[ex.videos.current][modal].size.width*scale)*.17,
					height: (modals.content[ex.videos.current][modal].size.width*scale)*.17,
					updatable:true
				}, thisscene
			);
			//set the parent to the modal
			modals.objects.pins[modal].parent = modals.objects.modals[modal];
			//position the pin
			modals.objects.pins[modal].position.y = -( (modals.content[ex.videos.current][modal].size.height*scale) * .85 );
			modals.objects.pins[modal].position.z = .1;
	   	 	//add the pin texture
			var pin = new BABYLON.StandardMaterial("pintexture_"+modal, thisscene);
			pin.diffuseTexture = new BABYLON.Texture(modals.content[ex.videos.current][modal].hasPin, thisscene);
			pin.diffuseTexture.hasAlpha = true;
			pin.useAlphaFromDiffuseTexture = true;
			pin.backFaceCulling = true;
			//give it an emissive colour or will look dank as f
			pin.emissiveColor = new BABYLON.Color3(emmsiveColor,emmsiveColor,emmsiveColor);
			//apply
	   	 	modals.objects.pins[modal].material = pin;
	   	 	//click action
			modals.objects.pins[modal].actionManager = new BABYLON.ActionManager(thisscene);
			//over
			modals.objects.pins[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(evt) {
				var index = evt.source.name.replace("pin_", "");
				clearTimeout(modals.timers[index+"_autoout"]);
				if(u.camera == 'desktop') {
					ex.scene.activeCamera.detachControl(u.canvas, false);
				}
				modals.content[ex.videos.current][index].onmouseover();
			}));
			//down press
			modals.objects.pins[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function(evt) {
				var index = evt.source.name.replace("pin_", "");
				console.log('mouseclick for '+index+' detected')
				clearTimeout(modals.timers[index+"_autoout"]);
				if(u.camera == 'desktop') {
					ex.scene.activeCamera.attachControl(u.canvas, false);
				}
				if(typeof modals.content[ex.videos.current][index].onclick == "function" ) {
					modals.content[ex.videos.current][index].onclick();
				}
			}));
			//out
			modals.objects.pins[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(evt) {
				var index = evt.source.name.replace("pin_", "");
				clearTimeout(modals.timers[index+"_autoout"]);
				if(u.camera == 'desktop') {
					ex.scene.activeCamera.attachControl(u.canvas, false);	
				}
				modals.timers[index+"_autoout"] = setTimeout(function(index) {
					modals.content[ex.videos.current][index].onmouseout();
				}, 1000, index);
			}));
   	 	}

	}

}
