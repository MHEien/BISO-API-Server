const db = require('./conn.js');
const auth = require('../twentyfour/auth.js');

const storeSession = async () => {
    try {
        //Check the database for the latest session that is stored, and get the timestamp.
        const lastSessionId = `SELECT createdAt FROM session ORDER BY createdAt DESC LIMIT 1`;
        const lastSessionRes = await db.query(lastSessionId);
        const lastSession = lastSessionRes[0];

        //Get current time in timestamp format
        const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const currentTime = new Date(currentTimestamp);

        //If no session was found in the database, or the last session was created more than 24 hours ago, create a new session.
        if (!lastSession || (currentTime - new Date(lastSession.createdAt) > 86400 * 1000)) {
            //Get the session id from the 24 API
            const sessionId = await auth();

            //Store the session id in the database
            const storeSession = `INSERT INTO session (sessionId, createdAt) VALUES ('${sessionId}', '${currentTimestamp}')`;
            await db.query(storeSession);
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports = storeSession;
