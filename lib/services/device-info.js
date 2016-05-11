var BaseService = require("./base");
var logger = require("../base/logger");

function DeviceInfo() {
	
}
DeviceInfo.prototype = new BaseService();

DeviceInfo.prototype.readSystemId = function readSystemId(callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.read.call(this, "SYSTEM_ID", callback);
}

DeviceInfo.prototype.readModuleSoftware = function readModuleSoftware(callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.read.call(this, "MODULE_SOFTWARE", callback);
}

module.exports = DeviceInfo;