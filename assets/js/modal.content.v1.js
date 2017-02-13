
//
//	CODED BY FCBNZ - ANDREW JACKSON
//
//	(╯°□°）╯︵ ┻━┻
//

modals.content.lounge = {

	init : function() {
		modals.show('intro');
	},

	intro : {
		img : {
			desktop : '/assets/img/modals/intro.png',
			mobile : '/assets/img/modals/intro-mobile.png',
			vr : '/assets/img/modals/intro-vr.png'
		},
		btn : '/assets/img/buttons/_0002_btn-gotit.png',
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
		attachtocamera : false,
		hasPin : false,
		doMouseOuts : false
	},

	gaming : {
		img : '/assets/img/modals/_0002_modal-gaming-over.png',
		btn : '/assets/img/buttons/_0003_btn-pickup.png',
		onclick : function() {
			modals.close('gaming');
			modals.show('gaming_clicked');
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
			rotate: -.14,
			y : .2,
			z : 12
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/_0002_controller.png'
	},

	gaming_clicked : {
		img : '/assets/img/modals/_0003_modal-gaming-click.png',
		btn : '/assets/img/buttons/_0002_btn-gotit.png',
		onclick : function() {
			modals.close('gaming_clicked');
			modals.show('gaming');
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
		img : '/assets/img/modals/_0000_modal-heater-over.png',
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
			y : 0,
			z : 12
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/_0006_fire.png'
	},

	next_room : {
		img : '/assets/img/modals/_0005_modal-nextroom-over.png',
		btn : '/assets/img/buttons/_0001_btn-exit-room.png',
		onclick : function() {
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
		hasPin : '/assets/img/pins/_0001_exit.png'
	},

	couch : {
		img : '/assets/img/modals/_0001_modal-loungechair-over.png',
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
			y : 0,
			z : 10
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/_0003_couch.png'
	},

	album : {
		img : '/assets/img/modals/_0016_modal-photoalbum.png',
		btn : '/assets/img/buttons/_0003_btn-pickup.png',
		onclick : function() {
			modals.close('album');
			modals.show('album_clicked');
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
			y : .05,
			z : 12
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/_0000_album.png'
	},

	album_clicked : {
		img : '/assets/img/modals/_0017_modal-photoalbum-over.png',
		btn : '/assets/img/buttons/_0002_btn-gotit.png',
		onclick : function() {
			modals.close('album_clicked');
			modals.show('album');
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
		img : '/assets/img/modals/_0004_modal-exit-over.png',
		btn : '/assets/img/buttons/_0000_btn-exit-house.png',
		onclick : function() {
			ex.destroy();
			sv.create();
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
		hasPin : '/assets/img/pins/_0001_exit.png'
	}
}


modals.content.hallway = {

	init : function() {
		modals.show('lounge');
		modals.show('hallway_fire');
		modals.show('no_exit');
		modals.show('exit_other_window');
		modals.show('bojangles');
		//modals.show('tablet');
		modals.show('keys');
		modals.show('locked_door');
		modals.show('exit_door');
	},

	lounge : {
		img : '/assets/img/modals/_0006_modal-loungetemp.png',
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
		hasPin : '/assets/img/pins/_0006_fire.png'
	},

	hallway_fire : {
		img : '/assets/img/modals/_0007_modal-hallwayfire.png',
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
		hasPin : '/assets/img/pins/_0006_fire.png'
	},

	no_exit : {
		img : '/assets/img/modals/_0008_modal-noexithere.png',
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
		hasPin : '/assets/img/pins/_0001_exit.png'
	},

	exit_other_window : {
		img : '/assets/img/modals/_0004_modal-exit-over.png',
		btn : '/assets/img/buttons/_0000_btn-exit-house.png',
		onclick : function() {
			ex.destroy();
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
		hasPin : '/assets/img/pins/_0001_exit.png'
	},

	bojangles : {
		img : '/assets/img/modals/_0009_modal-bojangles.png',
		btn : '/assets/img/buttons/_0003_btn-pickup.png',
		onclick : function() {
			modals.close('bojangles');
			modals.show('bojangles_clicked');
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
		hasPin : '/assets/img/pins/_0004_bunny.png'
	},

	bojangles_clicked : {
		img : '/assets/img/modals/_0010_modal-bojangles-over.png',
		btn : '/assets/img/buttons/_0002_btn-gotit.png',
		onclick : function() {
			modals.close('bojangles_clicked');
			modals.show('bojangles');
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
		img : '/assets/img/modals/_0014_modal-tablet.png',
		btn : '/assets/img/buttons/_0003_btn-pickup.png',
		onclick : function() {
			modals.close('tablet');
			//modals.show('bojangles_clicked');
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
		hasPin : '/assets/img/pins/_0004_bunny.png'
	},

	keys : {
		img : '/assets/img/modals/_0013_modal-carkeys.png',
		btn : '/assets/img/buttons/_0003_btn-pickup.png',
		onclick : function() {
			modals.close('keys');
			modals.show('keys_clicked');
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
		hasPin : '/assets/img/pins/_0005_keys.png'
	},

	keys_clicked : {
		img : '/assets/img/modals/_0015_modal-keys-over.png',
		btn : '/assets/img/buttons/_0002_btn-gotit.png',
		onclick : function() {
			modals.close('keys_clicked');
			modals.show('keys');
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
		img : '/assets/img/modals/_0011_modal-lockeddoor.png',
		btn : false,
		onclick : function() {
			modals.close('locked_door');
			//modals.show('bojangles_clicked');
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
		hasPin : '/assets/img/pins/_0001_exit.png'
	},

	exit_door : {
		img : '/assets/img/modals/_0012_modal-exithouse.png',
		btn : '/assets/img/buttons/_0000_btn-exit-house.png',
		onclick : function() {
			ex.destroy();
			sv.create();
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
		hasPin : '/assets/img/pins/_0001_exit.png'
	}
	
}