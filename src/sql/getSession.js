const db = require('./conn.js');
const auth = require('../twentyfour/auth.js');


const checkSession = async () => {
 //Get todays date in yyyy-mm-dd hh:mm:ss format, then convert it to a millisecond timestamp
  const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const currentTime = new Date(currentTimestamp);

const [results] = await db.promise().query('SELECT sessionId, createdAt FROM session ORDER BY createdAt DESC LIMIT 1');
console.log(results);
}

module.exports = checkSession;