const router = require('express').Router();
require('dotenv').config()

const {
  getGeo,
  getWeather
}  = require('../../controllers/weather')

router.get('/city/:city', async (req, res) => {
  const geo = await getGeo({city: req.params.city, zip: '', zipCountry: ''})
  const weather = await 
  
})

module.exports = router;