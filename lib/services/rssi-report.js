var BaseService = require("./base");
var logger = require("../base/logger");

function RSSIReport() {
	
}

RSSIReport.prototype = new BaseService();

RSSIReport.prototype.setInterval = function setInterval(interval, callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(1);
	data.writeUInt8(interval, 0);
	BaseService.prototype.write.call(this, "SET_INTERVAL", data, callback);
}

RSSIReport.prototype.getInterval = function getInterval(callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.read.call(this, "READ", callback);
}

RSSIReport.prototype.needRSSIReport = function needRSSIReport(need, interval, callback) {
	var self = this;
	
	logger.info(this, arguments);
	
	RSSIReport.prototype.setInterval.call(this, interval, function(err) {
		if (err) {
			callback(err, null, null);
			return;
		}
		
		BaseService.prototype.notify.call(self, "READ", need, callback);
	});
}

module.exports = RSSIReport;