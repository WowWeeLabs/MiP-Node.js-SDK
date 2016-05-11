var BaseService = require("./base");
var logger = require("../base/logger");

function BatteryLevel() {
	
}
BatteryLevel.prototype = new BaseService();

BatteryLevel.prototype.readBatteryLevel = function readBatteryLevel(callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.read.call(this, "REPORT", callback);
}

module.exports = BatteryLevel;