var logger = require("../base/logger");

var BatteryLevel = require("../services/battery-level");
var DeviceInfo = require("../services/device-info");
var ModuleParameter = require("../services/module-parameter");
var SendData = require("../services/send-data");
var ReceiveData = require("../services/receive-data");
var DeviceSetting = require("../services/device-setting");
var DFU = require("../services/dfu");
var RSSIReport = require("../services/rssi-report");
var NuvotonBootloader = require("../services/nuvoton-bootloader");

function BaseRobot() {
}

//setup the robot
BaseRobot.prototype.setup = function(peripheral) {
	this._peripheral = peripheral;
	this._services = [];
	this.name = this._peripheral.advertisement.localName;
	this.services = {};
	
	return this;
}

//read product id through advertisement manufacturer's data
BaseRobot.readProductId = function(peripheral) {
	var data = peripheral.advertisement.manufacturerData;
	if (data != null) {
		return data[0] << 8 | data[1];
	}
	else {
		return -1;
	}
}

BaseRobot.prototype.toString = function() {
	return "BaseRobot.name:"+this.name;
}

//connect to robot
BaseRobot.prototype.connect = function(callback) {
	var self = this;
	
	self._peripheral.connect(function(err) {
		if (err != null) {
			callback(err);
			return;
		}
		
		self._peripheral.discoverServices([], function(err, services) {
			if (err != null) {
				callback(err);
				return;
			}
			self._services = services;
			
			self.prepareServices();
			
			callback(null);
		});
	});
}

//prepare the services
BaseRobot.prototype.prepareServices = function() {};

//setup the service
BaseRobot.prototype.setupService = function setupService(info, name, mipService) {
	if (this.services[name] != null) {
		logger.info(this, arguments);
		
		return this.services[name];
	}
	else if (info[name] != null) {
		var uuid = info[name].uuid;
		
		for (var s in this._services) {
			var service = this._services[s];
			if (service.uuid === uuid) {
				this.services[name] = (new mipService()).setup(service, info[name]);
				
				logger.info(this, arguments);
				
				return this.services[name];
			}
		}
	}
	else {
		logger.err(this, arguments, "service is invalid");
		
		return null;
	}
}

//shortcut to access service's function
BaseRobot.prototype.callServiceFunction = function callServiceFunction(serviceName, serviceFunc) {
	if (serviceName && this.services[serviceName] && serviceFunc) {
		serviceFunc.call(	this.services[serviceName],
							arguments[2],
							arguments[3],
							arguments[4],
							arguments[5],
							arguments[6],
							arguments[7],
							arguments[8],
							arguments[9],
							arguments[10],
							arguments[11]);
	}
	else {
		var msg = "service/function is not available";
		logger.err(this, arguments, msg);
		
		//assume last argument is a callback function
		var callback = arguments[arguments.length - 1];
		if (typeof callback === "function") {
			callback("service/function is not available");
		}
	}
}

//shortcut to access service's variable
BaseRobot.prototype.getServiceVariable = function(serviceName, name) {
	if (serviceName && this.services[serviceName] && serviceFunc) {
		return this.services[serviceName][name];
	}
	else {
		return null;
	}
}

BaseRobot.prototype.enableBTReceiveDataNotification = function enableBTReceiveDataNotification(enable, callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("RECEIVE_DATA", ReceiveData.prototype.needReceiveData, enable, callback);
}

BaseRobot.prototype.getBTBatteryLevel = function getBTBatteryLevel(callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("BATTERY_LEVEL", BatteryLevel.prototype.readBatteryLevel, callback);
}

BaseRobot.prototype.enableBTRSSIReport = function enableBTRSSIReport(enable, interval, callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("RSSI_REPORT", RSSIReport.prototype.needRSSIReport, enable, interval, callback);
}

BaseRobot.prototype.readBTSystemId = function readBTSystemId(callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("DEVICE_INFO", DeviceInfo.prototype.readSystemId, callback);
}

BaseRobot.prototype.readBTModuleSoftwareVersion = function readBTModuleSoftwareVersion(callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("DEVICE_INFO", DeviceInfo.prototype.readModuleSoftware, callback);
}

BaseRobot.prototype.getBTProductActivationStatus = function getBTProductActivationStatus(callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("DEVICE_SETTING", DeviceSetting.prototype.readProductActivationStatus, callback);
}

BaseRobot.prototype.setBTProductActivationStatus = function setBTProductActivationStatus(status, callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("DEVICE_SETTING", DeviceSetting.prototype.writeProductActivationStatus, status, callback);
}

BaseRobot.prototype.btNordicReboot = function btNordicReboot(mode, callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("DFU", DFU.prototype.rebootToMode, mode, callback);
}

BaseRobot.prototype.getBTDeviceName = function getBTDeviceName(callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.readDeviceName, callback);
}

BaseRobot.prototype.setBTDeviceName = function setBTDeviceName(name, callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.writeDeviceName, name, callback);
}

BaseRobot.prototype.getBTCommunicationInterval = function getBTCommunicationInterval(callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.readBTCommunicationInterval, callback);
}

BaseRobot.prototype.setBTCommunicationInterval = function setBTCommunicationInterval(interval, callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.writeBTCommunicationInterval, interval, callback);
}

BaseRobot.prototype.getBTUARTBuardRate = function getBTUARTBuardRate(callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.readUartBuadRate, callback);
}

BaseRobot.prototype.setBTUARTBuardRate = function setBTUARTBuardRate(rate, callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.writeUartBuadRate, rate, callback);
}

BaseRobot.prototype.restartBTDevice = function restartBTDevice(callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.restartModule, callback);
}

BaseRobot.prototype.factoryResetBTDevice = function factoryResetBTDevice(userDataOnly, callback) {
	logger.info(this, arguments);
	
	if (userDataOnly) {
		this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.restorUserDataToFactorySetting, callback);
	}
	else {
		this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.restorModuleToFactorySetting, callback);
	}
}

BaseRobot.prototype.getBTBoardcastPeriod = function getBTBoardcastPeriod(callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.readBoardcastPeriod, callback);
}

BaseRobot.prototype.setBTBoardcastPeriod = function setBTBoardcastPeriod(period, callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.writeBoardcastPeriod, period, callack);
}

BaseRobot.prototype.getBTProductId = function getBTProductId(callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.readProductId, callback);
}

BaseRobot.prototype.setBTProductId = function setBTProductId(id, callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.writeProductId, id, callback);
}

BaseRobot.prototype.getBTTransmitPower = function getBTTransmitPower(callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.readTransmitPower, callback);
}

BaseRobot.prototype.setBTTransmitPower = function setBTTransmitPower(power, callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.writeTransmitPower, power, callback);
}

BaseRobot.prototype.setBTBoardcastData = function setBTBoardcastData(data, callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.writeBoardcastData, data, callback);
}

BaseRobot.prototype.setBTBoardcatDataToDefault = function setBTBoardcatDataToDefault(callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.writeBoardcastDataToDefault, callback);
}

BaseRobot.prototype.enableToGetBTBoardcastData = function enableToGetBTBoardcastData(enable, callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.enableToReadBoardcastData, enable, callback);
}

BaseRobot.prototype.forceBTModuleSleep = function forceBTModuleSleep(callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.forceModuleSleep, callback);
}

BaseRobot.prototype.saveBTCurrentIOState = function saveBTCurrentIOState(callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.saveCurrentIOState, callback);
}

BaseRobot.prototype.getBTStandByPulseSleepMode = function getBTStandByPulseSleepMode(callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.readStandByPulseSleepMode, callback);
}

BaseRobot.prototype.setBTStandByPulseSleepMode = function setBTStandByPulseSleepMode(pulseSleepMode, callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.writeStandByPulseSleepMode, pulseSleepMode, callback);
}

BaseRobot.prototype.saveBTBoardcastDataToFlash = function saveBTBoardcastDataToFlash(callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.writeCurrentCustomBoardcastDataToFlash, callback);
}

BaseRobot.prototype.setBTConnectedBoardcastData = function setBTConnectedBoardcastData(buffer, callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.writeConnectedBoadcastData, buffer, callback);
}

BaseRobot.prototype.enableBTConnectedBoardcast = function enableBTConnectedBoardcast(enable, callback) {
	logger.info(this, arguments);
	
	this.callServiceFunction("MODULE_PARAMETER", ModuleParameter.prototype.enableConnectedBoadcast, enable, callback);
}



BaseRobot.prototype.readNuvotonFirmwareDataStatus = function readNuvotonFirmwareDataStatus(callback) {
	logger.info(this.arguments);
	
	this.callServiceFunction("NUVOTON_BOOTLOADER", NuvotonBootloader.prototype.readFirmwareDataStatus, callback)
}

BaseRobot.prototype.readNuvotonClipStatus = function readNuvotonClipStatus(callback) {
	logger.info(this.arguments);
	
	this.callServiceFunction("NUVOTON_BOOTLOADER", NuvotonBootloader.prototype.readClipStatus, callback);
}

BaseRobot.prototype.stopFirmwareDataToNuvotonCache = function stopFirmwareDataToNuvotonCache(callback) {
	logger.info(this.arguments);
	
	this.callServiceFunction("NUVOTON_BOOTLOADER", NuvotonBootloader.prototype.stopFirmwareDataToCache, callback);
}

BaseRobot.prototype.writeFirmwareDataToNuvoton = function writeFirmwareDataToNuvoton(callback) {
	logger.info(this.arguments);
	
	this.callServiceFunction("NUVOTON_BOOTLOADER", NuvotonBootloader.prototype.writeFirmwareDataToNuvoton, callback);
}

BaseRobot.prototype.restartToNuvotonMode = function restartToNuvotonMode(mode, callback) {
	logger.info(this.arguments);
	
	this.callServiceFunction("NUVOTON_BOOTLOADER", NuvotonBootloader.prototype.restartToMode, mode, callback);
}

BaseRobot.prototype.sendFirmwareDataToNuvotonCache = function sendFirmwareDataToNuvotonCache(buffer, callback) {
	logger.info(this.arguments);
	
	this.callServiceFunction("NUVOTON_BOOTLOADER", NuvotonBootloader.prototype.sendFirmwareDataToCache, buffer, callback);
}

BaseRobot.prototype.totalNuvotonFirmwareSize = function() {
	return this.getServiceVariable("NUVOTON_BOOTLOADER", "totalFirmwareSize");
}

BaseRobot.prototype.sentNuvotonFirmwareSize = function() {
	return this.getServiceVariable("NUVOTON_BOOTLOADER", "sentFirmwareSize");
}

BaseRobot.prototype.writeNuvotonFirmwareDataProgess = function() {
	return this.getServiceVariable("NUVOTON_BOOTLOADER", "writeFirmwareDataProgess");
}

BaseRobot.prototype.nuvotonFirmwareCompleteStatus = function() {
	return this.getServiceVariable("NUVOTON_BOOTLOADER", "firmwareCompleteStatus");
}

BaseRobot.prototype.nuvotonFirmwareTransferStatus = function() {
	return this.getServiceVariable("NUVOTON_BOOTLOADER", "firmwareTransferStatus");
}

module.exports = BaseRobot;