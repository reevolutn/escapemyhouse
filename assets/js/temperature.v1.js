var temp = window.temp || {};

//
//	CODED BY FCBNZ - ANDREW JACKSON
//
//	(╯°□°）╯︵ ┻━┻
//

temp = {
	gaugeType : false,
	init : function() {
	   	//add temp gauge
	    //ex.gaugeDisplay();
	    //ex.targetDisplay();
	},

	beforeRender : function() {
		if(temp.gaugeType == 'gaugeDisplay') {
			ex.objects.gaugeDisplay.position.y = ex.scene.activeCamera.rotation.x * 6;
		}
	},

	targetDisplay : function() {
		ex.objects.temperatureCrosshair = BABYLON.Mesh.CreatePlane("temperatureCrosshair", 6, ex.scene, false);
		ex.objects.temperatureCrosshair.material = new BABYLON.StandardMaterial("temperatureCrosshair", ex.scene);
	    ex.objects.temperatureCrosshair.material.diffuseTexture = new BABYLON.Texture(u.imageBase+"crosshair.png", ex.scene);

	    ex.objects.temperatureCrosshair.material.diffuseTexture.hasAlpha = true;
	    ex.objects.temperatureCrosshair.material.useAlphaFromDiffuseTexture = true;
	    ex.objects.temperatureCrosshair.material.backFaceCulling = true;

		ex.objects.temperatureCrosshair.position = new BABYLON.Vector3(0, 0, 15);
		ex.objects.temperatureCrosshair.parent = ex.scene.activeCamera;

		ex.objects.temperatureCrosshair.scaling = new BABYLON.Vector3(.25, .25, .25);

		ex.objects.temperatureReadout = BABYLON.Mesh.CreatePlane("temperatureReadout", 6, ex.scene, false);
		ex.objects.temperatureReadout.material = new BABYLON.StandardMaterial("temperatureReadout", ex.scene);
		ex.objects.temperatureReadout.position = new BABYLON.Vector3(0, 0, 15);
		ex.objects.temperatureReadout.parent = ex.scene.activeCamera;

		ex.objects.temperatureReadout.material.diffuseTexture = new BABYLON.DynamicTexture("dynamic texture", 256, ex.scene, true);
		ex.objects.temperatureReadout.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
		ex.objects.temperatureReadout.material.backFaceCulling = false;
	    ex.objects.temperatureReadout.material.diffuseTexture.hasAlpha = true;

		ex.objects.temperatureReadout.scaling = new BABYLON.Vector3(.5, .5, .5);

		ex.objects.temperatureReadout.material.diffuseTexture.drawText("30 degrees", null, 230, "20px Quicksand", "white");
	},

	gaugeDisplay : function() {

		ex.objects.gaugeDisplay = BABYLON.MeshBuilder.CreatePlane(
			"plane", {
				width: 		1,
				height: 	24,
				updatable: 	true
			}, ex.scene
		);

		//ex.objects.gaugeDisplay.position.z = 2;
		//ex.objects.gaugeDisplay.position.x = 1.5;
		if(ex.activeCamera == 'vr') {
			ex.objects.gaugeDisplay.rotation.y = -Math.PI/4;
		} else {
			ex.objects.gaugeDisplay.parent = ex.scene.activeCamera;
		}

		ex.objects.gaugeDisplayMat = new BABYLON.StandardMaterial("texture2", ex.scene);
		//ex.objects.gaugeDisplayMat.diffuseColor = new BABYLON.Color3(0,0,0);

	    ex.objects.gaugeDisplayMat.diffuseTexture = new BABYLON.Texture(u.imageBase+'temp.png', ex.scene);
	    ex.objects.gaugeDisplayMat.diffuseTexture.hasAlpha = true;
	    ex.objects.gaugeDisplayMat.useAlphaFromDiffuseTexture = true;

		ex.objects.gaugeDisplayMat.alpha = 0.5;

	    ex.objects.gaugeDisplayMat.emmsiveColor = new BABYLON.Color3(1, 1, 1);
	    ex.objects.gaugeDisplayMat.ambientColor = new BABYLON.Color3(1, 1, 1);

		ex.objects.gaugeDisplayMat.backFaceCulling = false;
		ex.objects.gaugeDisplay.material = ex.objects.gaugeDisplayMat;


   	 	ex.objects.gaugeDisplay.setPivotMatrix(BABYLON.Matrix.Translation((u.d.w*.0028), 0, 5));

	}

}