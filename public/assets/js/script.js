const nowCard = $('.now-card')
const tonightCard = $('.tonight-card')
const hourlyCard = $('.hourly-card')
const hourlyGrid = $('.today-grid')
const searchForm = $('.search-form')
let countriesData = []

// get and set list of countries and country codes
fetch('https://countriesnow.space/api/v0.1/countries')
  .then(res => res.json())
  .then(data => {
    data.data.forEach(obj => {
      countriesData.push({
        country: obj.country,
        code: obj.iso2
      })
    })
  })

const openModal = (id) => $(`#${id}`).addClass('open')
const closeModal = (id) => $(`#${id}`).removeClass('open')

// get time with am and pm from unix argument
function getHourlyTime(unix) {
  const newDate = new Date(unix * 1000);
  const hour = newDate.getHours()
  hour > 12 ? time = `${hour - 12} pm` : time  = `${hour} am`
  if (hour === 0) time = `12 pm`
  return(time)
}

// append information inside now card
function fillNowCard(data) {
  nowCard.children('.loader').remove()
  let description
  data.pop !== undefined ? description = `${data.pop * 100}%` : description = data.weather[0].description
  nowCard.append(
    `<div class="flex-between">
    <p>${Math.round(data.temp)}°</p>
    <p class="gray-text">Temp</p>
  </div>

  <div class="flex-between">
    <p>${Math.round(data.feels_like)}°</p>
    <p class="gray-text">Feels Like</p>
  </div>

  <div class="flex-around">
    <div class="quick-weather-card-visual">
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" class="openweather-icon"/>
      <small>${description}</small>
    </div>

    <div class="quick-weather-card-visual">
      <img src="./assets/icons/wind.png" />
      <small>${Math.round(data.wind_speed)} mph</small>
    </div>
  </div>`
  )
}

function fillTonightCard(data) {
  tonightCard.children('.loader').remove()
  let description
  data.pop > 0 ? description = `${data.pop * 100}%` : description = data.weather[0].description
  tonightCard.append(
    `<div class="flex-between">
    <p>${Math.round(data.temp.night)}°</p>
    <p class="gray-text">Temp</p>
  </div>

  <div class="flex-between">
    <p>${Math.round(data.feels_like.night)}°</p>
    <p class="gray-text">Feels Like</p>
  </div>

  <div class="flex-around">
    <div class="quick-weather-card-visual">
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon.split('d')[0]}n@2x.png" class="openweather-icon"/>
      <small>${description}</small>
    </div>

    <div class="quick-weather-card-visual">
      <img src="./assets/icons/wind.png" />
      <small>${Math.round(data.wind_speed)} mph</small>
    </div>
  </div>`
  )
}

// append information inside hourly card
function fillHourlyCard(dataWithExtra) {
  hourlyCard.children('.loader').remove()
  let barColor
  let windOpacity
  let data
  for (i = 0; i < 9; i++) {
    data = dataWithExtra[i*2]
    i % 2 !== 0 ? barColor = '' : barColor = 'alt-element'
    if (data.wind_speed < 8) windOpacity = 0.2
    if (data.wind_speed > 7) windOpacity = 0.7
    if (data.wind_speed > 18) windOpacity = 1

    hourlyGrid.append(
      `<div class="temp-graph-element">
      <div>
        <small>${Math.round(data.temp)}°</small>
        <div class="temp-graph-bar ${barColor}" style="height: ${ Math.round( ((data.temp + 20) / 140) * 100 ) }px"></div>
        <small class="bold-small">${getHourlyTime(data.dt)}</small>
      </div>
    
      <div class="flex-col">
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" class="openweather-icon"/>
        <small>${Math.round(data.pop * 100)}%</small>
      </div>
    
      <div class="flex-col">
        <img src="./assets/icons/wind.png" style="opacity:${windOpacity}"/>
        <small>${(Math.round(data.wind_speed))} mph</small>
      </div>
    </div>`
    )

  }
}

async function displayQuickWeather(city) {
  hourlyCard.children('.loader').attr('style', 'display: block')
  const res = await fetch(`/api/city/${city}`, {
    headers: {
      'Content-Type': 'application/json', // Set the content type to JSON
    },
  })
  const data = await res.json()
  fillNowCard(data.weather.current)
  fillTonightCard(data.weather.daily[0])
  fillHourlyCard(data.weather.hourly)
  $('#city-title').text(`${data.geo.city}, ${data.geo.state}, ${data.geo.country}`)
}
displayQuickWeather(window.location.href.split('city=')[1])

$('#search-button').on('click', (e) => {
  e.preventDefault()
  searchForWeather()
})

function searchForWeather() {
  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  const input = $('#search-input').val().toLowerCase()
  const splitInput = input.split('')
  let isZip = true
  splitInput.forEach((letter) => {
    if (jQuery.inArray(letter, alphabet) !== -1) isZip = false
  })
  isZip ? getZipCountry(input) : window.location.href = `/?city=${input}`
}

function getZipCountry(zip) {
  console.log(zip)
  console.log(countriesData)
  searchForm.children('div').eq('0').children('button').remove()
  searchForm.append(`
  <div class="search-wrapper">
    <select placeholder="select country" class='country-select'>
      <option value="US">United States</option>
    </select>
    <button id="search-zip-button">Search</button>
  </div>`)
  const countrySelect = $('country-select')
  countriesData.forEach(country => {
    countrySelect.append(`<option value="${country.code}">${country.country}</option>`)
  })

  $('#search-zip-button').on('click', (e) => {
    e.preventDefault()
    window.location.href = `/?zip=${zip}&country=${countrySelect.val()}`
  })
}


