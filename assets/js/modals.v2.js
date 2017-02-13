var modals = window.modals || {};

//
//	CODED BY FCBNZ - ANDREW JACKSON
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

	init : function() {

	},

	fadeIn : function(modal) {
		console.log('modals.fadeIn('+modal+')');
		modals.clearTimers(modal,false);
		if(typeof modals.content[ex.videos.current][modal] == 'undefined' || modals.objects.modals[modal] == 'undefined') {
			console.log('modal doesnt exist anymore');

		} else {
			//make sure modal is set to visible
			modals.objects.modals[modal].visibility = true;
			//if there is a button, also make sure it is visible
			if(modals.content[ex.videos.current][modal].btn) {
				modals.objects.buttons[modal].visibility = true;
			}

			//create the timer that brings the modal into view
			modals.timers[modal+'_onmouseover_animate'] = setInterval(function(modal) {
				if(modals.objects.modals[modal] != undefined && modals.objects.modals[modal].material.alpha < 1) {
					//fade out modal and button
					if(modals.content[ex.videos.current][modal].btn) {
						modals.objects.buttons[modal].material.alpha += .05;
					}
					modals.objects.modals[modal].material.alpha += .05;
				} else {
					//clear the interval
					clearInterval(modals.timers[modal+'_onmouseover_animate']);
				}
			}, 33, modal);
		}
	},

	fadeOut : function(modal) {
		console.log('modals.fadeOut('+modal+')');
		console.log('modals.clearTimers() - 5');
		modals.clearTimers(modal,false);
		//only do fade out if mouseout isnt
		if(typeof modals.content[ex.videos.current][modal] == 'undefined') {
			console.log('modal doesnt exist anymore');

		} else if(typeof modals.content[ex.videos.current][modal].doMouseOuts == 'undefined' || modals.content[ex.videos.current][modal].doMouseOuts) {
			modals.timers[modal+'_onmouseover_animate_out'] = setInterval(function(modal) {
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
			}, 33, modal);

		} else {
			console.log('fade out overridden');

		}
	},

	closeAll : function() {
		for(key in modals.content[ex.videos.current]) {
			if(key != 'init' && typeof modals.objects.modals[key] == 'object') {
				modals.close(key);
			}
		}
	},

	killAll :function() {
		for(key in modals.content[ex.videos.current]) {
			if(key != 'init' && typeof modals.objects.modals[key] == 'object') {
				modals.objects.modals[key].dispose();
				delete modals.objects.modals[key];
				if(modals.content[ex.videos.current][key].btn) {
					modals.objects.buttons[key].dispose();
					delete modals.objects.buttons[key];
				}
			}
		}
	},

	close : function(modal) {
		console.log('ex.close('+modal+')');
		console.log('modals.clearTimers() - 4');
		modals.clearTimers(modal,false);
		//check to see if the z postion is an array (thats if we zoomed in to begin with)
		if(typeof modals.content[ex.videos.current][modal].position.z == 'object') {
			modals.data[modal+'_pivot'] = modals.content[ex.videos.current][modal].position.z.end;
		} else {
			modals.data[modal+'_pivot'] = modals.content[ex.videos.current][modal].position.z;
		}
   	 	//create a timer to bring the modal into view
		modals.timers[modal+'close'] = setInterval(function(modal) {
			//modals.objects.modals[modal].position.z += .1;
			modals.data[modal+'_pivot'] += .1;
   	 		modals.objects.modals[modal].setPivotMatrix(BABYLON.Matrix.Translation(0, ex.playerheight, modals.data[modal+'_pivot']));
			//fade out
			modals.objects.modals[modal].material.alpha -= .1;
			if(modals.content[ex.videos.current][modal].btn) {
				modals.objects.buttons[modal].material.alpha -= .1;
			}
			//kill interval
			if(modals.objects.modals[modal].material.alpha <= 0) {
				console.log('modals.clearTimers() - 6');
				modals.clearTimers(modal,true);
				modals.objects.modals[modal].dispose();
				delete modals.objects.modals[modal];
				if(modals.content[ex.videos.current][modal].btn) {
					modals.objects.buttons[modal].dispose();
					delete modals.objects.buttons[modal];
				}
			}
		}, 33, modal);
		//reset stage color
		ex.fade.to = 1;
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
		//set y position
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
		content.emissiveColor = new BABYLON.Color3(emmsiveColor,emmsiveColor,emmsiveColor);
   	 	modals.objects.modals[modal].material = content;

   	 	//is the modal linked to the camera?
   	 	if(modals.content[ex.videos.current][modal].attachtocamera == true ) { //&& ex.activeCamera == 'desktop'
   	 		modals.objects.modals[modal].rotation.y = 0;
   	 		modals.objects.modals[modal].rotation.x = 0;
			modals.objects.modals[modal].parent = ex.scene.activeCamera;
			//if so, fade out also
			ex.fade.to = .5;

   	 	} /* else if(modals.content[ex.videos.current][modal].attachtocamera == true) {
			modals.objects.modals[modal].rotation.y = ex.scene.activeCamera.rotation.y;
			modals.objects.modals[modal].rotation.x = ex.scene.activeCamera.rotation.x;
   	 	} */

		// modals.objects.modals[modal].actionManager = new BABYLON.ActionManager(ex.scene);
		// modals.objects.modals[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(evt) {
		// 	console.log('--------------');
		// 	console.log(evt);
		// 	var index = evt.source.name.replace("modal_", "");
		// 	clearTimeout(modals.timers[index+"_autoout"]);
		// 	modals.timers[index+"_autoout"] = setTimeout(function(index) {
		// 		modals.fadeOut(index);
		// 	},1000,index);
		// }));
		// modals.objects.modals[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(evt) {
		// 	var index = evt.source.name.replace("modal_", "");
		// 	clearTimeout(modals.timers[index+"_autoout"]);
		// }));

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
			modals.objects.buttons[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, function(evt) {
				var index = evt.source.name.replace("button_", "");
				clearTimeout(modals.timers[index+"_autoout"]);
				if(typeof modals.content[ex.videos.current][index].onclick == "function" ) {
					modals.content[ex.videos.current][index].onclick();
				}
			}));

			modals.objects.buttons[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(evt) {
				var index = evt.source.name.replace("button_", "");
				clearTimeout(modals.timers[index+"_autoout"]);
				clearInterval(modals.timers[index+"_button_over"]);
				modals.timers[index+"_button_over"] = setInterval(function(index) {
					modals.objects.buttons[index].position.z -= .05
					if(modals.objects.buttons[index].position.z <= -.8) {
						modals.objects.buttons[index].position.z = -.8;
						clearInterval(modals.timers[index+"_button_over"]);
					}
				}, 33, index);
			}));

			modals.objects.buttons[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(evt) {
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
					width:  (modals.content[ex.videos.current][modal].size.width*scale)*.17,
					height: (modals.content[ex.videos.current][modal].size.width*scale)*.17,
					updatable:true
				}, ex.scene
			);
			//set the parent to the modal
			modals.objects.pins[modal].parent = modals.objects.modals[modal];
			//position
			modals.objects.pins[modal].position.y = -( (modals.content[ex.videos.current][modal].size.height*scale) * .85 );
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

			modals.objects.pins[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, function(evt) {
				var index = evt.source.name.replace("pin_", "");
				clearTimeout(modals.timers[index+"_autoout"]);
				if(typeof modals.content[ex.videos.current][index].onclick == "function" ) {
					modals.content[ex.videos.current][index].onclick();
				}
			}));

			modals.objects.pins[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(evt) {
				var index = evt.source.name.replace("pin_", "");
				clearTimeout(modals.timers[index+"_autoout"]);
				modals.content[ex.videos.current][index].onmouseover();
			}));

			modals.objects.pins[modal].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(evt) {
				var index = evt.source.name.replace("pin_", "");
				clearTimeout(modals.timers[index+"_autoout"]);
				modals.timers[index+"_autoout"] = setTimeout(function(index) {
					modals.fadeOut(index);
				}, 1000, index);	
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
