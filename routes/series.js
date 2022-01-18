const express = require('express')
const Serie = require('../models/series')
const jwt = require('jsonwebtoken')

const router = express.Router()

const jwtSecret = '123abc123abc123abc'

router.use(async (req, res, next) => {
  const token = req.headers['x-access-token'] || req.body.token || req.query.token
  if(token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      if(payload.roles.indexOf('restrito')>=0) {
        next()
      } else {
        res.send({ success: false })
      }
    } catch (e) {
      res.send({ success: false })
    }
  } else {
    res.send({ success: false })
  }
})

router.get('/', async (req, res) => {
  const series = await Serie.find({})
  res.send(series)
})

router.get('/:id', async (req, res) => {
  const serie = await Serie.findOne({ _id: req.params.id })
  res.send(serie)
})

router.post('/', async (req, res) => {
  const serie = new Serie(req.body)
  try {
    await serie.save()
    res.send(serie)
  } catch (e) {
    res.send({
      success: false,
      errors: Object.keys(e.errors)
    })
  }
})

router.put('/:id', async (req, res) => {
  const serie = await Serie.findOne({ _id: req.params.id })
  serie.name = req.body.name
  serie.status = req.body.status
  try {
    await serie.save()
    res.send(serie)
  } catch (e) {
    res.send({
      success: false,
      errors: Object.keys(e.errors)
    })
  }
})

router.delete('/:id', async (req, res) => {
  await Serie.deleteOne({ _id: req.params.id})
  res.send({
    success: true
  })
})

module.exports = router