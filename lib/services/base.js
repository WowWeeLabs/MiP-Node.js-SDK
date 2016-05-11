function BaseService() {
}

//setup the service
BaseService.prototype.setup = function(nobleService, info) {
	this._service = nobleService;
	this.info = info;
	
	return this;
}

//prepare the service
BaseService.prototype.prepare = function(callback) {
	var self = this;
	
	if (this._characteristics != null) {
		callback(null, this._characteristics);
	}
	else {
		this._service.discoverCharacteristics([], function(err, characteristics) {
			if (err != null) {
				callback(err, null);
				return;
			}

			self._characteristics = characteristics;
			callback(null, characteristics);
		});
	}
}

//get characteristic by name
BaseService.prototype.getCharacteristic = function(name, callback) {
	var self = this;
	
	if (this.info.characteristics[name] == null) {
		callback("characteristics("+name+") is invalid.", null);
	}
	else {
		this.prepare(function(err, characteristics) {
			if (err != null) {
				callback(err, null);
				return;
			}

			for (var c in self._characteristics) {
				if (self._characteristics[c].uuid === self.info.characteristics[name]) {
					callback(null, self._characteristics[c]);
					
					return;
				}
			}
			
			callback("characteristics("+name+") is not found.", null);
		});
	}
}

//read from characteristic
BaseService.prototype.read = function read(name, callback) {
	this.getCharacteristic(name, function(err, characteristic) {
		if (err != null) {
			callback(err, null);
			return;
		}
		
		characteristic.read(callback);
	});
}

//write from characteristic
BaseService.prototype.write = function(name, data, callback) {
	this.getCharacteristic(name, function(err, characteristic) {
		if (err != null) {
			callback(err);
			return;
		}
		
		characteristic.write(data, false, callback);
	});
}

//notify on characteristic
BaseService.prototype.notify = function(name, notify, callback) {
	this.getCharacteristic(name, function(err, characteristic) {
		if (err != null) {
			callback(err, null, null);
			return;
		}
		
		characteristic.notify(notify);
		characteristic.on("data", function(data, isNotification){
			callback(null, data, isNotification);
		});
	});
}

module.exports = BaseService;