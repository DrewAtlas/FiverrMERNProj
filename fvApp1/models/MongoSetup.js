/* 
Filename:	MongoSetup.js (Models directory)
Purpose:	Get the database up in a standard way
Author:		Drew Topel
*/
/* eslint-disable camelcase */
/* jshint esversion: 6 */
/* globals require, exports, process, global */

require("dotenv").config();
const mongoose = require("mongoose");

var gMongoDbConn;			// Global to hold the connection - only setup once

// Stand-in for log levels
var gLevels = { Trace: "Trace", Error: "Error" };
// Output log message stand-in
function gLog(msg, level, code, cat)
{
	console.log(`${level}|${code}|${msg}`);
}

// Construct the URI to the database using either details in the .env file or ... not
function GetMongooseConnectionUrl()
{
	// Set up mongoose connection
	const dbBase = process.env.MONGOOSE_URL || "mongodb+srv://aUser:aUserPw@atlastestcluster-v2sdl.mongodb.net/";
	// Put the database name and parameters separate so that I can use a different DB later...
	const dbName = process.env.MONGOOSE_DBNAME || "Demo";
	const dbParams = process.env.MONGOOSE_PARAMS || "?retryWrites=true";

	return dbBase + dbName + dbParams;
}
// Get the database connected and running for our models to live in..
function DatabaseConnect()
{
	if (gMongoDbConn)
	{
		gLog("Mongoose Already initialized, skipping re-initialization", gLevels.Trace, "MS1010", "DbMessages");
		return;
	}
	
	const mDbUrl = GetMongooseConnectionUrl();
	mongoose.set("useCreateIndex", true);

	gMongoDbConn = mongoose.connection;
	//Bind connection to error event (to get notification of connection errors)
	gMongoDbConn.on(
		"error", function (error)
		{
			gLog("Mongoose connection: error! " + error, gLevels.Error, "MS1020");
			mongoose.disconnect();
		}
	);
	gMongoDbConn.on(
		"connected", function ()
		{
			gLog("Mongoose connection: Connected to " + mDbUrl, gLevels.Trace, "MS1040", "DbMessages");
		}
	);
	gMongoDbConn.on(
		"open", function ()
		{
			gLog("Mongoose Connection Open", gLevels.Trace, "MS1060", "DbMessages");
		}
	);
	gMongoDbConn.on(
		"reconnected", function ()
		{
			gLog("Mongoose connection reconnected", gLevels.Trace, "MS1080", "DbMessages");
		}
	);

	//Set up default mongoose connection
	mongoose.connect(mDbUrl, {
		poolSize: 2,
		promiseLibrary: global.Promise,
		useNewUrlParser: true,
		auto_reconnect: true
	});

	gLog("Mongoose connection started", gLevels.Trace, "MS1100", "DbMessages");

	process.on("SIGINT", function () 
	{
		gMongoDbConn.close(function () 
		{
			console.log(
				mongoose.termination(
					"Mongoose default connection is disconnected due to application termination"
				)
			);
			process.exit(0);
		});
	});
}

exports.DatabaseConnect = DatabaseConnect;
exports.db = gMongoDbConn;

