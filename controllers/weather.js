const router = require('express').Router();

async function getGeo(req) {
  try {
    let apiUrl
    (req.city) 
      ? apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${req.city}&limit=1&appid=${process.env.API_KEY}` 
      : apiUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${req.zip},${zip.zipCountry}&appid={API key}`
  
    const geo = await fetch(apiUrl)
    const geoData = await geo.json()
    return {lat: geoData[0].lat, lon: geoData[0].lon}

  } catch (err) {
    if( process.env.NODE_ENV === "development") console.log(err)
    throw err
  }
}

async function getWeather(req) {
  try {
    let apiUrl = ``
    const weather = await fetch(apiUrl)
  }
}

module.exports = {
  getGeo,
}