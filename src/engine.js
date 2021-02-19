const fetch = require('node-fetch')
const DB = require('../DB')

const baseUrl = 'https://api-pub.bitfinex.com/v2/candles/trade'
const timeFrame = '1m'
const symbol = 'tBTCUSD';
const limit = 1

const usdAmount = 150
const btcToSatoshi = 100000000

const DB_Collection = 'BTC_at_timestamp'
const DB_map = new Map()


async function getData(timestamps, type = 'json') {
    let result = []
    try {
        switch (type) {
            case 'json':
                result = await getDataJson(timestamps)
                break;
            case 'text':
                result = await getDataTxt(timestamps)
                break;
        }
    } catch (error) {
        throw error
    }
    return result
}

function validateRequest(req, res, next) {
    let data = req.body
    if (!Array.isArray(data))
        return next(new Error('Data must be an array'))
    for (value of data) {
        if (Number.isNaN(parseInt(value)))
            return next(new Error(`All data values must be numbers. Received: ${value}`))
    }
    return next()
}

// Timestamp in milliseconds
async function fetchBtcData(timestamp) {
    let result = null
    result = {
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

async function getDataTxt(timestamps) {
    let result = []
    let jsonData = await getDataJson(timestamps)
    for (res of jsonData) {
        if (res.error == null) {
            result.push(`At ${res.dateTime}, BTC price was: ${res.price}$, ${res.amountAtTime.usdAmount}$ could get you ${res.amountAtTime.btcAmount} BTC, (or ${res.amountAtTime.satoshiAmount} Satoshis)`)
        } else {
            result.push(`Error on: ${res.timestamp}, ${res.error}`)
        }
    }
    return result
}

async function getDataJson(timestamps) {
    let result = []
    for (stamp of timestamps) {
        let docFromDB = await GetDocFromDB(stamp)
        if (docFromDB !== null) {
            result.push(docFromDB)
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
                await DB.writeDocument(DB_Collection, stamp, fetchedData)
            }
            result.push(fetchedData)
        }
    }
    return result
}

async function GetDocFromDB(docName) {
    let doc = null
    try {
        if (DB_map.has(docName)) {
            doc = DB_map.get(docName)
        }
        else {
            doc = await DB.getDocument(DB_Collection, stamp)
            if (doc !== null) {
                DB_map.set(docName, docFromDB)
            }
        }
    } catch (error) {
        throw error
    }
    return doc
}

module.exports = {
    getData,
    validateRequest
}