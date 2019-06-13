/* Filename:	TestController.js
	Purpose:	Final point for the test - function on server that is called
	Created:	6/9/19
	Author:		Drew Topel
	Copyright (c) 2019 EZ Entertainment Ltd. All Rights reserved 
*/
// Implements the function routed here by /test/posting
function testPost(req, res)
{
	let msg = `testPost() Reached - Got here with ${req.method} on url ${req.originalUrl} path:${req.path}`;
	console.log(msg);
	res.status(200).end(msg);
}
exports.TestPost = testPost;

// Implements the function routed here by /test/getting
function testgetwithroute(req, res)
{
	let msg = `testgetwithroute() Reached - Got here with ${req.method} on url ${req.originalUrl} path:${req.path}`;
	console.log(msg);
	res.status(200).end(msg);
}
exports.TestGet = testgetwithroute;


