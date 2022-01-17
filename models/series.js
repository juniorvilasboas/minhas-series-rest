const mongoose = require('mongoose')

const SerieSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enumValues: [ 'to-watch', 'watching', 'watched' ]
  },
  comments: []
})

const Serie = mongoose.model('Serie', SerieSchema)

module.exports = Serie