const AWS = require("aws-sdk");
const config = require('./config');


AWS.config.update(config.config.aws_remote_config);

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

config.initTables(dynamodb)

async function putDocument(tableName, id, data) {
    let result = null
    try {
        const params = {
            TableName: tableName,
            Key: {id: id},
            Item: data
        };
        await docClient.put(params).promise()
            .then(async (data) => {
                if (data.Item)
                    result = data.Item
            }).catch((error) => {
                throw error
            })
    } catch (error) {
        throw error
    }
    return result
}

async function getDocument(tableName, id) {
    let result = null
    try {
        const params = {
            TableName: tableName,
            Key: { id: id }
        };
        await docClient.get(params).promise()
            .then(async (data) => {
                if (data.Item)
                    result = data.Item
            }).catch((error) => {
                throw error
            })
    } catch (error) {
        throw error
    }
    return result
}


module.exports = {
    putDocument,
    getDocument
}
