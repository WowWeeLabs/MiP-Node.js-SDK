var BaseService = require("./base");
var logger = require("../base/logger");

function ReceiveData() {
	
}

ReceiveData.prototype = new BaseService();

ReceiveData.prototype.needReceiveData = function needReceiveData(notify, callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.notify.call(this, "RECEIVE", notify, callback);
}

module.exports = ReceiveData;