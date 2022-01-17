const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.Promise = global.Promise

const port = process.env.PORT || 3000
const mongo = process.env.MONGODB || 'mongodb://localhost/minhas-series'

const series = require('./routes/series')

app.use('/series', series)

mongoose
  .connect(mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(port, () => {
      console.log('Listening on port: ' + port)
    })
  })
  .catch( e => {
    console.log(e)
  })