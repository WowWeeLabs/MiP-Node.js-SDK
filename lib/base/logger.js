var debug = require("debug");
var util = require("util");

function logger() {
}

//gather the info msg for class & func
logger.info = function(obj, args, msg) { this.log("info", obj, args, msg); }
//gather the debug msg for class & func
logger.debug = function(obj, args, msg) { this.log("debug", obj, args, msg); }
//gather the error msg for class & func
logger.err = function(obj, args, err) { this.log("err", obj, args, err); }

logger.log = function(mode, obj, args, msg) {
	var d = debug("mip:"+obj.constructor.name+":"+mode);
	
	if (msg === undefined) {
		d(args.callee.name+"("+util.inspect(args)+")");
	}
	else {
		d(args.callee.name+"("+util.inspect(args)+")", util.inspect(msg));
	}
}

module.exports = logger;