
var mysql = require('mysql');

var PRODUCTION_DB = 'ad430_db',
    DEVELOPMENT_DB = 'ad430_db'; // can later be a test db

exports.MODE_PRODUCTION = 'mode_production';
exports.MODE_DEVELOPMENT = 'mode_development';

var state = {
    pool: null,
    mode: null
};

exports.connect = function(mode) {
    state.pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        // password: 'root',
        password: '123e123e',
        database: mode === exports.MODE_PRODUCTION ? PRODUCTION_DB : DEVELOPMENT_DB
    });

    state.mode = mode;
}

exports.get = function() {
  return state.pool;
}
