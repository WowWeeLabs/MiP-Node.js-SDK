var BaseService = require("./base");
var Util = require("../base/util");
var logger = require("../base/logger");

function NuvotonBootloader() {
	var self = this;
	
	this.executedSetupNotificationOnce = false;
	this.tmpFirmwareData = null;
	
	this.sendFirmwareDataCompleteCallback = null;
	
	this.setupNotificationOnce = function() {
		if (!self.executedSetupNotificationOnce) {
			self.executedSetupNotificationOnce = true;
			
			BaseService.prototype.notify.call(self, "WRITE_FIRMWARE_PROGESS", true, self.notifyWriteFirmwareProgess);
			BaseService.prototype.notify.call(self, "FIRMWARE_WRITE_COMPLETE", true, self.notifyFirmwareWriteComplete);
			BaseService.prototype.notify.call(self, "TRANSFER_FIRMWARE_STATUS", true, self.notifyTransferFirmwareStatus);
		}
	}
	this.notifyWriteFirmwareProgess = function notifyWriteFirmwareProgess(err, data, isNotification) {
		if (err) {
			logger.err(this, arguments);
			return;
		}
		
		this.writeFirmwareDataProgess = Math.max(0, Util.getIntFromData(data));
		
		logger.info(this, arguments, "writeFirmwareDataProgess: "+writeFirmwareDataProgess);
	}
	this.notifyFirmwareWriteComplete = function notifyFirmwareWriteComplete(err, data, isNotification) {
		if (err) {
			logger.err(this, arguments);
			return;
		}
		
		this.firmwareCompleteStatus = Util.getIntFromData(data);
		
		if (this.sendFirmwareDataCompleteCallback) {
			if (this.firmwareCompleteStatus === Util.getConstantByKey(NuvotonBootloader, "NUVOTON_FIRMWARE_COMPLETE_STATUS", "SUCCESS")) {
				this.sendFirmwareDataCompleteCallback(null);
			}
			else {
				this.sendFirmwareDataCompleteCallback("firmwareCompleteStatus is not success("+this.firmwareCompleteStatus+")");
			}
		}
		
		logger.info(this, arguments, "firmwareCompleteStatus: "+firmwareCompleteStatus);
	}
	this.notifyTransferFirmwareStatus = function notifyTransferFirmwareStatus(err, data, isNotification) {
		if (err) {
			logger.err(this, arguments);
			return;
		}
		
		var status = Util.getIntFromData(data);
		if (status == Util.getConstantByKey(NuvotonBootloader, "NUVOTON_FIRMWARE_TRANSFER_STATUS", "HEADER_OK")
		   || status == Util.getConstantByKey(NuvotonBootloader, "NUVOTON_FIRMWARE_TRANSFER_STATUS", "NEXT_PACKET")) {
			self.sendNextFirmwareDataToCache(function(err) {
				if (err) {
					logger.err(self, arguments, "sendNextFirmwareDataToCache");
				}
			});
		}
		else if (status == Util.getConstantByKey(NuvotonBootloader, "NUVOTON_FIRMWARE_TRANSFER_STATUS", "DATA_OK")) {
			self.writeFirmwareDataToNuvoton(function(err) {
				if (err) {
					logger.err(self, arguments);
				}
			});
		}
		
		self.firmwareTransferStatus = status;
		
		logger.info(this, arguments, "firmwareTransferStatus: "+firmwareTransferStatus);
	}
	this.getFirmwareChecksum = function(buffer) {
		var checkSum = 0;
		for (var i=0; i<buffer.length; i++) {
			checkSum += buffer.readUInt8(i);
		}
		return checkSum;
	}
	this.sendNextFirmwareDataToCache = function(callback) {
		var nextBuffer = this.tmpFirmwareData.slice(this.sentFirmwareSize, Math.min(20, this.totalFirmwareSize - this.sentFirmwareSize));
		this.sentFirmwareSize += nextBuffer.length;
		
		BaseService.prototype.write.call(this, "TRANSFER_FIRMWARE_DATA", nextBuffer, callback);
	}
}

NuvotonBootloader.prototype = new BaseService();

NuvotonBootloader.prototype.CONSTANTS = require("./nuvoton-bootloader.json");

NuvotonBootloader.prototype.totalFirmwareSize = 0;
NuvotonBootloader.prototype.sentFirmwareSize = 0;
NuvotonBootloader.prototype.writeFirmwareDataProgess = 0;

NuvotonBootloader.prototype.firmwareCompleteStatus = Util.getConstantByKey(NuvotonBootloader, "NUVOTON_FIRMWARE_COMPLETE_STATUS", "READY");
NuvotonBootloader.prototype.firmwareTransferStatus = Util.getConstantByKey(NuvotonBootloader, "NUVOTON_FIRMWARE_TRANSFER_STATUS", "READY");

NuvotonBootloader.prototype.readClipStatus = function readClipStatus(callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.read.call(this, "GET_CLIP_STATUS", callback);
}

NuvotonBootloader.prototype.readFirmwareDataStatus = function readFirmwareDataStatus(callback) {
	logger.info(this, arguments);
	
	BaseService.prototype.read.call(this, "READ_FIRMWARE_STATUS", callback);
}

NuvotonBootloader.prototype.restartToMode = function restartToMode(mode, callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(1);
	if (typeof mode === "string") {
		data.writeUInt8(Util.getConstantByKey(NuvotonBootloader, "NUVOTON_BOOTLOADER_MODE", mode));
	}
	else {
		data.writeUInt8(mode, 0);
	}
	BaseService.prototype.write.call(this, "RESTART_CLIP", data, callback);
}

NuvotonBootloader.prototype.sendFirmwareDataToCache = function sendFirmwareDataToCache(buffer, callback) {
	logger.info(this, arguments);
	
	var self = this;
	
	this.setupNotificationOnce();
	
	this.totalFirmwareSize = buffer.length;
	
	var headerData = new Buffer(9);
	headerData.writeInt32BE(this.totalFirmwareSize, 0);
	headerData.writeInt32BE(this.getFirmwareChecksum(buffer), 4);
	headerData.writeUInt8(0x01, 8);
	
	this.sendFirmwareDataToCache = 0;
	
	this.writeFirmwareDataProgess = 0;
	
	this.tmpFirmwareData = buffer;
	
	BaseService.prototype.write.call(this, "TRANSFER_FIRMWARE_HEADER", headerData, function(err) {
		if (err) {
			callback(err);
			
			return;
		}
		
		self.sendFirmwareDataCompleteCallback = callback;
	});
}

NuvotonBootloader.prototype.stopFirmwareDataToCache = function stopFirmwareDataToCache(callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(1);
	data.writeUInt8(0x01, 0);
	BaseService.prototype.write.call(this, "STOP_TRANSFER", data, callback);
}

NuvotonBootloader.prototype.writeFirmwareDataToNuvoton = function writeFirmwareDataToNuvoton(callback) {
	logger.info(this, arguments);
	
	var data = new Buffer(1);
	data.writeUInt8(0x01, 0);
	BaseService.prototype.write.call(this, "WRITE_FIRMWARE_TO_NUVOTON", data, callback);
}

module.exports = NuvotonBootloader;