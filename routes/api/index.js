const router = require('express').Router();

const {
  getGeo,
  getWeather,
  getState
}  = require('../../controllers/controllers')

router.get('/city/:searchcity', async (req, res) => {
  try {
    const geo = await getGeo({city: req.params.searchcity})
    const weather = await getWeather(geo)
    return res.status(200).json({weather: weather, geo: geo})
  } catch (err) {
    res.status(400).json({ status: 'error', err })
  }
})

router.get('/zip/:zip/country/:country', async (req, res) => {
  try {
    const geoWithoutState = await getGeo({zip: req.params.zip, zipCountry: req.params.country})
    const geo = await getState(geoWithoutState)
    const weather = await getWeather(geo)
    return res.status(200).json({weather: weather, geo: geo})
  } catch (err) {
    res.status(400).json({ status: 'error', err })
  }
})

module.exports = router;