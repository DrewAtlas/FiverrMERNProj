/* Filename: nodeApp1Start.js
	Purpose:	For the test server, allow it to understand a route to be sure
				that acessing it from the public works
	Author:	Drew Topel
	Created: 6/9/19
	Copyright (c) 2019 AtlasSoftwareServices. All Rights reserved
*/
/* jshint esversion: 8 */
/* globals require, process, exports */
require("dotenv").config();
let port = process.env.Test1_Port;
if (!port)
	throw new Exception("NO PORT!");
// Get the express components ready
const express = require("express");
const bp = require("body-parser");
const cors = require("cors");

function expressStartup(serverName, port)
{
	let app = express();
	
	app.use(cors());
	app.use(bp.urlencoded({ extended: false }));
	app.use(bp.json());
	
	app.use("/test1", require("./Test1Router"));
	
	app.listen(port, "0.0.0.0", err => 
	{
		if (err) console.error(err);
		console.log(`EZSS1000| ${serverName} listening for Requests on port: ${port}`);
	});
}

// Start up the test node app
require("dotenv").config();
//let port = process.env.Test1_Port;
if (!port)
	throw new Exception("NO PORT!");
expressStartup("NodeTest1", port);




