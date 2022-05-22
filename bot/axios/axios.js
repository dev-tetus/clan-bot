const axios = require('axios')
require('dotenv').config()

module.exports = axios.create({
    baseURL: 'https://api.clashofclans.com/v1',
    headers: {'Authorization': `Bearer ${process.env.COC_TOKEN}`}
  });