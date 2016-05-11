var BaseRobot = require("../base/robot");

var BatteryLevel = require("../services/battery-level");
var DeviceInfo = require("../services/device-info");
var ModuleParameter = require("../services/module-parameter");
var SendData = require("../services/send-data");
var ReceiveData = require("../services/receive-data");
var DeviceSetting = require("../services/device-setting");
var DFU = require("../services/dfu");
var RSSIReport = require("../services/rssi-report");
var NuvotonBootloader = require("../services/nuvoton-bootloader");

var Util = require("../base/util");
var logger = require("../base/logger");

function MiPRobot() {
	var self = this;
	
	this.serviceInfo = require("./services.json");

	this.prepareServiceList = {	"BATTERY_LEVEL": BatteryLevel,
								"DEVICE_INFO": DeviceInfo,
								"MODULE_PARAMETER": ModuleParameter,
								"SEND_DATA": SendData,
								"RECEIVE_DATA": ReceiveData,
								"DEVICE_SETTING": DeviceSetting,
								"DFU": DFU,
								"RSSI_REPORT": RSSIReport,
								"NUVOTON_BOOTLOADER": NuvotonBootloader};
	
	this.sendMiPCommand = function sendMiPCommand(params) {
		logger.info(this, arguments);
		
		//read all arguments except last one
		var args = Array.prototype.slice.call(arguments, 0, -1);
		//convert to byte by command name
		args[0] = this.CONSTANTS["COMMAND_CODE"][args[0]];
		
		//read the callback function
		var callback = arguments[arguments.length-1];
		
		var data = new Buffer(args.length);
		args.forEach(function(arg, i) {
			data.writeUInt8(arg, i);
		});
		
		this.callServiceFunction("SEND_DATA", SendData.prototype.sendCommand, data, callback);
	}
	
	this.toyActivationStatus = 0;
	
	this.setMipProductionActivation = function(status, callback) {
		self.toyActivationStatus = status;
		
		this.sendMiPCommand("SET_TOY_ACTIVATED_STATUS", self.toyActivationStatus, callback);
	}
	
	this.driveWithRateAndTime = function(isToward, rate, time, callback) {
		var command = isToward ? "DRIVE_FORWARD_WITH_TIME" : "DRIVE_BACKWARD_WITH_TIME";
		var r = Math.round(Math.min(rate, 30));
		var t = Math.round(Math.min(time / 7, 255));
		
		this.sendMiPCommand(command, r, t, callback);
	}
	
	this.turnWithRate = function(degree, rate, callback) {
		var command = degree < 0 ? "TURN_LEFT_BY_ANGLE" : "TURN_RIGHT_BY_ANGLE";
		var d = Math.round(Math.min(Math.abs(degree), 360) / 4);
		var r = Math.round(Math.min(rate, 24));
		
		this.sendMiPCommand(command, d, r, callback);
	}
}

MiPRobot.prototype = new BaseRobot();

MiPRobot.prototype.CONSTANTS = require("./constants.json");

MiPRobot.prototype.toString = function() {
	return "[MiPRobot]:"+this.name;
}

//prepare all services for mip
MiPRobot.prototype.prepareServices = function prepareServices() {
	var self = this;
	
	Object.keys(this.prepareServiceList).forEach(function(name) {
		BaseRobot.prototype.setupService.call(self, self.serviceInfo, name, self.prepareServiceList[name]);
	});
}

/*Read info*/

//convert the response from MiPCommands
MiPRobot.prototype.convertMiPResponse = function convertMiPResponse(buffer, callback) {
	logger.info(this, arguments);
	
	var str = buffer.toString();
	
	var data = [];
	for (var i=0; i<str.length; i+=2) {
		data.push(parseInt("0x"+str.substr(i, 2)));
	}
	
	callback(Util.getKeyByConstant(MiPRobot, "COMMAND_CODE", data[0]), data.slice(1));
}

MiPRobot.prototype.readMipStatus = function(callback) {
	this.sendMiPCommand("GET_STATUS", callback);
}

MiPRobot.prototype.readMipHardwareVersion = function(callback) {
	this.sendMiPCommand("GET_HARDWARE_VERSION", callback);
}

MiPRobot.prototype.readMipFirmwareVersion = function(callback) {
	this.sendMiPCommand("GET_SOFTWARE_VERSION", callback);
}

MiPRobot.prototype.readMipVolumeLevel = function(callback) {
	this.sendMiPCommand("GET_VOLUME_LEVEL", callback);
}

MiPRobot.prototype.readMipActivationStatus = function(callback) {
	this.sendMiPCommand("GET_TOY_ACTIVATED_STATUS", callback);
}

MiPRobot.prototype.readMipSensorWeightLevel = function(callback) {
	this.sendMiPCommand("GET_WEIGHT_LEVEL", callback);
}

/*Write Info*/
MiPRobot.prototype.resetMipProductActivated = function(callback) {
	this.setMipProductionActivation(Util.getConstantByKey(DeviceSetting, "ACTIVIATION_STATUS", "FACTORY_DEFAULT"), callback);
}

MiPRobot.prototype.activateMipProduct = function(callback) {
	this.setMipProductionActivation(this.activateMipProduct | Util.getConstantByKey(DeviceSetting, "ACTIVIATION_STATUS", "ACTIVATE"), callback);
}

MiPRobot.prototype.activateMipProductAndUpload = function(callback) {
	this.setMipProductionActivation(this.activateMipProduct | Util.getConstantByKey(DeviceSetting, "ACTIVIATION_STATUS", "ACTIVATE_SENT_TO_FLURRY"), callback);
}

MiPRobot.prototype.activateMipHackerAndUpload = function(callback) {
	this.setMipProductionActivation(this.activateMipProduct | Util.getConstantByKey(DeviceSetting, "ACTIVIATION_STATUS", "HACKER_UART_USED_SENT_TO_FLURRY"), callback);
}

MiPRobot.prototype.setMipVolumeLevel = function(volume, callback) {
	this.sendMiPCommand("SET_VOLUME_LEVEL", volume, callback);
}

/*Driving comand*/
MiPRobot.prototype.drive = function(x, y, callback) {
	var driveValue = Math.round(Math.min(1, Math.abs(y)) * 32);
	var turnValue = Math.round(Math.min(1, Math.abs(x)) * 32);
	
	driveValue += (y > 0) ? this.CONSTANTS["DRIVE_CONTINOUS_VALUE"]["FW_SPEED1"] : this.CONSTANTS["DRIVE_CONTINOUS_VALUE"]["BW_SPEED1"];
	turnValue += (x > 0) ? this.CONSTANTS["DRIVE_CONTINOUS_VALUE"]["RIGHT_SPEED1"] : this.CONSTANTS["DRIVE_CONTINOUS_VALUE"]["LEFT_SPEED1"];
	
	this.sendMiPCommand("DRIVE_CONTINOUS", driveValue, turnValue, callback);
}

MiPRobot.prototype.driveToward = function(time, speed, callback) {
	this.driveWithRateAndTime(true, time, speed, callback);
}

MiPRobot.prototype.driveBackward = function(time, speed, callback) {
	this.driveWithRateAndTime(false, time, speed, callback);
}

MiPRobot.prototype.punchLeftWithSpeed = function(speed, callback) {
	this.turnWithRate(-90, speed, callback);
}

MiPRobot.prototype.punchRightWithSpeed = function(speed, callback) {
	this.turnWithRate(90, speed, callback);
}

MiPRobot.prototype.turnLeftByDegress = function(degree, speed, callback) {
	this.turnWithRate(-degree, speed, callback);
}

MiPRobot.prototype.turnRightByDegress = function(degree, speed, callback) {
	this.turnWithRate(degree, speed, callback);
}

MiPRobot.prototype.driveDistanceByCm = function(distanceInCm, degree, callback) {
	var direction = (distanceInCm > 0) ? this.CONSTANTS["DRIVE_DIRECTION"]["FORWARD"] : this.CONSTANTS["DRIVE_DIRECTION"]["BACKWARD"];
	var distance = Math.round(Math.abs(distanceInCm));
	var turn = (degree < 0) ? this.CONSTANTS["DRIVE_DIRECTION"]["TURN_CLOCKWISE"] : this.CONSTANTS["DRIVE_DIRECTION"]["TURN_ANTI_CLOCKWISE"];
	var angle1 = Math.round(Math.abs(degree)) >> 8;
	var angle2 = Math.round(Math.abs(degree)) & 0x00ff;
	
	this.sendMiPCommand("DRIVE_FIXED_DISTANCE", direction, distance, turn, angle1, angle2, callback);
}

MiPRobot.prototype.falloverWithStyle = function(styleName, callback) {
	this.sendMiPCommand("SHOULD_FALLOVER", this.CONSTANTS["POSITION_VALUE"][styleName], callback);
}

MiPRobot.prototype.ping = function(callback) {
	this.sendMiPCommand("CHECK_BOOT_MODE", callback);
}

/**LEDs**/

MiPRobot.prototype.setHeadLeds = function(led1, led2, led3, led4, callack) {
	this.sendMiPCommand("SET_HEAD_LED", led1, led2, led3, led4, callback);
}

MiPRobot.prototype.setChestLedFlashingWithColor = function(red, green, blue, timeoff, callback) {
	this.sendMiPCommand("FLASH_CHEST_RGB_LED", red, green, blue, timeoff, callback);
}

MiPRobot.prototype.setMipChestLedWithColor = function(red, green, blue, fadeIn, callback) {	
	this.sendMiPCommand("SET_CHEST_RGB_LED", red, green, blue, fadeIn, callback);
}

/**IR**/
MiPRobot.prototype.transmitIRGameDataWithGameType = function(gameType, mipId, gameData, powerOfDistance, callback) {
	var data = new Buffer(4);
	data.writeUInt8(gameType, 0);
	data.writeUInt8(mipId, 1);
	data.writeUint16BE(gameData, 2);
	
	this.sendMiPCommand("TRANSMIT_IR_COMMAND", data[3], data[2], data[1], data[0], 32, powerOfDistance, callback);
}

/**Sound**/
MiPRobot.prototype.playMipSound = function(soundName, delay, volume, callback) {
	if (volume == -1) {
		this.sendMiPCommand("PLAY_SOUND", this.CONSTANTS["SOUND_FILE"][soundName], delay, callback);
	}
	else {
		this.sendMiPCommand("PLAY_SOUND", this.CONSTANTS["SOUND_FILE"][soundName], delay, volume, 0, callback);
	}
}

module.exports = MiPRobot;