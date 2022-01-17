const express = require('express')
const Serie = require('../models/series')

const router = express.Router()

router.get('/', async (req, res) => {
  const series = await Serie.find({})
  res.send(series)
})

router.get('/:id', (req, res) => {
  res.send(req.params.id)
})

module.exports = router