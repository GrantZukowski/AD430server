
//Creates a new convo and checks the input is valid
module.exports = function() { 
	this.createConvo = function (hohUserId, interpreterUserId, callback) {
		//Check your input is not null
		if(hohUserId == undefined)
		{
			callback({ "success": false, "message": "hohUserId was not supplied, but is required" });
			return;
		}
		if(interpreterUserId == undefined)
		{
			callback({ "success": false, "message": "interpreterUserId was not supplied, but is required" });
			return;
		}
	
		//Get and start SQL Connection
		var con = getConnection();
		con.connect();
	
		//Check your input is valid with the DB
		con.query('SELECT COUNT(*) AS isGood FROM user WHERE user_id = ? AND is_interpreter = 0',hohUserId ,function(err,rows){
	
			//Check Hoh user id is valid
			if(rows[0].isGood == 0)
			{
				con.end();
				callback({ "success": false, "message": "Given hohUserId cannot be found or is not a hoh user." });
				return;
			} else {
				con.query('SELECT COUNT(*) AS isGood FROM user WHERE user_id = ? AND is_interpreter = 1',interpreterUserId ,function(err,rows){

					//Check interpreter user id is valid
					if(rows[0].isGood == 0)
					{	
						con.end();
						callback({ "success": false, "message": "Given interpreterUserId cannot be found or is not a interpreter user." });
						return;
					} else {
						//Insert in the new convo
						var convo = {
							start_time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
							hoh_user_id: hohUserId,
							interpreter_user_id: interpreterUserId,
							last_updated_hoh: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
							last_updated_interpreter: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
						};
						con.query('INSERT INTO convo SET ?', convo, function(err,res){
							console.log(err);
							console.log(res);
							callback({ "success": true, "convo_id": res.insertId });
							return;
						});
					}
				});
			}
		});
	};
}