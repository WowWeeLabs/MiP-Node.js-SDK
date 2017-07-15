var noble = require("noble");
var BaseRobot = require("./robot");
var logger = require("./logger");

function BaseFinder() {
	this.foundRobots = [];
	this.connectedRobots = [];
}

//scan robot by product id
BaseFinder.prototype.scan = function(productId, callback) {
	var self = this;
	
	noble.on("stateChange", function(state) {
		logger.info(this, arguments);
		
		if (state === "poweredOn") {
			noble.startScanning();
			logger.info(this, arguments, "startScanning");
		}
		else {
			callback("invalid status: "+state, null);
		}
	});
	
	noble.on("discover", function(peripheral) {
		if (BaseRobot.readProductId(peripheral) === productId) {
			var foundRobot = self.createRobot(peripheral);
			self.foundRobots.push(foundRobot);
			
			logger.info(this, arguments, "foundRobot:"+foundRobot);
			
			callback(null, self.foundRobots);
		}
	});
}

//construct the robot
BaseFinder.prototype.createRobot = function(peripheral) {
	return (new BaseRobot()).setup(peripheral);
}

//connect the robot
BaseFinder.prototype.connect = function(robot, callback) {
	var self = this;
	
	// Stop scanning in order to connect to the MiP
	// Reference: https://github.com/sandeepmistry/noble/issues/165#issuecomment-93594586
	noble.stopScanning();

	robot.connect(function(err) {
		if (err == null) {
			self.connectedRobots.push(robot);
			
			logger.info(self, arguments, "connected:"+robot);
		}
		
		callback(err);
	});
}

module.exports = BaseFinder;