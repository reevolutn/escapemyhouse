modals.content.lounge = {

	intro : {
		img : {
			desktop : '/assets/img/modals/intro.png',
			mobile : '/assets/img/modals/intro.png',
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
		hasPin : '/assets/img/pins/gaming.png'
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
		attachtocamera : 'onspawnonly',
		hasPin : false,
		doMouseOuts : false
	},

	heater : {
		img : '/assets/img/modals/_0000_modal-heater-over.png',
		btn : false,
		onclick : function() {
		},
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
		hasPin : '/assets/img/pins/fire.png'
	},

	next_room : {
		img : '/assets/img/modals/_0005_modal-nextroom-over.png',
		btn : '/assets/img/buttons/_0001_btn-exit-room.png',
		onclick : function() {
			ex.destroy();
			ex.videos.current = 'hallway';
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
		hasPin : '/assets/img/pins/exit.png'
	},

	couch : {
		img : '/assets/img/modals/_0001_modal-loungechair-over.png',
		btn : false,
		onclick : function() {
		},
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
		hasPin : '/assets/img/pins/couch.png'
	},

	exit_window : {
		img : '/assets/img/modals/_0004_modal-exit-over.png',
		btn : '/assets/img/buttons/_0000_btn-exit-house.png',
		onclick : function() {
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
		hasPin : '/assets/img/pins/exit.png'
	}
}


modals.content.hallway = {

	lounge : {
		img : '/assets/img/modals/_0006_modal-loungetemp.png',
		btn : false,
		onclick : function() {
		},
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
		hasPin : '/assets/img/pins/fire.png'
	},

	hallway_fire : {
		img : '/assets/img/modals/_0007_modal-hallwayfire.png',
		btn : false,
		onclick : function() {
		},
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
		hasPin : '/assets/img/pins/fire.png'
	},

	no_exit : {
		img : '/assets/img/modals/_0008_modal-noexithere.png',
		btn : false,
		onclick : function() {
		},
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
		hasPin : '/assets/img/pins/exit.png'
	},

	exit_other_window : {
		img : '/assets/img/modals/_0004_modal-exit-over.png',
		btn : '/assets/img/buttons/_0000_btn-exit-house.png',
		onclick : function() {
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
			y : -.1,
			z : 14
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/exit.png'
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
			rotate: 3.35,
			y : .1,
			z : 10
		},
		attachtocamera :false,
		hasPin : '/assets/img/pins/toy.png'
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
			rotate: 3.35,
			y : .1,
			z : {
				start : 12,
				end : 10
			}
		},
		attachtocamera : 'onspawnonly',
		hasPin : false,
		doMouseOuts : false
	}

	
}