function Util() {
	
}

//convert integer from byte array
Util.getIntFromData = function(data) {
	var buffer = new Buffer(data.length);
	data.forEach(function(d, i) {
		buffer.writeUInt(d, i);
	});
	return buffer.readUInt32BE(0);
}

//get constant value from class's CONSTANTS
Util.getConstantByKey = function(obj, type, name) {
	return obj.prototype.CONSTANTS[type][name];
}

//search constant key from class's CONSTANTS
Util.getKeyByConstant = function(obj, type, value) {
	var output;
	
	var o = obj.prototype.CONSTANTS[type];
	Object.keys(o).forEach(function(key) {
		if (o[key] === value) {
			output = key;
		}
	});
	
	return output;
}

module.exports = Util;