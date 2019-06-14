/* Filename:	Test1Controller.js
	Purpose:	Final point for the test - function on server that is called
	Created:	6/9/19
	Author:		Drew Topel
	Copyright (c) 2019 AtlasSoftwareServices. All Rights reserved
*/
var gContactModel = require("./models/ContactModel");
var gChance = require("chance");

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


/* Database Access functions
	the minimum needed to make sure there is at least one record in the contacts document list in Mongo
	so we can retrieve it when needed later
*/
function CreateContact(contactData)
{
	let aName = (contactData && contactData.name) ? contactData : gChance.name();
	let contact = new gContactModel.gContactModelDataType(aName);
	return contact;
}

// See if a contact with the attributes found in the passed object exists in the Mongo contact document list
function CheckForContact(contactData)
{	// Only the name is of interest
	let aName = (contactData && contactData.name) ? contactData : null;
	if (aName)
	{	// A name was passed in, see if it is in the DB
		let oneContact = gContactModel.Load({ name: aName });
		console.log(`Found contact with name ${aName}`);
		return oneContact;
	}
	else
	{	// Just get a count of the contacts in the DB
		let allContacts = gContactModel.LoadAll();
		let count = (allContacts) ? allContacts.length : 0;
		console.log(`Didn't find ${aName}, so I loaded all. There are ${count} contacts total`);
		return allContacts;
	}
}

// Implements the function routed here by /test1/contact
//	Here we will access the Mongo DB to return a document
function testContact(req, res)
{
	let msg = `testContact() Reached - Got here with ${req.method} on url ${req.originalUrl} path:${req.path}`;
	// Modify this to search and get a contact with passed ID
	console.log(msg);
	let result = CheckForContact({ name: "George" });
	if (!result)
	{
		msg = "No results when checking for a contact";
	}
	else
	{
		if (typeof result == "array")
		{
			msg = `Found ${result.length} contacts in databse!`;
		}
		else
		{
			if (typeof result == "object")
			{
				msg = `Found a contact with name ${result.name}`;
			}
			else	// This will print out the whole object
			{
				msg = "Error searching for contact";
				console.log("Unexpected result from database contact search", result);
			}
		}
	}
	console.log(msg);
	res.status(200).end(msg);
}
exports.TestContact = testContact;


