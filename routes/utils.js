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


exports.measureTime = (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} [STARTED]`)
    const start = Date.now()
    res.on('finish', () => {
        const durationInMilliseconds = Date.now() - start
        console.log(`${req.method} ${req.originalUrl} [FINISHED] ${durationInMilliseconds} ms`)
    })
    next()
}