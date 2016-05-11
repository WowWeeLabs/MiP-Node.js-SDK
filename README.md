## MiP-Node.js-SDK
MiP-Node.js-SDK is MiP SDK for node.js

### Installation
`npm install mipnode`

### How to use
```
var mipnode = require("mipnode");
var mipFinder = new mipnode.Finder();

mipFinder.scan(function(err, robots) {
	if (err != null) {
		console.log(err);
		return;
	}
	
	//connect to first mip
	var selectedMip = robots[0];
	mipFinder.connect(selectedMip, function(err) {
		if (err != null) {
			console.log(err);
			return;
		}
		
		console.log("connected");
		
		//move toward
		selectedMip.driveDistanceByCm(20, 0, function(err) {
			console.log("moving toward");
		});
	});
});
```

### Example
`node example/mip.js` to execute the demo with simple commands

### Debug Mode
Logger is used by debug `npm install debug`

- `DEBUG=mip* node example/mip.js` show more logs for mipnode library

- `DEBUG=* node example/mip.js` show all logs for mipnode & noble librayies