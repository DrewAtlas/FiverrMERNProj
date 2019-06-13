/* Filename:	ContactModel.js
	Purpose:	Holds the details for a contacts
				This information is persisted in the corresponding Mongo document set
	Created:	6/13/19
	Author:		Drew Topel
*/
/* jshint esversion: 6 */
/* globals require, exports */

// Stand-in for log levels
var gLevels = { Trace: "Trace", Info: "Info", Error: "Error" };
// Output log message stand-in
function gLog(msg, level, code, cat)
{
	console.log(`${level}|${code}|${msg}`);
}

var Chance = require( "chance" );
var gChance = new Chance();
const gMongoose = require("mongoose");
// Verify that we have the database connection going...
gMongo.DatabaseConnect();

// Set the upper limit of wager amount and max win amounts for eople to use when testing the SW
const docStoreName = "Contact";		// The name of the table (Document store) in Mongo

// Holds final results of a single game play
var contactSchema = gMongoose.Schema({
	mSchemaVers: Number,
	mContactId: String,		// PK for this table
	mTokenId: String,
	mName: String,
	mStartDate: Date,
	mUpdated: Date,
});

const gContactModelDataType = gMongoose.model( docStoreName, contactSchema );
exports.gContactModelDataType = gContactModelDataType;
const gSchemaVers = 1;

// At some point, need to add a check to see if contact is in the database first and then
//	do an update instead of a new add
// ------------------------------ DATABASE-RELATED Funcs ------------------------------

// Store the contact information in the database
exports.Save = function (details)
{
	let contact = new this.gContactModelDataType(
		{
			mSchemaVers:gSchemaVers,
			mContactId:details.contactId,
			mName:details.name,
			mStartDate: details.startDate,
			mUpdated: Date(),
		});

	contact.save();
	gLog(`Created new contact ${contact.mName} in ContactModel`, gLevels.Info, "CM1040");
	return contact;
};

exports.LoadAllContacts = function () {
};

// ------------------------------ ENDS DATABASE-RELATED Funcs -=----------------------------
// ------------------------------ MEMORY-Object-RELATED Funcs ------------------------------

// Constructor for the Contact which is the in-memory representation of the database table item
function Contact(inName)
{
	this.contactId = gChance.GenerateUuid();
	this.name = inName;
	this.startDate = Date();
}

// Example Setter function for this class
Contact.prototype.AddContact = function (inContact)
{
	this.contactId = inContact;
};
exports.Contact = Contact;

// ------------------------------ ENDS MEMORY-Object-RELATED Funcs -----------------------
// ------------------------------ DEBUG/DEVELOPMENT ONLY Funcs ---------------------------------

// To Allow for testing w/o a database and to make new items of this type to put into the database
//	create a fake object and return the ID we generated for it
function CreateFakeContact()
{
	let newContact = new Contact(gChance.name());
	return newContact.contactId;
}

// Create a set of contacts in memory
function CreateContactSet(nbrOfs)
{
	let contactList = [];
	for (let idx = 0; idx < nbrOfs; idx++)
	{
		contactList.push(new Contact(CreateFakeContact()));
	}

	return contactList;
}

exports.CreateContactSet = CreateContactSet;
exports.CreateFakeContact = CreateFakeContact;
