var BaseService = require("./base");
var Util = require("../base/util");
var logger = require("../base/logger");

function DeviceSetting() {
	
}
DeviceSetting.prototype = new BaseService();

DeviceSetting.prototype.CONSTANTS = require("./device-setting.json");

DeviceSetting.prototype.readProductActivationStatus = function readProductActivationStatus(callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.read.call(this, "PRODUCT_ACTIVIATION", callback);
}

DeviceSetting.prototype.writeProductActivationStatus = function writeProductActivationStatus(status, callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(1);
	if (typeof status === "string") {
		data.writeUInt8(Util.getConstantByKey(DeviceSetting, "ACTIVIATION_STATUS", status), 0);
	}
	else {
		data.writeUInt8(status, 0);
	}
	BaseService.prototype.write.call(this, "PRODUCT_ACTIVIATION", data, callback);
}

module.exports = DeviceSetting;