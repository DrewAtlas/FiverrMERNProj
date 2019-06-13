/* Filename:	TestRouter.js
	Purpose:	For anything that comes in on /test route the final function here
	Created:	6/9/19
	Author:		Drew Topel
	Copyright (c) 2019 EZ Entertainment Ltd. All Rights reserved 
*/

var gTestCont = require("./TestController");
var express = require("express");
var router = express.Router();

router.post("/posting", gTestCont.TestPost);
router.get("/getting", gTestCont.TestGet);

module.exports = router;
