var BaseService = require("./base");
var logger = require("../base/logger");

function SendData() {
	
}

SendData.prototype = new BaseService();

SendData.prototype.sendCommand = function sendCommand(data, callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.write.call(this, "SEND", data, callback);
}

module.exports = SendData;