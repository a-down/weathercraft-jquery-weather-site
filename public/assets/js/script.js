const nowCard = $('.now-card')
const tonightCard = $('.tonight-card')
const hourlyGrid = $('.today-grid')

function getHourlyTime(unix) {
  const newDate = new Date(unix * 1000);
  const hour = newDate.getHours()
  hour > 12 ? time = `${hour - 12} pm` : time  = `${hour} am`
  if (hour === 0) time = `12 pm`
  return(time)
}

// append information inside now card
function fillNowCard(data) {
  console.log(data.weather.icon)
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
      <small>${data.weather[0].description}</small>
    </div>

    <div class="quick-weather-card-visual">
      <img src="./assets/icons/wind.png" />
      <small>${Math.round(data.wind_speed)} mph</small>
    </div>
  </div>`
  )
}

function fillTonightCard(data) {
  console.log(data)
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
      <small>${data.weather[0].description}</small>
    </div>

    <div class="quick-weather-card-visual">
      <img src="./assets/icons/wind.png" />
      <small>${Math.round(data.wind_speed)} mph</small>
    </div>
  </div>`
  )
}

// append information inside hourly card
function fillHourlyCard(data) {
  console.log(data)
  let barColor

  for (i = 0; i < 9; i++) {
    i % 2 !== 0 ? barColor = '' : barColor = 'alt-element'
    console.log(Math.round( (((data[i*2] + 20) / 140) * 100) ))
    hourlyGrid.append(
      `<div class="temp-graph-element">
      <div>
        <small>${Math.round(data[i*2].temp)}°</small>
        <div class="temp-graph-bar ${barColor}" style="height: ${ Math.round( ((data[i*2].temp + 20) / 140) * 100 ) }px"></div>
        <small class="bold-small">${getHourlyTime(data[i*2].dt)}</small>
      </div>
    
      <div class="flex-col">
        <img src="https://openweathermap.org/img/wn/${data[i*2].weather[0].icon}@2x.png" class="openweather-icon"/>
        <small>${data[i*2].pop * 100}%</small>
      </div>
    
      <div class="flex-col">
        <img src="./assets/icons/wind.png" />
        <small>${Math.round(data[i*2].wind_speed)} mph</small>
      </div>
    </div>`
    )

  }
}

async function getApiKey() {
  const res = await fetch(`../public/assets/apiKey.json`)
  const data = await res.json()
  return data.API_KEY
}

async function fillCards() {
  const apiKey = await getApiKey()
  const res = await fetch(`https://api.openweathermap.org/data/3.0/onecall?exclude=minutely&units=imperial&lat=33.44&lon=-94.04&appid=${apiKey}`)
  // const res = await fetch('../public/assets/testData.json')
  const data = await res.json()
  console.log(data)
  fillNowCard(data.current)
  fillTonightCard(data.daily[0])
  fillHourlyCard(data.hourly)
}
fillCards()



