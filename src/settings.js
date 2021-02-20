const DB_TABLE_NAME = 'Timestamps'
const baseUrl = 'https://api-pub.bitfinex.com/v2/candles/trade'
const timeFrame = '1m'
const symbol = 'tBTCUSD';
const limit = 1
const usdAmount = 150
const btcToSatoshi = 100000000

module.exports = {
    DB_TABLE_NAME,
    baseUrl,
    timeFrame,
    symbol,
    limit,
    usdAmount,
    btcToSatoshi
}