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
const gMongo = require("./MongoSetup");
gMongo.DatabaseConnect();

// Set the upper limit of wager amount and max win amounts for eople to use when testing the SW
const contactDbName = "Contact";		// The name of the table (Document store) in Mongo

// Holds final results of a single game play
var contactSchema = gMongoose.Schema({
	mSchemaVers: Number,
	mContactId: String,		// PK for this table
	mTokenId: String,
	mName: String,
	mStartDate: Date,
	mUpdated: Date,
});

const gContactModelDataType = gMongoose.model( contactDbName, contactSchema );
exports.gContactModelDataType = gContactModelDataType;
const gSchemaVers = 1;
exports.gContactDbName = contactDbName;

// At some point, need to add a check to see if contact is in the database first and then
//	do an update instead of a new add
// ------------------------------ DATABASE-RELATED Funcs ------------------------------

// Store the contact information in the database, if no details are passed in we make up a random contact
exports.Save = function (details)
{
	let contact = new this.gContactModelDataType(
		{
			mSchemaVers:gSchemaVers,
			mContactId: (details.contactId || gChance.id()),
			mName: (details.name || gChance.name()),
			mStartDate: (details.startDate || gChance.date()),
			mUpdated: Date()
		});

	contact.save().then(function (data)
	{
		let msg = `Successfully created and stored new contact ${contact.mName} in db ${contactDbName}`;
		gLog(msg, gLevels.Info, "CM1040");
		return contact;
	}).catch(function (errData)
	{
		let msg = `Error ${errData.message} when trying to save new contact ${contact.mName} in db ${contactDbName}`;
		gLog(msg, gLevels.Error, "CM1060");
	});	
};

// Execute a find for a contact object using the criteria in the findObj
exports.Load = function (findobj) 
{
	gMongo.db.collection(contactDbName).findOne(findobj), function (err, result)
	{
		if (err)
			throw err;
		return result;
	}
};

exports.LoadAll = function ()
{	// By doing a search for nothing, all the contacts will be returned
	return this.Load();
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
