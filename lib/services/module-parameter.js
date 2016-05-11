var BaseService = require("./base");
var Util = require("../base/util");
var logger = require("../base/logger");

function ModuleParameter() {
	this.MAX_BT_DEVICE_NAME_LENGTH = 11;
	
	this.resetModule = function(type, callback) {
		var data = new Buffer(1);
		if (typeof type === "string") {
			data.writeUInt8(Util.getConstantByKey(ModuleParameter, "RESET_MODULE", type), 0);
		}
		else {
			data.writeUInt8(type, 0);
		}
		
		BaseService.prototype.write.call(this, "RESET_MODULE", data, callback);
	}
}

ModuleParameter.prototype = new BaseService();

ModuleParameter.prototype.CONSTANTS = require("./module-parameter.json");

ModuleParameter.prototype.readDeviceName = function readDeviceName(callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.read.call(this, "DEVICE_NAME", callback);
}

ModuleParameter.prototype.writeDeviceName = function writeDeviceName(name, callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(1 + Math.max(this.MAX_BT_DEVICE_NAME_LENGTH, name.length));
	data.writeUInt8(0x00, 0);
	data.write(name, 1);
	
	BaseService.prototype.write.call(this, "DEVICE_NAME", data, callback);
}

ModuleParameter.prototype.readBTCommunicationInterval = function readBTCommunicationInterval(callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.read.call(this, "BT_COMMUNICATION_INTERVAL", callback);
}

ModuleParameter.prototype.writeBTCommunicationInterval = function writeBTCommunicationInterval(interval, callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(1);
	data.writeUInt8(interval);
	
	BaseService.prototype.write.call(this, "BT_COMMUNICATION_INTERVAL", data, callback);
}

ModuleParameter.prototype.readUartBuadRate = function readUartBuadRate(callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.read.call(this, "UART_BAUD_RATE", callback);
}

ModuleParameter.prototype.writeUartBuadRate = function writeUartBuadRate(rate, callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(1);
	if (typeof rate === "string") {
		data.writeUInt8(Util.getConstantByKey(ModuleParameter, "UART_BAUD_RATE", rate), 0);
	}
	else {
		data.writeUInt8(rate, 0);
	}
	
	BaseService.prototype.write.call(this, "UART_BAUD_RATE", data, callback);
}

ModuleParameter.prototype.restartModule = function restartModule(callback) {
	logger.info(this, arguments);
	
	this.restartModule("RESTART_MODULE", callback);
}

ModuleParameter.prototype.restorUserDataToFactorySetting = function restorUserDataToFactorySetting(callback) {
	logger.info(this, arguments);
	
	this.restartModule("RESET_MODULE_TO_RESET_USER_DATA", callback);
}

ModuleParameter.prototype.restorModuleToFactorySetting = function restorModuleToFactorySetting(callback) {
	logger.info(this, arguments);
	
	this.restartModule("RESET_MODULE_TO_FACTORY_SETTING", callback);
}

ModuleParameter.prototype.readBoardcastPeriod = function readBoardcastPeriod(callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.read.call(this, "BOARDCAST_PERIOD", callback);
}

ModuleParameter.prototype.writeBoardcastPeriod = function writeBoardcastPeriod(period, callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(1);
	if (typeof period === "string") {
		data.writeUInt8(Util.getConstantByKey(ModuleParameter, "BOARDCAST_PERIOD", period), 0);
	}
	else {
		data.writeUInt8(period, 0);
	}
	
	BaseService.prototype.write.call(this, "BOARDCAST_PERIOD", data, callback);
}

ModuleParameter.prototype.readProductId = function readProductId(callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.read.call(this, "PRODUCT_ID", callback);
}

ModuleParameter.prototype.writeProductId = function writeProductId(productId, callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(2);
	data.writeUInt16BE(productId);
	
	BaseService.prototype.write.call(this, "PRODUCT_ID", data, callback);
}

ModuleParameter.prototype.readTransmitPower = function readTransmitPower(callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.read.call(this, "TRANSMIT_POWER", callback);
}

ModuleParameter.prototype.writeTransmitPower = function writeTransmitPower(power, callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(1);
	if (typeof power === "string") {
		data.writeUInt8(Util.getConstantByKey(ModuleParameter, "TRANSMIT_POWER", power), 0);
	}
	else {
		data.writeUInt8(power, 0);
	}
	
	BaseService.prototype.read.call(this, "TRANSMIT_POWER", data, callback);
}

ModuleParameter.prototype.enableToReadBoardcastData = function enableToReadBoardcastData(enable, callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.notify.call(this, "CUSTOM_BOARDCAST_DATA", enable, callback);
}

ModuleParameter.prototype.writeBoardcastData = function writeBoardcastData(data, callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.write.call(this, "CUSTOM_BOARDCAST_DATA", data, callback);
}

ModuleParameter.prototype.writeBoardcastDataToDefault = function writeBoardcastDataToDefault(callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(16);
	
	BaseService.prototype.write.call(this, "CUSTOM_BOARDCAST_DATA", data, callback);
}

ModuleParameter.prototype.forceModuleSleep = function forceModuleSleep(callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(1);
	data.writeUInt8(Util.getConstantByKey(ModuleParameter, "REMOTE_CONTROL_EXTENSION", "FORCE_SLEEP_MODE"), 0);
	
	BaseService.prototype.write.call(this, "REMOTE_CONTROL_EXTENSION", data, callback);
}

ModuleParameter.prototype.saveCurrentIOState = function saveCurrentIOState(callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(1);
	data.writeUInt8(Util.getConstantByKey(ModuleParameter, "REMOTE_CONTROL_EXTENSION", "SAVE_IO_STATE"), 0);
	
	BaseService.prototype.write.call(this, "REMOTE_CONTROL_EXTENSION", data, callback);
}

ModuleParameter.prototype.writeCurrentCustomBoardcastDataToFlash = function writeCurrentCustomBoardcastDataToFlash(callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(1);
	data.writeUInt8(Util.getConstantByKey(ModuleParameter, "REMOTE_CONTROL_EXTENSION", "WRITE_CUSTOM_BOARDCAST_DATA_TO_FLASH"), 0);
	
	BaseService.prototype.write.call(this, "REMOTE_CONTROL_EXTENSION", data, callback);
}

ModuleParameter.prototype.readStandByPulseSleepMode = function readStandByPulseSleepMode(callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.read.call(this, "STANDBY_MODE", callback);
}

ModuleParameter.prototype.writeStandByPulseSleepMode = function writeStandByPulseSleepMode(isSleep, callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(1);
	data.writeUInt8(isSleep?1:0, 0);
	
	BaseService.prototype.write.call(this, "STANDBY_MODE", data, callback);
}

ModuleParameter.prototype.disconnectCurrentBTClient = function disconnectCurrentBTClient(callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(1);
	data.writeUInt8(Util.getConstantByKey(ModuleParameter, "REMOTE_CONTROL_EXTENSION", "DISCONNECT_BT_CLIENT"), 0);
	
	BaseService.prototype.write.call(this, "STANDBY_MODE", data, callback);
}

ModuleParameter.prototype.writeConnectedBoadcastData = function writeConnectedBoadcastData(buffer, callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.write.call(this, "SET_BT_COMMUNICATION_DATA", buffer, callback);
}

ModuleParameter.prototype.enableConnectedBoadcast = function enableConnectedBoadcast(enable, callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(1);
	data.writeUInt8(enable?1:0, 0);
	
	BaseService.prototype.write.call(this, "SET_BT_COMMUNICATION_ONOFF", data, callback);
}

module.exports = ModuleParameter;