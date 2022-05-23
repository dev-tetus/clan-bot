const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.get('api/v1/test', function (req, res) {
  res.send('Hello World')
})

app.listen(3000,() =>{
  console.log('Listening on port 3000');
})