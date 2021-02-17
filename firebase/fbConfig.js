const firebase = require('firebase')
const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey');

const firebaseConfig = {
    apiKey: "AIzaSyDk-IrcmKAz5tO-pfNT-onnxqmAQh63EM4",
    authDomain: "zengo-a028b.firebaseapp.com",
    projectId: "zengo-a028b",
    storageBucket: "zengo-a028b.appspot.com",
    messagingSenderId: "588249292362",
    appId: "1:588249292362:web:40f9a4bd5d2339a9c610b3"
  };

firebase.initializeApp(firebaseConfig);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = { firebase, admin };