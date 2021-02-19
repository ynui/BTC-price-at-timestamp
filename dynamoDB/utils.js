exports.initTables = async (dynamodb) => {
    await dynamodb.listTables().promise()
        .then(async (data) => {
            if (!data.TableNames.includes('Timestamps'))
                initTableTimestamps(dynamodb)
        }).catch((error) => {
            throw error
        })
}

const initTableTimestamps = async (dynamodb) => {
    const params = {
        AttributeDefinitions: [
            {
                AttributeName: 'id',
                AttributeType: 'N'
            }
        ],
        KeySchema: [
            {
                AttributeName: 'id',
                KeyType: 'HASH'
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        },
        TableName: 'Timestamps',
        StreamSpecification: {
            StreamEnabled: false
        }
    };

    await dynamodb.createTable(params).promise()
        .then(async (data) => {
            console.log(`Timestamps table created`)
        }).catch((error) => {
            throw error
        })
}