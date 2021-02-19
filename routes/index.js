const express = require('express');
const router = express.Router();
const engine = require('../src/engine')
const utils = require('./utils')
const path = require('path');


const middleware = [utils.validateRequest, utils.measureTime]

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

router.post('/json', middleware, async (req, res, next) => {
  try {
    let result = await engine.getData(req.body, 'json')
    console.log(`Items: ${req.body.length}\nTime: ${end - start} ms`)
    res.send(result)
    res.end()
  } catch (error) {
    next(error)
  }
});

router.post('/text', middleware, async (req, res, next) => {
  try {
    let result = await engine.getData(req.body, 'text')
    console.log(`Items: ${req.body.length}\nTime: ${end - start} ms`)
    res.send(result)
    res.end()
  } catch (error) {
    next(error)
  }
});

module.exports = router;
