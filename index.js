const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const series = [
  { name: 'Friends' },
  { name: 'Breaking Bad' }
]

app.get('/series', (req, res) => res.send(series))

app.listen(port, () => console.log('Listening on port: ' + port))