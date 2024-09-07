const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS; 
if (!serviceAccountPath) { 
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set'); 
}

const serviceAccount = require(path.resolve(serviceAccountPath));

admin.initializeApp({ credential: admin.credential.cert(serviceAccount), });

module.exports = admin;