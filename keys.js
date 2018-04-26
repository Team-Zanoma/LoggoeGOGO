const keys = require('./config.js');
module.exports = {
  host     : process.env.host || keys.host,
  user     : process.env.user || keys.user,
  database : process.env.database || keys.database,
  password : process.env.password || keys.password
}