/* Filename:	Test1Controller.js
	Purpose:	Final point for the test - function on server that is called
	Created:	6/9/19
	Author:		Drew Topel
	Copyright (c) 2019 AtlasSoftwareServices. All Rights reserved
*/
// Implements the function routed here by /test1/posting
function testPost(req, res)
{
	let msg = `testPost() Reached - Got here with ${req.method} on url ${req.originalUrl} path:${req.path}`;
	console.log(msg);
	res.status(200).end(msg);
}
exports.TestPost = testPost;

// Implements the function routed here by /test1/getting
function testGet(req, res)
{
	let msg = `testGet() Reached - Got here with ${req.method} on url ${req.originalUrl} path:${req.path}`;
	console.log(msg);
	res.status(200).end(msg);
}
exports.TestGet = testGet;

// Implements the function routed here by /test1/contact
function TestContact(req, res)
{
	let msg = `testGet() Reached - Got here with ${req.method} on url ${req.originalUrl} path:${req.path}`;
	console.log(msg);
	res.status(200).end(msg);
}
exports.TestGet = testGet;
TestContact

