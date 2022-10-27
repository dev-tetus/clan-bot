const axios = require('axios')

module.exports = axios.create({
    baseURL: 'https://api.clashofclans.com/v1',
    headers: {'Authorization': `Bearer ${process.env.COC_TOKEN}`}
  });