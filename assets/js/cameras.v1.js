var camera = window.camera || {}

camera = {

	activeCamera : 'desktop',
	cameras : {},

	setup : function(scene) {

	    //mobile - NON-VR 
	    scene.cameras.mobile = new BABYLON.DeviceOrientationCamera("camera1", new BABYLON.Vector3(0, ex.playerheight, 0), scene);
	    scene.cameras.mobile.fov = 1;

	    //mobile - VR 
	    scene.cameras.vr = new BABYLON.VRDeviceOrientationFreeCamera("camera2", new BABYLON.Vector3(0, ex.playerheight, 0), scene, true);
	    scene.cameras.vr.fov = 1;

	    //desktop
	    scene.cameras.desktop = new BABYLON.FreeCamera("camera_desktop", new BABYLON.Vector3(0, ex.playerheight, 0), scene);
		//cameras.camera.desktop.inputs.attached.keyboard.attachControl();
	    scene.camera.desktop.fov = 1.5;

	    if(u.camera == 'vr') {
	   		scene.activeCamera = scene.camera.vr;
	   		ex.activeCamera = 'vr';

	    } else if(u.camera == 'mobile') {
	   		scene.activeCamera = scene.camera.mobile;
	   		ex.activeCamera = 'mobile';

	    } else {
	   		scene.activeCamera = scene.camera.desktop;
	   		ex.activeCamera = 'desktop';
	    }

	    return scene;
	}

};