var BaseService = require("./base");
var logger = require("../base/logger");

function DFU() {
}

DFU.prototype = new BaseService();

DFU.prototype.rebootToMode = function rebootToMode(mode, callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(1);
	data.writeUInt8(mode, 0);
	BaseService.prototype.write.call(this, "REBOOT_TO_MODE", data, callback);
}

module.exports = DFU;