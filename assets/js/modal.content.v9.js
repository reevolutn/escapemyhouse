
//
//	DESIGNED/CODED BY FCBNZ - ANDREW JACKSON
//
//	(╯°□°）╯︵ ┻━┻
//

var mtimeout = 4000;



modals.content.lounge = {

	init : function() {
		modals.place('intro_lnge');
		modals.timers.intro_lnge = setTimeout(function() {
			modals.fadeInPanel('intro_lnge');
		}, 500);
		modals.timers.init = setTimeout(function() {	
			modals.fadeOutPanel('intro_lnge');
			modals.place('gaming_up');
			modals.place('gaming_click');
			modals.place('heater_up');
			modals.place('heater_click');
			modals.place('nextroom_up');
			modals.place('couch_up');
			modals.place('couch_click');
			modals.place('album_up');
			modals.place('album_click');
			modals.place('exitwindow_up');
			modals.place('exitwindow_click');
			modals.timers.remove_intro = setTimeout(function() {
				modals.remove('intro_lnge');
				timer.place();
				//create virtual pointer
				if(ex.usePointer[ex.activeCamera]) {
					ex.virtualPointer(ex.scene);
				}
			}, 1000);
		}, 8000);
	},

	intro_lnge : {
		img : {
			desktop : u.imageBase+'modals/v4/_0000_desktop.png',
			mobile 	: u.imageBase+'modals/v4/_0002_mobile.png',
			vr		: u.imageBase+'modals/v4/_0001_vr.png'
		},
		btn : false, 
		onclick : function() {},
		onmouseover : function() {},
		onmouseout : function() {},
		size : { 
			width:  10,
			height: 5
		},
		position : { 
			rotate: 0,
			y : 0,
			z : 10
		},
		alpha : 0,
		attachtocamera : true,
		hasPin : false,
		doMouseOuts : true
	},

	gaming_up : {
		img : u.imageBase+'modals/v4/_0002_modal-gaming-over.png',
		onclick : function() {
			modals.fadeOutPanel('gaming_up');
			modals.fadeInPanel('gaming_click');
		},
		onmouseover : function() {
			modals.fadeInPanel('gaming_up');
		},
		onmouseout : function() {
			modals.fadeOutPanel('gaming_click');
			modals.fadeOutPanel('gaming_up');
		},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: -.11,
			y : .3,
			z : 12
		},
		attachtocamera :false,
		hasPin : u.imageBase+'pins/v2/_0002_controller.png'
	},

	gaming_click : {
		img : u.imageBase+'modals/v4/_0003_modal-gaming-click.png',
		onclick : function() {},
		onmouseover : function() {},
		onmouseout : function() {},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: -.11,
			y : .3,
			z : 12
		},
		alpha : 0,
		attachtocamera :false,
		hasPin : false
	},

	heater_up : {
		img : u.imageBase+'modals/v4/_0000_modal-heater-over.png',
		onclick : function() {
			modals.fadeOutPanel('heater_up');
			modals.fadeInPanel('heater_click');
		},
		onmouseover : function() {
			modals.fadeInPanel('heater_up');
		},
		onmouseout : function() {
			modals.fadeOutPanel('heater_up');
			modals.fadeOutPanel('heater_click');
		},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: -.6,
			y : .1,
			z : 12
		},
		attachtocamera :false,
		hasPin : u.imageBase+'pins/v2/_0006_fire.png'
	},

	heater_click : {
		img : u.imageBase+'modals/v4/_0020_modal-heater-click.png',
		onclick : false,
		onmouseover : function() {},
		onmouseout : function() {},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: -.6,
			y : .1,
			z : 12
		},
		alpha : 0,
		attachtocamera :false,
		hasPin : false
	},

	nextroom_up : {
		img : u.imageBase+'modals/v4/_0006_modal-nextroom-over.png',
		onclick : function() {
			timer.videoStart = ex.objects.sphereVideo.video.currentTime; 
			ex.destroy();
			ex.videos.current = 'hallway';
			u.setVideoBandwidth();
			ex.create();
		},
		onmouseover : function() {
			modals.fadeInPanel('nextroom_up');
		},
		onmouseout : function() {
			modals.fadeOutPanel('nextroom_up');
		},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: 1.8,
			y : -.2,
			z : 12
		},
		attachtocamera :false,
		hasPin : u.imageBase+'pins/v2/_0001_exit.png'
	},

	couch_up : {
		img : u.imageBase+'modals/v4/_0001_modal-loungechair-over.png',
		btn : false,
		onclick : function() {
			modals.fadeOutPanel('couch_up');
			modals.fadeInPanel('couch_click');
		},
		onmouseover : function() {
			modals.fadeInPanel('couch_up');
		},
		onmouseout : function() {
			modals.fadeOutPanel('couch_up');
			modals.fadeOutPanel('couch_click');
		},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: 2.8,
			y : .1,
			z : 10
		},
		attachtocamera :false,
		hasPin : u.imageBase+'pins/v2/_0003_couch.png'
	},

	couch_click : {
		img : u.imageBase+'modals/v4/_0021_modal-loungechair-click.png',
		btn : false,
		onclick : false,
		onmouseover : function() {},
		onmouseout : function() {},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: 2.8,
			y : .1,
			z : 10
		},
		alpha : 0,
		attachtocamera :false,
		hasPin : false
	},

	album_up : {
		img : u.imageBase+'modals/v4/_0016_modal-photoalbum.png',
		btn : false,
		onclick : function() {
			modals.fadeOutPanel('album_up');
			modals.fadeInPanel('album_click');
		},
		onmouseover : function() {
			modals.fadeInPanel('album_up');
		},
		onmouseout : function() {
			modals.fadeOutPanel('album_click');
			modals.fadeOutPanel('album_up');
		},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: 3.7,
			y : .1,
			z : 12
		},
		attachtocamera :false,
		hasPin : u.imageBase+'pins/v2/_0000_album.png'
	},

	album_click : {
		img : u.imageBase+'modals/v4/_0017_modal-photoalbum-over.png',
		btn : false,
		onclick : false,
		onmouseover : function() {},
		onmouseout : function() {},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: 3.7,
			y : .1,
			z : 12
		},
		alpha : 0,
		attachtocamera :false,
		hasPin : false
	},

	exitwindow_up : {
		img : u.imageBase+'modals/v4/_0004_modal-loungwindowexit-over.png',
		btn : false, 
		onclick : function() {
			modals.fadeOutPanel('exitwindow_up');
			modals.fadeInPanel('exitwindow_click');
		},
		onmouseover : function() {
			modals.fadeInPanel('exitwindow_up');
		},
		onmouseout : function() {
			modals.fadeOutPanel('exitwindow_click');
			modals.fadeOutPanel('exitwindow_up');
		},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: 4.2,
			y : -.2,
			z : 12
		},
		attachtocamera :false,
		hasPin : u.imageBase+'pins/v2/_0001_exit.png'
	},

	exitwindow_click : {
		img : u.imageBase+'modals/v4/_0005_modal-loungwindowexit-click.png',
		btn : false, 
		onclick : false,
		onmouseover : function() {},
		onmouseout : function() {},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: 4.2,
			y : -.2,
			z : 12
		},
		alpha : 0,
		attachtocamera :false,
		hasPin : false
	}
}









modals.content.hallway = {
	init : function() {
		modals.place('lounge_up');
		modals.place('lounge_click');
		modals.place('hallway_up');
		modals.place('hallway_click');
		modals.place('windowexit_up');
		modals.place('bunny_up');
		modals.place('bunny_click');
		modals.place('keys_up');
		modals.place('keys_click');
		modals.place('frontdoor_up');
		modals.place('frontdoor_click');
		modals.place('lockeddoor_up');	
		modals.place('lockeddoor_click');	
		timer.place();
		//create virtual pointer
		if(ex.usePointer[ex.activeCamera]) {
			ex.virtualPointer(ex.scene);
		}
	},

	lounge_up : {
		img : u.imageBase+'modals/v4/_0007_modal-lounge-over.png',
		btn : false,
		onclick : function() {
			modals.fadeOutPanel('lounge_up');
			modals.fadeInPanel('lounge_click');
		},
		onmouseover : function() {
			modals.fadeInPanel('lounge_up');
		},
		onmouseout : function() {
			modals.fadeOutPanel('lounge_up');
			modals.fadeOutPanel('lounge_click');
		},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: -.1,
			y : 0,
			z : 10
		},
		attachtocamera :false,
		hasPin : u.imageBase+'pins/v2/_0006_fire.png'
	},

	lounge_click : {
		img : u.imageBase+'modals/v4/_0022_modal-lounge-click.png',
		btn : false,
		onclick : false,
		onmouseover : function() {},
		onmouseout : function() {},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: -.1,
			y : 0,
			z : 10
		},
		alpha : 0,
		attachtocamera :false,
		hasPin : false
	},

	hallway_up : {
		img : u.imageBase+'modals/v4/_0008_modal-hallwaycupbord-over.png',
		btn : false,
		onclick : false,
		onclick : function() {
			modals.fadeOutPanel('hallway_up');
			modals.fadeInPanel('hallway_click');
		},
		onmouseover : function() {
			modals.fadeInPanel('hallway_up');
		},
		onmouseout : function() {
			modals.fadeOutPanel('hallway_up');
			modals.fadeOutPanel('hallway_click');
		},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: 1,
			y : .1,
			z : 11
		},
		attachtocamera :false,
		hasPin : u.imageBase+'pins/v2/_0001_exit.png'
	},

	hallway_click : {
		img : u.imageBase+'modals/v4/_0009_modal-hallwaycupbord-click.png',
		btn : false,
		onclick : false,
		onmouseover : function() {},
		onmouseout : function() {},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: 1,
			y : .1,
			z : 11
		},
		alpha : 0,
		attachtocamera :false,
		hasPin : false
	},


	windowexit_up : {
		img : u.imageBase+'modals/v4/_0018_modal-hallwaywindowexit-over.png',
		btn : false,
		onclick : function() {
			ex.destroy();
			ex.videos.current = 'streetview';
			sv.create();
		},
		onmouseover : function() {
			modals.fadeInPanel('windowexit_up');
		},
		onmouseout : function() {},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: 3.1,
			y : -.15,
			z : 14
		},
		attachtocamera :false,
		hasPin : u.imageBase+'pins/v2/_0001_exit.png'
	},

	bunny_up : {
		img : u.imageBase+'modals/v4/_0010_modal-bojangles.png',
		btn : false,
		onclick : function() {
			modals.fadeOutPanel('bunny_up');
			modals.fadeInPanel('bunny_click');
		},
		onmouseover : function() {
			modals.fadeInPanel('bunny_up');
		},
		onmouseout : function() {
			modals.fadeOutPanel('bunny_click');
			modals.fadeOutPanel('bunny_up');
		},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: 3.4,
			y : .15,
			z : 10
		},
		attachtocamera :false,
		hasPin : u.imageBase+'pins/v2/_0004_bunny.png'
	},

	bunny_click : {
		img : u.imageBase+'modals/v4/_0011_modal-bojangles-over.png',
		btn : false,
		onclick : false,
		onmouseover : function() {},
		onmouseout : function() {},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: 3.4,
			y : .15,
			z : 10
		},
		alpha : 0,
		attachtocamera :false,
		hasPin : false
	},

	keys_up : {
		img : u.imageBase+'modals/v4/_0014_modal-carkeys.png',
		btn : false,
		onclick : function() {
			modals.fadeOutPanel('keys_up');
			modals.fadeInPanel('keys_click');
		},
		onmouseover : function() {
			modals.fadeInPanel('keys_up');
		},
		onmouseout : function() {
			modals.fadeOutPanel('keys_click');
			modals.fadeOutPanel('keys_up');
		},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: 4.6,
			y : .25,
			z : 8
		},
		attachtocamera :false,
		hasPin : u.imageBase+'pins/v2/_0005_keys.png'
	},

	keys_click : {
		img : u.imageBase+'modals/v4/_0015_modal-keys-over.png',
		btn : false,
		onclick : false,
		onmouseover : function() {},
		onmouseout : function() {},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: 4.6,
			y : .25,
			z : 8
		},
		alpha : 0,
		attachtocamera :false,
		hasPin : false
	},

	lockeddoor_up : {
		img : u.imageBase+'modals/v4/_0019_modal-lockedoor-over.png',
		btn : false,
		onclick : function() {
			modals.fadeOutPanel('lockeddoor_up');
			modals.fadeInPanel('lockeddoor_click');
		},
		onmouseover : function() {
			modals.fadeInPanel('lockeddoor_up');
		},
		onmouseout : function() {
			modals.fadeOutPanel('lockeddoor_click');
			modals.fadeOutPanel('lockeddoor_up');
		},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: 4.92,
			y : -.1,
			z : 12
		},
		attachtocamera :false,
		hasPin : u.imageBase+'pins/v2/_0001_exit.png'
	},

	lockeddoor_click : {
		img : u.imageBase+'modals/v4/_0023_modal-lockedoor-click.png',
		btn : false,
		onclick : false,
		onmouseover : function() {},
		onmouseout : function() {},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: 4.92,
			y : -.1,
			z : 12
		},
		alpha : 0,
		attachtocamera :false,
		hasPin :false
	},

	frontdoor_up : {
		img : u.imageBase+'modals/v4/_0012_modal-exithouse-over.png',
		btn : false,
		onclick : function() {
			modals.fadeOutPanel('frontdoor_up');
			modals.fadeInPanel('frontdoor_click');
		},
		onmouseover : function() {
			modals.fadeInPanel('frontdoor_up');
		},
		onmouseout : function() {
			modals.fadeOutPanel('frontdoor_click');
			modals.fadeOutPanel('frontdoor_up');
		},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: 5.25,
			y : -.1,
			z : 14
		},
		attachtocamera :false,
		hasPin : u.imageBase+'pins/v2/_0001_exit.png'
	},

	frontdoor_click : {
		img : u.imageBase+'modals/v4/_0013_modal-exithouse-click.png',
		btn : false,
		onclick : false,
		onmouseover : function() {},
		onmouseout : function() {},
		size : { 
			width:  5, 
			height: 2 
		},
		position : { 
			rotate: 5.25,
			y : -.1,
			z : 14
		},
		alpha : 0,
		attachtocamera :false,
		hasPin : false
	}

}

modals.content.streetview = {
	init : function() {
		//create virtual pointer
		if(ex.usePointer[ex.activeCamera] && ex.activeCamera == 'vr') {
			ex.virtualPointer(sv.scene);
		}
	}
}