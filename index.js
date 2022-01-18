const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors')
require('dotenv').config()

const User = require('./models/user')

const users = require('./routes/users')
const series = require('./routes/series')

const app = express()

mongoose.Promise = global.Promise

const port = process.env.PORT || 3000
const mongo = process.env.MONGODB || 'mongodb://localhost/minhas-series'
const jwtSecret = '123abc123abc123abc'

app.use(bodyParser.json())
app.use(cors({
  origin: (origin, callback) => {
    if(origin === 'http://server2:8080') {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by Cors'))
    }
  }
}))

app.use('/users', users)
app.use('/series', series)

app.post('/auth', async (req, res) => {
  const user = req.body
  const userDb = await User.findOne({ username: user.username })
  if(userDb) {
    if(userDb.password === user.password) {
      const payload = {
        id: userDb._id,
        username: userDb.username,
        roles: userDb.roles
      }

      jwt.sign(payload, jwtSecret, (err, token) => {
        res.send({
          success: true,
          token: token
        })
      })
    } else {
      res.send({
        success: false,
        message: 'Wrong Credentials'
      })
    }
  } else {
    res.send({
      success: false,
      message: 'Wrong Credentials'
    })
  }
})

const createInitialUsers = async() => {
  const total = await User.count({})
  if(total===0) {
    const user = new User({
      username: 'moacyr',
      password: '123456',
      roles: [ 'admin', 'restrito' ]
    })
    await user.save()

    const user2 = new User({
      username: 'restrito',
      password: '123456',
      roles: ['restrito']
    })
    await user2.save()
  }
}

mongoose
  .connect(mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    createInitialUsers()
    app.listen(port, () => {
      console.log('Listening on port: ' + port)
    })
  })
  .catch( e => {
    console.log(e)
  })