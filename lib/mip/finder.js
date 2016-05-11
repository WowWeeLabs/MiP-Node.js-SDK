var BaseFinder = require("../base/finder");
var MiPRobot = require("./robot");

function MiPFinder() {
}

MiPFinder.prototype = new BaseFinder();

//scan the mip
MiPFinder.prototype.scan = function(callback) {
	BaseFinder.prototype.scan.call(this, MiPRobot.prototype.CONSTANTS["PRODUCT_ID"], callback);
}

//construct the mip
MiPFinder.prototype.createRobot = function(peripheral) {
	return (new MiPRobot()).setup(peripheral);
}

module.exports = MiPFinder;