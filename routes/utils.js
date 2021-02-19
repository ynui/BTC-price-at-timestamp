exports.validateRequest = (req, res, next) => {
    let data = req.body
    if (!Array.isArray(data))
        return next(new Error('Data must be an array'))
    for (value of data) {
        if (Number.isNaN(parseInt(value)))
            return next(new Error(`All data values must be numbers. Received: ${value}`))
    }
    return next()
}

const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9
    const NS_TO_MS = 1e6
    const diff = process.hrtime(start)

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

exports.measureTime = (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} [STARTED]`)
    const start = process.hrtime()
    res.on('finish', () => {
        const durationInMilliseconds = getDurationInMilliseconds(start)
        console.log(`${req.method} ${req.originalUrl} [FINISHED] ${durationInMilliseconds.toLocaleString()} ms`)
    })
    next()
}