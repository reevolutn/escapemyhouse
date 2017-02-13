var modals = window.modals || {};

//
//	CODED BY FCBNZ - ANDREW JACKSON
//
//	(╯°□°）╯︵ ┻━┻
//

modals = {
	objects : {
		modals : {},
		buttons: {},
		pins: {}
	},
	content : {},
	timers : {},
	data : {},

	init : function() {

	},

	fadeIn : function(modal) {
		console.log('modals.fadeIn('+modal+')')
		//fade in
		clearInterval(modals.timers[modal+'_onmouseover_animate']);
		clearInterval(modals.timers[modal+'_onmouseover_animate_out']);
		modals.objects.modals[modal].visibility = true;
		
		if(modals.content[ex.videos.current][modal].btn) {
			modals.objects.buttons[modal].visibility = true;
		}
		
		modals.timers[modal+'_onmouseover_animate'] = setInterval(function() {
			if(modals.objects.modals[modal] != undefined && modals.objects.modals[modal].material.alpha < 1) {
				if(modals.content[ex.videos.current][modal].btn) {
					modals.objects.buttons[modal].material.alpha += .05;
				}
				modals.objects.modals[modal].material.alpha += .05;
			} else {
				clearInterval(modals.timers[modal+'_onmouseover_animate']);
			}
		},30,modal);
	},

	fadeOut : function(modal) {
		console.log('modals.fadeOut('+modal+')');
		//fade out
		clearInterval(modals.timers[modal+'_onmouseover_animate']);
		clearInterval(modals.timers[modal+'_onmouseover_animate_out']);
		// if(hard) {
		// 	console.log('hard fade out on '+modal)
		// 	modals.objects.modals[modal].material.alpha = 0;
		// 	modals.objects.buttons[modal].material.alpha = 0;

		// } else {
		if(typeof modals.content[ex.videos.current][modal].doMouseOuts == 'undefined' || modals.content[ex.videos.current][modal].doMouseOuts) {
			modals.timers[modal+'_onmouseover_animate_out'] = setInterval(function() {
				if(modals.objects.modals[modal] != undefined && modals.objects.modals[modal].material.alpha > 0) {
					if(modals.content[ex.videos.current][modal].btn) {
						modals.objects.buttons[modal].material.alpha -= .05;
					}
					modals.objects.modals[modal].material.alpha -= .05;
				} else if(modals.objects.modals[modal] != undefined && !modals.objects.modals[modal].isDisposed) {
					modals.objects.modals[modal].visibility = false;
					if(modals.content[ex.videos.current][modal].btn) {
						modals.objects.buttons[modal].visibility = false;
					}
					clearInterval(modals.timers[modal+'_onmouseover_animate_out']);
				}
			},30,modal);
		} else {
			console.log('fade out overridden');
		}
		//}
	},

	close : function(modal) {
		console.log('ex.close('+modal+')')
		modals.data[modal+'_pivot'] = modals.content[ex.videos.current][modal].position.z;

		console.log('modals.clearTimers() - 1');
		modals.clearTimers(modal,true);

   	 	//create a timer to bring the modal into view
  		clearInterval(modals.timers[modal+'close']);
		modals.timers[modal+'close'] = setInterval(function () {

			//zoom back

			//modals.objects.modals[modal].position.z += .1;
			modals.data[modal+'_pivot'] += .1;
   	 		modals.objects.modals[modal].setPivotMatrix(BABYLON.Matrix.Translation(0, ex.playerheight, modals.data[modal+'_pivot']));

			//fade out
			modals.objects.modals[modal].material.alpha -= .1;
			modals.objects.buttons[modal].material.alpha -= .1;
			
			//kill interval
			if(modals.objects.modals[modal].material.alpha <= 0) {

				console.log('modals.clearTimers() - 2');
				modals.clearTimers(modal,true);
				modals.objects.modals[modal].dispose();
				modals.objects.buttons[modal].dispose();
				delete modals.objects.buttons[modal];
				delete modals.objects.modals[modal];
				clearInterval(modals.timers[modal+'close']);
			}

		}, 33, modal);
	},

	clearTimers : function(modal) {
		clearInterval(modals.timers[modal]);
		clearInterval(modals.timers[modal+'_animate_rot']);
		clearInterval(modals.timers[modal+'_animate_z']);
		clearInterval(modals.timers[modal+'_animate_alpha']);
		clearInterval(modals.timers[modal+"_button_over"]);
		clearInterval(modals.timers[modal+"_onmouseover_animate_out"]);
	},
	
	show : function(modal) {
		var emmsiveColor = .75;
		var scale = 1;
		if(u.d.w < 800) {
			scale = 1.5;
		}

		//--------CONTENT
		modals.objects.modals[modal] = BABYLON.MeshBuilder.CreatePlane(
			"modal_"+modal, {
				width: 		modals.content[ex.videos.current][modal].size.width*scale,
				height: 	modals.content[ex.videos.current][modal].size.height*scale,
				updatable: 	true
			}, ex.scene
		);

		//animate rotation
		if(typeof modals.content[ex.videos.current][modal].position.rotate == 'number') {
			modals.objects.modals[modal].rotation.y = modals.content[ex.videos.current][modal].position.rotate;
		} else {
			modals.objects.modals[modal].rotation.y = modals.content[ex.videos.current][modal].position.rotate.start;
		}

		modals.objects.modals[modal].rotation.x = modals.content[ex.videos.current][modal].position.y;

		//animate z position
		if(typeof modals.content[ex.videos.current][modal].position.z == 'number') {
   	 		modals.objects.modals[modal].setPivotMatrix(BABYLON.Matrix.Translation(0, ex.playerheight, modals.content[ex.videos.current][modal].position.z));
   	 	} else {
   	 		modals.objects.modals[modal].setPivotMatrix(BABYLON.Matrix.Translation(0, ex.playerheight, modals.content[ex.videos.current][modal].position.z.start));
   	 	}

		//create content as texture
	    var content = new BABYLON.StandardMaterial("texturePlane1", ex.scene);
	    if(typeof modals.content[ex.videos.current][modal].img == 'object') {
	  		content.diffuseTexture = new BABYLON.Texture(modals.content[ex.videos.current][modal].img[ex.activeCamera], ex.scene);
	    } else {
	    	content.diffuseTexture = new BABYLON.Texture(modals.content[ex.videos.current][modal].img, ex.scene);
	    }
	    content.diffuseTexture.hasAlpha = true;
	    content.useAlphaFromDiffuseTexture = true;
	    content.backFaceCulling = true;
	    //give it an emissive colour or will look dank as f
		content.emissiveColor = new BABYLON.Color3(emmsiveColor,emmsiveColor,emmsiveColor);
		//apply
   	 	modals.objects.modals[modal].material = content;


   	 	if(modals.content[ex.videos.current][modal].attachtocamera == true && ex.activeCamera == 'desktop') {
   	 		modals.objects.modals[modal].rotation.y = 0;
   	 		modals.objects.modals[modal].rotation.x = 0;
			modals.objects.modals[modal].parent = ex.scene.activeCamera;
   	 	} /* else if(modals.content[ex.videos.current][modal].attachtocamera == true) {
			modals.objects.modals[modal].rotation.y = ex.scene.activeCamera.rotation.y;
			modals.objects.modals[modal].rotation.x = ex.scene.activeCamera.rotation.x;
   	 	} */

		modals.objects.modals[modal].actionManager = new BABYLON.ActionManager(ex.scene);
		modals.objects.modals[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function () {
			clearTimeout(modals.timers[modal+"_autoout"]);
			modals.timers[modal+"_autoout"] = setTimeout(function(modal) {
				modals.fadeOut(modal);
			},1000,modal);
		}));
		modals.objects.modals[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function () {
			clearTimeout(modals.timers[modal+"_autoout"]);
		}));

		//modals.objects.modals[modal].computeWorldMatrix(true);

   	 	//--------BUTTON
   	 	if(modals.content[ex.videos.current][modal].btn) {
	   	 	var width = (modals.content[ex.videos.current][modal].size.width*scale) * .4;
			modals.objects.buttons[modal] = BABYLON.MeshBuilder.CreatePlane(
				"button_"+modal, {
					width:  width,
					height: (width/4),
					updatable:true
				}, ex.scene
			);
			//set the parent to the modal
			modals.objects.buttons[modal].parent = modals.objects.modals[modal];
			//position
			modals.objects.buttons[modal].position.y = -((modals.content[ex.videos.current][modal].size.height*scale)/2);
			modals.objects.buttons[modal].position.z = -.4;
	   	 	//add the button
		    var button = new BABYLON.StandardMaterial("texturePlane2", ex.scene);
		    button.diffuseTexture = new BABYLON.Texture(modals.content[ex.videos.current][modal].btn, ex.scene);
		    button.diffuseTexture.hasAlpha = true;
		    button.useAlphaFromDiffuseTexture = true;
		    button.backFaceCulling = true;
		    //give it an emissive colour or will look dank as f
			button.emissiveColor = new BABYLON.Color3(emmsiveColor,emmsiveColor,emmsiveColor);
			//apply
	   	 	modals.objects.buttons[modal].material = button;
	   	 	//click action
			modals.objects.buttons[modal].actionManager = new BABYLON.ActionManager(ex.scene);
			modals.objects.buttons[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
				clearTimeout(modals.timers[modal+"_autoout"]);
				modals.content[ex.videos.current][modal].onclick();
			}));

			modals.objects.buttons[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function () {
				clearTimeout(modals.timers[modal+"_autoout"]);
				clearInterval(modals.timers[modal+"_button_over"]);
				modals.timers[modal+"_button_over"] = setInterval(function(modal) {
					modals.objects.buttons[modal].position.z -= .05
					if(modals.objects.buttons[modal].position.z <= -.8) {
						modals.objects.buttons[modal].position.z = -.8;
						clearInterval(modals.timers[modal+"_button_over"]);
					}
				}, 33, modal);
			}));

			modals.objects.buttons[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function () {
				clearInterval(modals.timers[modal+"_button_over"]);
				modals.timers[modal+"_button_over"] = setInterval(function(modal) {
					modals.objects.buttons[modal].position.z += .1
					if(modals.objects.buttons[modal].position.z >= -.4) {
						modals.objects.buttons[modal].position.z = -.4;
						clearInterval(modals.timers[modal+"_button_over"]);
					}
				}, 33, modal);

				clearTimeout(modals.timers[modal+"_autoout"]);
				modals.timers[modal+"_autoout"] = setTimeout(function(modal) {
					modals.fadeOut(modal);
				},1000,modal);
			}));

			//modals.objects.buttons[modal].computeWorldMatrix(true);
		}

		if(modals.content[ex.videos.current][modal].hasPin) {
			if(modals.content[ex.videos.current][modal].btn) {
				modals.objects.buttons[modal].material.alpha = 0;
				modals.objects.buttons[modal].visibility = false;
			}

			modals.objects.modals[modal].material.alpha = 0;
			modals.objects.modals[modal].visibility = false;

			//-------PIN
			modals.objects.pins[modal] = BABYLON.MeshBuilder.CreatePlane(
				"pin_"+modal, {
					width:  (modals.content[ex.videos.current][modal].size.width*scale)*.12,
					height: (modals.content[ex.videos.current][modal].size.width*scale)*.12,
					updatable:true
				}, ex.scene
			);
			//set the parent to the modal
			modals.objects.pins[modal].parent = modals.objects.modals[modal];
			//position
			modals.objects.pins[modal].position.y = -( (modals.content[ex.videos.current][modal].size.height*scale) * 1 );
			modals.objects.pins[modal].position.z = .1;
	   	 	//add the button
		    var pin = new BABYLON.StandardMaterial("texturePlane2", ex.scene);
		    pin.diffuseTexture = new BABYLON.Texture(modals.content[ex.videos.current][modal].hasPin, ex.scene);
		    pin.diffuseTexture.hasAlpha = true;
		    pin.useAlphaFromDiffuseTexture = true;
		    pin.backFaceCulling = true;
		    //give it an emissive colour or will look dank as f
			pin.emissiveColor = new BABYLON.Color3(emmsiveColor,emmsiveColor,emmsiveColor);
			//apply
	   	 	modals.objects.pins[modal].material = pin;
	   	 	//click action
			modals.objects.pins[modal].actionManager = new BABYLON.ActionManager(ex.scene);

			modals.objects.pins[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
				clearTimeout(modals.timers[modal+"_autoout"]);
				if(typeof modals.content[ex.videos.current][modal].onclick == "function" ) {
					modals.content[ex.videos.current][modal].onclick();
				}
			}));

			modals.objects.pins[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function() {
				clearTimeout(modals.timers[modal+"_autoout"]);
				modals.content[ex.videos.current][modal].onmouseover();
			}));

			modals.objects.pins[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function() {
				clearTimeout(modals.timers[modal+"_autoout"]);
				modals.timers[modal+"_autoout"] = setTimeout(function(modal) {
					modals.fadeOut(modal);
				},1000,modal);	
			}));

			//modals.objects.pins[modal].computeWorldMatrix(true);
		}



   	 	//-------ANIMATE
   	 	//create a timer to bring the modal into view
  		clearInterval(modals.timers[modal+'_animate_rot']);
  		if(typeof modals.content[ex.videos.current][modal].position.rotate == 'object') {
			modals.timers[modal+'_animate_rot'] = setInterval(function(modal) {
				modals.objects.modals[modal].rotation.y *= .975;
				if(modals.objects.modals[modal].rotation.y <= (modals.content[ex.videos.current][modal].position.rotate.end + .005)) {
					clearInterval(modals.timers[modal+'_animate_rot']);
					modals.objects.modals[modal].rotation.y = modals.content[ex.videos.current][modal].position.rotate.end;
				}
			}, 33, modal);
		}

  		clearInterval(modals.timers[modal+'_animate_z']);
  		clearInterval(modals.timers[modal+'_animate_alpha']);
  		ex.objects[modal+'_animate_z_curr'] = modals.content[ex.videos.current][modal].position.z.start;
  		if(typeof modals.content[ex.videos.current][modal].position.z == 'object') {
			modals.timers[modal+'_animate_z'] = setInterval(function(modal) {
				ex.objects[modal+'_animate_z_curr'] -= .1;
				modals.objects.modals[modal].setPivotMatrix(BABYLON.Matrix.Translation(0, ex.playerheight, ex.objects[modal+'_animate_z_curr'])); 
				if(ex.objects[modal+'_animate_z_curr'] <= modals.content[ex.videos.current][modal].position.z.end) {
					clearInterval(modals.timers[modal+'_animate_z']);
				}
			}, 33, modal);

			modals.objects.modals[modal].material.alpha = 0;
			modals.timers[modal+'_animate_alpha'] = setInterval(function(modal) {
				modals.objects.modals[modal].material.alpha += .05;
				if(modals.objects.modals[modal].material.alpha >= 1) {
					clearInterval(modals.timers[modal+'_animate_alpha']);
				}
			}, 33, modal);
		}

	}
}
