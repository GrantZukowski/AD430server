//Update the last ping time for an convo with the HOH User4
module.exports = function() { 
	this.updateConvoHOH = function (hohUserId, ConvoId, callback)
	{
		//Check your input is not null
		if(hohUserId == undefined)
		{
			callback({ "success": false, "message": "hohUserId was not supplied, but is required" });
			return;
		}
		if(ConvoId == undefined)
		{
			callback({ "success": false, "message": "ConvoId was not supplied, but is required" });
			return;
		}
	
		//Get and start SQL Connection
		var con = getConnection();
		con.connect();
	
		//Check your input is valid with the DB
		con.query('SELECT COUNT(*) AS isGood FROM user WHERE user_id = ? AND is_interpreter = 0', hohUserId, function(err,rows){
			//Check Hoh user id is valid
			if(rows[0].isGood == 0)
			{
				con.end();
				callback({ "success": false, "message": "Given hohUserId cannot be found or is not a hoh user." });
				return;
			} else {
				con.query('SELECT COUNT(*) AS isGood FROM convo WHERE convo_id = ? AND hoh_user_id = ?', [ConvoId, hohUserId] , function(err,rows){
	
					//Check interpreter user id is valid
					if(rows[0].isGood == 0)
					{
						con.end();
						callback({ "success": false, "message": "Given ConvoId cannot be found or did not belong to the given HOH user." });
						return;
					} else {
						con.query('UPDATE convo SET last_updated_hoh = NOW() WHERE convo_id = ?', ConvoId, function(err,res){
							if(err) {
								callback({ "success": false, "message": "something went wrong in the db." });
							}
							console.log(err);
							console.log(res);
							callback({ "success": true, "convo_id": ConvoId });
							return;
						});
					}
				});
			}
		});
	};
}