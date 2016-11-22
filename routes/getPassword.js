// Module dependencies
var express = require('express');

// Get database access
var db = require('../db');

var router = express.Router();

// Set up the route
router.get('/', function (req, res) {
    var userEmail = req.query.userEmail;

	getPassword(userEmail, function(data) {
		res.setHeader('Content-Type', 'application/json');
		res.json(data);
	});
});

function getPassword(userEmail, callback) {
	//Check your input is not null
	if(userEmail == undefined)
	{
		callback({ "success": false, "message": "userEmail was not supplied, but is required" });
		return;
	}
	
	//Get and start SQL Connection
    db.connect(db.MODE_DEVELOPMENT);
	userEmail = userEmail.trim();
	userEmail = userEmail.toLowerCase();
	
	//Check your input is valid with the DB
	db.get().query('SELECT COUNT(*) AS isGood FROM user WHERE LOWER(email) = ?',userEmail ,function(err,rows){
	
		//Check Hoh user id is valid
		if(rows[0].isGood == 0)
		{
			db.get().end();
			callback({ "success": false, "message": "Given userEmail cannot be found." });
			return;
		} else {
			db.get().query('SELECT hashed_password, user_id FROM user WHERE LOWER(email) = ?',userEmail ,function(err,rows){
				if (err) throw err;

				db.get().end();
				callback(rows[0]);
			});
		}
	});
}
module.exports = router;