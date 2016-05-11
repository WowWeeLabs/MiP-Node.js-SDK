var mip = require("../index");
var mipFinder = new mip.Finder();
var MiPRobot = mip.Robot;

var readline = require("readline");
var rl = readline.createInterface(process.stdin, process.stdout);

mipFinder.scan(function(err, robots) {
	if (err != null) {
		console.log(err);
		return;
	}
	
	for (var i in robots) {
		console.log(i+": "+robots[i].name);
	}
	
	rl.question("which one: ", function(which) {
		var selectedRobot = robots[which];
		if (selectedRobot != null) {
			mipFinder.connect(selectedRobot, function(err) {
				if (err != null) {
					console.log(err);
					return;
				}
				
				var ignoreList = {"GET_STATUS":true, "GET_WEIGHT_LEVEL":true};
				var ignore = true;
				
				//setup receive data notification
				selectedRobot.enableBTReceiveDataNotification(true, function(err, data) {
					if (err) {
						console.log(err);
						return;
					}

					//convert the response by MiPCommand
					selectedRobot.convertMiPResponse(data, function(command, arr) {
						if (!ignore || ignoreList[command] === undefined || !ignoreList[command]) {
							console.log("> "+command+": "+arr);
							
							chooseOptions(options, selectedRobot, chooseOptions);
						}
					});
				});

				//command options
				var options = [	["Enable/Disable MiP Status & Weight", false, function() { ignore = !ignore; }],
								["Read Mip Status", !ignore, MiPRobot.prototype.readMipStatus, cb],
							   	["Read Mip Weight", !ignore, MiPRobot.prototype.readMipStatus, cb],
							  	["Read Hardware Version", true, MiPRobot.prototype.readMipHardwareVersion, cb],
							  	["Read Firmware Version", true, MiPRobot.prototype.readMipFirmwareVersion, cb],
							  	["Read Volume Level", true, MiPRobot.prototype.readMipVolumeLevel, cb],
							  	["Set Volume Level to Loud", false, MiPRobot.prototype.setMipVolumeLevel, 7, cb],
							  	["Set Volume Level to Zero", false, MiPRobot.prototype.setMipVolumeLevel, 0, cb],
							  	["Play Sound", false, MiPRobot.prototype.playMipSound, "ONEKHZ_500MS_8K16BIT", 0, 64, cb],
							  	["Set Chest LED to Red", false, MiPRobot.prototype.setMipChestLedWithColor, 0xff, 0x00, 0x00, 0x00, cb],
							  	["Fallover", false, MiPRobot.prototype.falloverWithStyle, "ON_BACK", cb],
							  	["Drive To Left", false, MiPRobot.prototype.driveDistanceByCm, 20, -90, cb],
							  	["Drive To Right", false, MiPRobot.prototype.driveDistanceByCm, 20, 90, cb],
							  	["Drive Toward", false, MiPRobot.prototype.driveDistanceByCm, 20, 0, cb],
							  	["Drive Backward", false, MiPRobot.prototype.driveDistanceByCm, -20, 0, cb],
							  	["Punch Left", false, MiPRobot.prototype.punchLeftWithSpeed, 24, cb],
							  	["Punch Right", false, MiPRobot.prototype.punchRightWithSpeed, 24, cb]];

				chooseOptions(options, selectedRobot, chooseOptions);
			});
		}
	});
});

function chooseOptions(options, selectedRobot, callback) {
	console.log("====================");
	for (var i in options) {
		console.log(i+": "+options[i][0]);
	}
	console.log("====================");
	rl.question("which one: ", function(which) {
		var selectedOption = options[which];
		if (selectedOption != null) {
			var o = selectedOption;
			var waitReadline = o[1];

			//dynamic binding from option
			selectedOption[2].call(selectedRobot, o[3], o[4], o[5], o[6], o[7], o[8], o[9], o[10], o[11], o[11]);
			
			if (!waitReadline) {
				callback(options, selectedRobot, callback);
			}
		}
	});
}

function cb(err) {
}