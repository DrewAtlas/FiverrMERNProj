/* Filename:	MERNDemo.js
	Purpose:	Write out the HTML for a simple test interface
	Created:	6/9/19
	Author:		Drew Topel
	Copyright (c) 2019 AtlasSoftwareServices. All Rights reserved
*/

/* createTestSet()
	Purpose:	Create a test button in the interface consisting of a container Div in which
				we have a button (class="playBut") and an output div (class="outFld"). The
				button has a unique id that also contains the informatoin needed to target the
				correct function on the server when hit. See the .click() function for more on that
	Inputs:		the set to which the button belongs (1 or 2),
				the type of operation that the button is designed to do ("get" or "post")
	Returns:	the markup for this button and text output as described.
*/
function createTestSet(set, abut)
{
	return `<div class="colContainer"><div id="a${set}${abut}" class="playBut fields">App ${set} Test ${abut}</div><div id="out${set}${abut}" class="outFld fields"></div></div>`;
}

// Stand-in for log levels
var gLevels = { Trace: "Trace", Info: "Info", Error: "Error" };
// Output log message stand-in
function gLog(msg, level, code, cat)
{
	console.log(`${level}|${code}|${msg}`);
}

/* ServerCall()
	Purpose:	Perform a call to a node server that is set up specifically for the tests we are performing here.
				They are numbered 1 and 2 and the calls that they perform also have this number designation.
	Inputs:		the number of the server to call (1,2)
				the route of call (i.e. the final route after the /test1, e.g. 'getting' - what is in testRouter.js
				the type of call to make ("Get", "Post")
				<optional> data to send (if it is a post)
	Returns:	a promise that is fulfilled or rejected based on the call results
*/
var gLastUrl;
function ServerCall(serverNum, route, theType, inputData)
{
	// Based on the server number we know the URL and the port
	let host = "localhost";
	let ports = [3100, 4100];	// Hard code in the ports for now...
	let func = `test${serverNum}/${route}`;
	let url = `http://${host}:${ports[serverNum-1]}/${func}`;
	gLastUrl = url;

	let jqxhr;
	gLog(`Executing a ${theType} call to url ${url}`, gLevels.Trace, "PC1260", "GameCommands");
	return new Promise(function (resolve, reject)
	{
		switch (theType.toLowerCase())
		{
			case "get":
				jqxhr = $.get(url, resolve);
				break;
			case "post":
				jqxhr = $.post(url, inputData, resolve);
				break;
		}

		// Add the failure callback to the promise
		jqxhr.fail(function (data)
		{
			reject(data);
		});
	});
}

function ShowResult(msg, level, outName )
{
	$(".outFld").each(function (elem)
	{
		this.classList.remove("showResult");
		this.innerHTML = "";
	});
	gLog(msg, level, "PC1290");
	$("#" + outName).html(msg);
	$("#" + outName)[0].classList.add("showResult");
}

function SetupTestButs()
{
	let buts = ["post", "get", "query"];
	let buts2 = ["post", "get"];
	
	let html = '<label class="columnTitle">App1 Controls</label>';
	buts.forEach(function (abut)
	{	// Setup test buttons for fvApp1 callbacks
		html += createTestSet(1, abut);
	});
	html += '<label class="columnTitle">App2 Controls</label>';
	buts2.forEach(function (abut)
	{	// Test buttons for fvApp2
		html += createTestSet(2, abut);
	});
	$("#MainContent").html(html);

	let prom;

	$(".playBut").click(function (evt)
	{
		switch (this.id)
		{
			case "a1post":
				prom = ServerCall(1, "posting", "Post", "Some Data");
				break;
			case "a1get":
				prom = ServerCall(1, "getting", "Get");
				break;
			case "a1query":
				prom = ServerCall(1, "contact", "Get");
				break;
			case "a2post":
				prom = ServerCall(2, "posting", "Post", "Some Data");
				break;
			case "a2get":
				prom = ServerCall(2, "getting", "Get");
				break;
		}

		let msg;
		let outName = this.id.replace("a", "out");
		let level = gLevels.Trace;
		prom.then(function (data)
		{
			ShowResult("Good Data: " + data, gLevels.Trace, outName);
		}).catch(function (errData)
		{
			ShowResult(`${errData.message} Comms to url: ${gLastUrl} Failed`, gLevels.Error, outName);
		});
	});
}


(function ()
{
	SetupTestButs();
}());
