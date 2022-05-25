const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())



app.get('/api', function (req, res) {
  res.send('Hello World')
})

app.get('/api/test', function (req, res) {
  res.send('Hello toi')
})

app.listen(3000,() =>{
  console.log('Listening on port 3000');
})