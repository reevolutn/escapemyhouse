
//
//	CODED BY FCBNZ - ANDREW JACKSON
//
//	(╯°□°）╯︵ ┻━┻
//

var mtimeout = 4000;

modals.content.lounge = {

	init : function() {
		modals.show('intro');
		clearTimeout(ex.timers.intro_close);
		ex.timers.intro_close = setTimeout(function() {
			modals.content.lounge.intro.onclick();
		}, 6000);
	},

	intro : {
		img : {
			desktop : '/assets/img/modals/v4/_0000_desktop.png',
			mobile : '/assets/img/modals/v4/_0002_mobile.png',
			vr : '/assets/img/modals/v4/_0001_vr.png'
		},
		btn : false, //'/assets/img/buttons/_0002_btn-gotit.png',
		onclick : function() {
			modals.close('intro');
			modals.show('gaming');
			modals.show('heater');
			modals.show('next_room');
			modals.show('exit_window');
			modals.show('couch');
			modals.show('album');
		},
		onmouseover : function() {
			modals.fadeIn('intro');
		},
		onmouseout : function() {

		},
		size : { 
			width:  10,
			height: 5
		},
		position : { 
			rotate: { 
				start: 1.57, 
				end: 0
			},
			y : 0,
			z : 10
		},
		attachtocamera : true,
		hasPin : false,
		doMouseOuts : false
	},

	gaming : {
		img : '/assets/img/modals/v4/_0002_modal-gaming-over.png',
		btn : false, //'/assets/img/buttons/_0003_btn-pickup.png',
		onclick : function() {
			modals.close('gaming');
			modals.show('game_clicked');
			if(ex.pointer) {
				ex.pointer.visibility = false;
			}
			clearTimeout(ex.timers.gaming_close);
			ex.timers.gaming_close = setTimeout(function() {
				modals.content.lounge.game_clicked.onclick();
			}, mtimeout);
		},
		onmouseover : function() {
			modals.fadeIn('gaming');
		},
		onmouseout : function() {

		},
		size : { 
			width:  6, 
			height: 2 
		},
		position : { 
			rotate: -.11,
			y : .3,
			z : 12
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/v2/_0002_controller.png'
	},

	game_clicked : {
		img : '/assets/img/modals/v4/_0003_modal-gaming-click.png',
		btn : false, //'/assets/img/buttons/_0002_btn-gotit.png',
		onclick : function() {
			modals.close('game_clicked');
			modals.show('gaming');
			if(ex.pointer) {
				ex.pointer.visibility = true;
			}
		},
		onmouseover : function() {
		},
		onmouseout : function() {
		},
		size : { 
			width:  9, 
			height: 3 
		},
		position : { 
			rotate: -.14,
			y : 0,
			z : {
				start : 12,
				end : 10
			}
		},
		attachtocamera : true,
		hasPin : false,
		doMouseOuts : false
	},

	heater : {
		img : '/assets/img/modals/v4/_0000_modal-heater-over.png',
		btn : false,
		onclick : false,
		onmouseover : function() {
			modals.fadeIn('heater');
		},
		onmouseout : function() {
		},
		size : { 
			width:  6, 
			height: 2 
		},
		position : { 
			rotate: -.6,
			y : .1,
			z : 12
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/v2/_0006_fire.png'
	},

	next_room : {
		img : '/assets/img/modals/v4/_0005_modal-nextroom-over.png',
		btn : false, //'/assets/img/buttons/_0001_btn-exit-room.png',
		onclick : function() {
			timer.videoStart = ex.objects.sphereVideo.video.currentTime; 
			ex.destroy();
			ex.videos.current = 'hallway';
			u.setVideoBandwidth();
			ex.create();
		},
		onmouseover : function() {
			modals.fadeIn('next_room');
		},
		onmouseout : function() {
		},
		size : { 
			width:  6, 
			height: 2 
		},
		position : { 
			rotate: 1.8,
			y : -.2,
			z : 12
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/v2/_0001_exit.png'
	},

	couch : {
		img : '/assets/img/modals/v4/_0001_modal-loungechair-over.png',
		btn : false,
		onclick : false,
		onmouseover : function() {
			modals.fadeIn('couch');
		},
		onmouseout : function() {
		},
		size : { 
			width:  6, 
			height: 2 
		},
		position : { 
			rotate: 2.8,
			y : .1,
			z : 10
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/v2/_0003_couch.png'
	},

	album : {
		img : '/assets/img/modals/v4/_0016_modal-photoalbum.png',
		btn : false, //'/assets/img/buttons/_0003_btn-pickup.png',
		onclick : function() {
			modals.close('album');
			modals.show('alb_clicked');
			if(ex.pointer) {
				ex.pointer.visibility = false;
			}

			clearTimeout(ex.timers.album_close);
			ex.timers.album_close = setTimeout(function() {
				modals.content.lounge.alb_clicked.onclick();
			}, mtimeout);
		},
		onmouseover : function() {
			modals.fadeIn('album');
		},
		onmouseout : function() {
		},
		size : { 
			width:  6, 
			height: 2 
		},
		position : { 
			rotate: 3.7,
			y : .1,
			z : 12
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/v2/_0000_album.png'
	},

	alb_clicked : {
		img : '/assets/img/modals/v4/_0017_modal-photoalbum-over.png',
		btn : false, //'/assets/img/buttons/_0002_btn-gotit.png',
		onclick : function() {
			modals.close('alb_clicked');
			modals.show('album');
			if(ex.pointer) {
				ex.pointer.visibility = true;
			}
		},
		onmouseover : function() {
		},
		onmouseout : function() {
		},
		size : { 
			width:  9, 
			height: 3 
		},
		position : { 
			rotate: 3.7,
			y : 0,
			z : {
				start : 12,
				end : 10
			}
		},
		attachtocamera : true,
		hasPin : false,
		doMouseOuts : false
	},

	exit_window : {
		img : '/assets/img/modals/v4/_0004_modal-exit-over.png',
		btn : false, //'/assets/img/buttons/_0000_btn-exit-house.png',
		onclick : function() {
			modals.close('exit_window');
			modals.show('ex_window_clicked');
			if(ex.pointer) {
				ex.pointer.visibility = false;
			}
			clearTimeout(ex.timers.exit_window_close);
			ex.timers.exit_window_close = setTimeout(function() {
				modals.content.lounge.ex_window_clicked.onclick();
			}, mtimeout);
		},
		onmouseover : function() {
			modals.fadeIn('exit_window');
		},
		onmouseout : function() {
		},
		size : { 
			width:  6, 
			height: 2 
		},
		position : { 
			rotate: 4.2,
			y : -.2,
			z : 12
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/v2/_0001_exit.png'
	},

	ex_window_clicked : {
		img : '/assets/img/modals/v4/_0004_modal-exit-over.png',
		btn : false, //'/assets/img/buttons/_0000_btn-exit-house.png',
		onclick : function() {
			modals.close('ex_window_clicked');
			modals.show('exit_window');
			if(ex.pointer) {
				ex.pointer.visibility = true;
			}
		},
		onmouseover : function() {
			modals.fadeIn('exit_window');
		},
		onmouseout : function() {
		},
		size : { 
			width:  9, 
			height: 3 
		},
		position : { 
			rotate: 4.2,
			y : -.2,
			z : {
				start : 12,
				end : 10
			}
		},
		attachtocamera : true,
		hasPin : false,
		doMouseOuts : false
	}
}


modals.content.hallway = {

	init : function() {
		modals.show('lounge');
		modals.show('hallway_fire');
		modals.show('no_exit');
		modals.show('exit_other_window');
		modals.show('bojangles');
		modals.show('tablet');
		modals.show('keys');
		modals.show('locked_door');
		modals.show('exit_door');
	},

	lounge : {
		img : '/assets/img/modals/v4/_0006_modal-loungetemp.png',
		btn : false,
		onclick : false,
		onmouseover : function() {
			modals.fadeIn('lounge');
		},
		onmouseout : function() {
		},
		size : { 
			width:  6, 
			height: 2 
		},
		position : { 
			rotate: -.1,
			y : 0,
			z : 10
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/v2/_0006_fire.png'
	},

	hallway_fire : {
		img : '/assets/img/modals/v4/_0007_modal-hallwayfire.png',
		btn : false,
		onclick : false,
		onmouseover : function() {
			modals.fadeIn('hallway_fire');
		},
		onmouseout : function() {
		},
		size : { 
			width:  6, 
			height: 2 
		},
		position : { 
			rotate: .55,
			y : 0,
			z : 14
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/v2/_0006_fire.png'
	},

	no_exit : {
		img : '/assets/img/modals/v4/_0008_modal-noexithere.png',
		btn : false,
		onclick : false,
		onmouseover : function() {
			modals.fadeIn('no_exit');
		},
		onmouseout : function() {
		},
		size : { 
			width:  6, 
			height: 2 
		},
		position : { 
			rotate: 1,
			y : .1,
			z : 11
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/v2/_0001_exit.png'
	},

	exit_other_window : {
		img : '/assets/img/modals/v4/_0004_modal-exit-over.png',
		btn : false, //'/assets/img/buttons/_0000_btn-exit-house.png',
		onclick : function() {
			ex.destroy();
			ex.videos.current = 'streetview';
			sv.create();
		},
		onmouseover : function() {
			modals.fadeIn('exit_other_window');
		},
		onmouseout : function() {
		},
		size : { 
			width:  6, 
			height: 2 
		},
		position : { 
			rotate: 3.1,
			y : -.15,
			z : 14
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/v2/_0001_exit.png'
	},

	bojangles : {
		img : '/assets/img/modals/v4/_0009_modal-bojangles.png',
		btn : false, //'/assets/img/buttons/_0003_btn-pickup.png',
		onclick : function() {
			modals.close('bojangles');
			modals.show('boj_clicked');
			if(ex.pointer) {
				ex.pointer.visibility = false;
			}
			clearTimeout(ex.timers.bojangles_close);
			ex.timers.bojangles_close = setTimeout(function() {
				modals.content.hallway.boj_clicked.onclick();
			}, mtimeout);
		},
		onmouseover : function() {
			modals.fadeIn('bojangles');
		},
		onmouseout : function() {
		},
		size : { 
			width:  6, 
			height: 2 
		},
		position : { 
			rotate: 3.4,
			y : .15,
			z : 10
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/v2/_0004_bunny.png'
	},

	boj_clicked : {
		img : '/assets/img/modals/v4/_0010_modal-bojangles-over.png',
		btn : false, //'/assets/img/buttons/_0002_btn-gotit.png',
		onclick : function() {
			modals.close('boj_clicked');
			modals.show('bojangles');
			if(ex.pointer) {
				ex.pointer.visibility = true;
			}
		},
		onmouseover : function() {
		},
		onmouseout : function() {
		},
		size : { 
			width:  9, 
			height: 3 
		},
		position : { 
			rotate: 3.4,
			y : .15,
			z : {
				start : 12,
				end : 10
			}
		},
		attachtocamera : true,
		hasPin : false,
		doMouseOuts : false
	},

	tablet : {
		img : '/assets/img/modals/v4/_0014_modal-tablet.png',
		btn : false, //'/assets/img/buttons/_0003_btn-pickup.png',
		onclick : function() {
			modals.close('tablet');
			//modals.show('boj_clicked');
		},
		onmouseover : function() {
			modals.fadeIn('tablet');
		},
		onmouseout : function() {
		},
		size : { 
			width:  6, 
			height: 2 
		},
		position : { 
			rotate: 4.2,
			y : .3,
			z : 8
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/v2/_0004_bunny.png'
	},

	keys : {
		img : '/assets/img/modals/v4/_0013_modal-carkeys.png',
		btn : false, //'/assets/img/buttons/_0003_btn-pickup.png',
		onclick : function() {
			modals.close('keys');
			modals.show('key_clicked');
			if(ex.pointer) {
				ex.pointer.visibility = false;
			}

			clearTimeout(ex.timers.keys_close);
			ex.timers.keys_close = setTimeout(function() {
				modals.content.hallway.key_clicked.onclick();
			}, mtimeout);
		},
		onmouseover : function() {
			modals.fadeIn('keys');
		},
		onmouseout : function() {
		},
		size : { 
			width:  6, 
			height: 2 
		},
		position : { 
			rotate: 4.6,
			y : .25,
			z : 8
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/v2/_0005_keys.png'
	},

	key_clicked : {
		img : '/assets/img/modals/v4/_0015_modal-keys-over.png',
		btn : false, //'/assets/img/buttons/_0002_btn-gotit.png',
		onclick : function() {
			modals.close('key_clicked');
			modals.show('keys');
			if(ex.pointer) {
				ex.pointer.visibility = true;
			}
		},
		onmouseover : function() {
		},
		onmouseout : function() {
		},
		size : { 
			width:  9, 
			height: 3 
		},
		position : { 
			rotate: 4.6,
			y : .25,
			z : {
				start : 12,
				end : 10
			}
		},
		attachtocamera : true,
		hasPin : false,
		doMouseOuts : false
	},

	locked_door : {
		img : '/assets/img/modals/v4/_0011_modal-lockeddoor.png',
		btn : false,
		onclick : function() {
			modals.close('locked_door');
			//modals.show('boj_clicked');
		},
		onmouseover : function() {
			modals.fadeIn('locked_door');
		},
		onmouseout : function() {
		},
		size : { 
			width:  6, 
			height: 2 
		},
		position : { 
			rotate: 4.92,
			y : -.1,
			z : 12
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/v2/_0001_exit.png'
	},

	exit_door : {
		img : '/assets/img/modals/v4/_0012_modal-exithouse.png',
		btn : false, //'/assets/img/buttons/_0000_btn-exit-house.png',
		onclick : function() {
			modals.close('exit_door');
			modals.show('door_clicked');
			if(ex.pointer) {
				ex.pointer.visibility = false;
			}

			clearTimeout(ex.timers.exit_door_close);
			ex.timers.exit_door_close = setTimeout(function() {
				modals.content.hallway.door_clicked.onclick();
			}, mtimeout);
		},
		onmouseover : function() {
			modals.fadeIn('exit_door');
		},
		onmouseout : function() {
		},
		size : { 
			width:  6, 
			height: 2 
		},
		position : { 
			rotate: 5.25,
			y : -.1,
			z : 14
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/v2/_0001_exit.png'
	},

	door_clicked : {
		img : '/assets/img/modals/v4/_0015_modal-keys-over.png',
		btn : false, //'/assets/img/buttons/_0002_btn-gotit.png',
		onclick : function() {
			modals.close('door_clicked');
			modals.show('exit_door');
			if(ex.pointer) {
				ex.pointer.visibility = true;
			}
		},
		onmouseover : function() {
		},
		onmouseout : function() {
		},
		size : { 
			width:  9, 
			height: 3 
		},
		position : { 
			rotate: 5.25,
			y : -.1,
			z : {
				start : 12,
				end : 10
			}
		},
		attachtocamera : true,
		hasPin : false,
		doMouseOuts : false
	}
	
}






modals.content.streetview = {

	init : function() {
		clearTimeout(ex.timers.next_steps);
		ex.timers.next_steps = setTimeout(function() {
			modals.show('next_steps');
		}, 6000);
	},

	next_steps : {
		img : '/assets/img/modals/v4/_0003_endscreen.png',
		btn : [
			'/assets/img/buttons/_0002_btn-gotit.png',
			'/assets/img/buttons/_0002_btn-gotit.png',
			'/assets/img/buttons/_0002_btn-gotit.png'
		],
		onclick : function() {
			modals.close('intro');
			modals.show('gaming');
			modals.show('heater');
			modals.show('next_room');
			modals.show('exit_window');
			modals.show('couch');
			modals.show('album');
		},
		onmouseover : function() {
			modals.fadeIn('intro');
		},
		onmouseout : function() {

		},
		size : { 
			width:  10,
			height: 5
		},
		position : { 
			rotate: 0,
			y : 0,
			z : 10
		},
		attachtocamera : false,
		hasPin : false,
		doMouseOuts : false
	}
}