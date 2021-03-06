const fetch = require('node-fetch')

const DB = require('../dynamoDB/DB')
const dataMap = new Map()

const {
    DB_TABLE_NAME,
    baseUrl,
    timeFrame,
    symbol,
    limit,
    usdAmount,
    btcToSatoshi
} = require('./settings')

exports.getData = async (timestamps, type = 'json') => {
    let result = []
    let newData = null
    try {
        for (stamp of timestamps) {
            let jsonData = await getDataJson(stamp)
            switch (type) {
                case 'json':
                    newData = jsonData
                    break;
                case 'text':
                    newData = jsonDataToText(jsonData)
                    break;
                default:
                    throw new Error(`Type: ${type} is undefined in the system`)
                    break;
            }
            result.push(newData)
            newData = null
        }
    } catch (error) {
        throw error
    }
    return result
}

// Timestamp in milliseconds
async function fetchBtcData(timestamp) {
    let result = null
    result = {
        id: timestamp,
        timestamp: timestamp,
        dateTime: null,
        price: null,
        error: null
    }
    let url = `${baseUrl}:${timeFrame}:${symbol}/hist?end=${timestamp}&limit=${limit}`
    let response = await fetch(url);
    let json = await response.json();
    if (json.length > 0) {
        if (json[0] === 'error') {
            result.error = json[2]
        } else {
            result.price = json[0][2]
            result.dateTime = new Date(json[0][0]).toString()
        }
    } else {
        result.error = 'Could not get any data'
    }
    return result
}

function jsonDataToText(data) {
    let result = null
    if (data.error == null) {
        result = `At ${data.dateTime}, BTC price was: ${data.price}$, ${data.amountAtTime.usdAmount}$ could get you ${data.amountAtTime.btcAmount} BTC, (or ${data.amountAtTime.satoshiAmount} Satoshis)`
    } else {
        result = `Error on query: '${data.timestamp}', Error: '${data.error}'`
    }
    return result
}

async function getDataJson(timestamp) {
    let result = null
    let docFromDB = await GetDocFromDB(timestamp)
    if (docFromDB !== null) {
        result = docFromDB
    }
    else {
        let fetchedData = await fetchBtcData(stamp)
        if (fetchedData.error == null) {
            let btcAmount = usdAmount / fetchedData.price
            let satoshiAmount = btcAmount * btcToSatoshi
            fetchedData.amountAtTime = {
                usdAmount: usdAmount,
                btcAmount: usdAmount / fetchedData.price,
                satoshiAmount: satoshiAmount
            }
            await DB.putDocument(DB_TABLE_NAME, stamp, fetchedData)
        }
        result = fetchedData
    }
    return result
}

async function GetDocFromDB(docName) {
    let result = null
    try {
        if (dataMap.has(docName)) {
            result = dataMap.get(docName)
        }
        else {
            let DB_result = await DB.getDocument(DB_TABLE_NAME, stamp)
            if (DB_result !== null) {
                result = DB_result
                dataMap.set(docName, result)
            }
        }
    } catch (error) {
        throw error
    }
    return result
}