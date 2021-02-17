const fetch = require('node-fetch')


const baseUrl = 'https://api-pub.bitfinex.com/v2/candles/trade'
const timeFrame = '1m'
const symbol = 'tBTCUSD';
const limit = 1

const usdAmount = 150
const btcToSatoshi = 100000000



let DB = new Map()

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
    if (DB.has(timestamp)) {
        result = DB.get(timestamp)
    }
    else {
        result = {
            timestamp: timestamp,
            dateTime: null,
            price: null
        }
        let url = `${baseUrl}:${timeFrame}:${symbol}/hist?end=${timestamp}&limit=${limit}`
        let response = await fetch(url);
        let json = await response.json();
        if (json.length > 0) {
            result.price = json[0][2]
            result.dateTime = new Date(json[0][0])
        }
        DB.set(timestamp, result)
    }
    return result
}

async function getDataTxt(timestamps) {
    let result = []
    let jsonData = await getDataJson(timestamps)
    for (res of jsonData) {
        result.push(`At ${res.dateTime}, BTC price was: ${res.price}$, ${res.amountAtTime.usdAmount}$ could get you ${res.amountAtTime.btcAmount} BTC, (or ${res.amountAtTime.satoshiAmount} Satoshis)`)
    }
    return result
}

async function getDataJson(timestamps) {
    let result = []
    for (stamp of timestamps) {
        let fetchedData = await fetchBtcData(stamp)
        if (fetchedData.price !== null) {
            let btcAmount = usdAmount / fetchedData.price
            let satoshiAmount = btcAmount * btcToSatoshi
            fetchedData.amountAtTime = {
                usdAmount: usdAmount,
                btcAmount: usdAmount / fetchedData.price,
                satoshiAmount: satoshiAmount
            }
        }
        result.push(fetchedData)
    }
    console.log(result)
    return result
}

module.exports = {
    getData,
    validateRequest
}