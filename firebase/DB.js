const { firebase, admin } = require('./fbConfig');

const db = admin.firestore()

async function putDocument(collection, document, data) {
    let success = false
    try {
        await db.collection(collection).doc(document.toString()).set(data)
        success = true
    } catch (error) {
        throw error
    }
    return success
}

async function updateDocument(collection, document, data) {
    let success = false
    try {
        await db.collection(collection).doc(document.toString()).update(data)
        success = true
    } catch (error) {
        console.error('Error updating ' + collection + document + data)
        throw error
    }
    return success
}

async function getDocument(collection, document) {
    let result = null
    let docRef = db.collection(collection).doc(document.toString())
    let doc = await docRef.get()
    if (doc.exists) result = doc.data()
    return result
}


async function getCollection(collection) {
    let result = null
    try {
        let colRef = db.collection(collection)
        let col = await colRef.get()
        result = col.docs.map(doc => doc.data())
    } catch (error) {
        throw error
    }
    return result
}

async function deleteDocument(collection, document) {
    let result = false
    try {
        let docRef = db.collection(collection).doc(document.toString())
        await docRef.delete()
        result = true
    } catch (error) {
        throw error
    }
    return result
}

async function isDocAlreadyExists(collection, document) {
    let doc = await getDocument(collection, document)
    return (doc !== null)
}

module.exports = {
    putDocument,
    updateDocument,
    getDocument,
    getCollection,
    deleteDocument,
    isDocAlreadyExists
};