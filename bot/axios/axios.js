const axios = require('axios')


function axiosBase(){
  return axios.create({
    baseURL: 'https://api.clashofclans.com/v1',
    headers: {'Authorization': `Bearer ${process.env.COC_TOKEN}`}
  });
}   
function axiosInternal(){
  return axios.create({
    baseURL: 'http://reverse-proxy/',
  });
}
module.exports ={
  axiosBase,
  axiosInternal
}