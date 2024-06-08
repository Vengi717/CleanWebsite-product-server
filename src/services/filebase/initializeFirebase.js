// initializeFirebase.js
const admin = require('firebase-admin');

const serviceAccount = require('../../../firebasePRIVATEKEY.json'); // Update with the correct path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'v3-erm.appspot.com', // Replace with your storage bucket URL
});

const storage = admin.storage();

module.exports = storage;
