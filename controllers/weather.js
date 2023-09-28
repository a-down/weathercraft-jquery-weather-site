const router = require('express').Router();
const apiKey = process.env.API_KEY

async function getGeo(req) {
  try {
    let apiUrl
    (req.city) 
      ? apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${req.city}&limit=1&appid=${apiKey}` 
      : apiUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${req.zip},${zip.zipCountry}&appid=${apiKey}`
  
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
    let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?exclude=minutely&units=imperial&lat=${req.lat}&lon=${req.lon}&appid=${apiKey}`
    const weather = await fetch(apiUrl)
    return weatherData = await weather.json()

  } catch (err) {
    if( process.env.NODE_ENV === "development") console.log(err)
    throw err
  }
}

module.exports = {
  getGeo,
  getWeather,
}