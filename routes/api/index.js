const router = require('express').Router();
require('dotenv').config()

const {
  getGeo,
  getWeather
}  = require('../../controllers/weather')

router.get('/city/:city', async (req, res) => {
  try {
    const geo = await getGeo({city: req.params.city, zip: '', zipCountry: ''})
    const weather = await getWeather(geo)
    return res.status(200).json(weather)
  } catch (err) {
    res.status(400).json({ status: 'error', err })
  }
})

module.exports = router;