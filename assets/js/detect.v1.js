var detect = window.detect || {};
var browser;

detect = {

	os : {
		name : ''
	},
	browser : {
		name : 	  '',
		version:  '',
		haswebgl: false
	},
	min : {
		ios : {
			'chrome' : 55,
			'safari' : 10
		},
		android : {
			'chrome' : 50,
			'firefox' : 50
		},
		auto : {
			'chrome' 			: 50,
			'internet explorer' : 11,
			'microsoft edge' 	: 14,
			'safari' 			: 9,
			'firefox' 			: 45
		},
		phonegap : {
			'chrome' 			: 50,
			'internet explorer' : 11,
			'microsoft edge' 	: 14,
			'safari' 			: 9,
			'firefox' 			: 45
		}
	},
	meetsRequirements : true,
	hasGyro : false,

	do : function() {
		console.log('detect.do();');
		
		//perform checks
		detect.browser.haswebgl = detect.hasWebGL();
		detect.browser.name = bowser.name.toLowerCase();
		detect.browser.version = parseInt(bowser.version);

		//check reqs
		if(typeof detect.min[detect.os.name] == 'undefined' ) {
			detect.meetsRequirements = false;
		} else if(typeof detect.min[detect.os.name][detect.browser.name] == 'undefined' ) {
			detect.meetsRequirements = false;
		} else if(detect.min[detect.os.name][detect.browser.name] > detect.browser.version) {
			detect.meetsRequirements = false;
		}

		if(typeof detect.min[detect.os.name]['firefox'] != 'undefined' ) {
			$('.min_firefox').html(detect.min[detect.os.name]['firefox']+'+');
		}
		if(typeof detect.min[detect.os.name]['chrome'] != 'undefined' ) {
			$('.min_chrome').html(detect.min[detect.os.name]['chrome']+'+');
		}
		if(typeof detect.min[detect.os.name]['safari'] != 'undefined' ) {
			$('.min_safari').html(detect.min[detect.os.name]['safari']+'+');
		}
		if(typeof detect.min[detect.os.name]['internet explorer'] != 'undefined' ) {
			$('.min_ie').html(detect.min[detect.os.name]['internet explorer']+'+');
		}

		window.addEventListener("devicemotion", function(event){
			if(event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma)
				detect.hasGyro = true;
		});

		console.log(detect.browser);

	},

	hasWebGL : function(return_context) {
		if (!!window.WebGLRenderingContext) {
			var canvas = document.createElement("canvas"),
			names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
			context = false;

			for(var i=0;i<4;i++) {
				try {
					context = canvas.getContext(names[i]);
					if (context && typeof context.getParameter == "function") {
						// WebGL is enabled
						if (return_context) {
				    		// return WebGL object if the function's argument is present
				    		return {name:names[i], gl:context};
						}
						// else, return just true
						return true;
					}
				} catch(e) {}
			}

			// WebGL is supported, but disabled
			return false;
		}

		// WebGL not supported
		return false;
	},
}
