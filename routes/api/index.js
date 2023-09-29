const router = require('express').Router();

const {
  getGeo,
  getWeather
}  = require('../../controllers/weather')

router.get('/city/:searchcity', async (req, res) => {
  try {
    const geo = await getGeo({city: req.params.searchcity, zip: '', zipCountry: ''})
    const weather = await getWeather(geo)
    return res.status(200).json({weather: weather, geo: geo})
  } catch (err) {
    res.status(400).json({ status: 'error', err })
  }
})

module.exports = router;