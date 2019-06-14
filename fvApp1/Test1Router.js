/* Filename:	TestRouter.js
	Purpose:	For anything that comes in on /test? route the final function here
	Created:	6/9/19
	Author:		Drew Topel
	Copyright (c) 2019 AtlasSoftwareServices. All Rights reserved 
*/

var gTestCont = require("./Test1Controller");
var express = require("express");
var router = express.Router();

router.get("/getting", gTestCont.TestGet);
router.get("/contact", gTestCont.TestContact);
router.post("/posting", gTestCont.TestPost);

module.exports = router;
