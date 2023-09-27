const todayGrid = $('.today-grid')

const testData = [
  {
    temperature: '50',
    time: '8 am'
  },
  {
    temperature: '67',
    time: '10 am'
  },
  {
    temperature: '70',
    time: '12 pm'
  },
  {
    temperature: '74',
    time: '2 pm'
  },
  {
    temperature: '80',
    time: '4 pm'
  },
  {
    temperature: '84',
    time: '6 pm'
  },
  {
    temperature: '78',
    time: '8pm'
  },
  {
    temperature: '67',
    time: '10 pm'
  },
  {
    temperature: '62',
    time: '12 pm'
  },
]

function displayTodayWeather() {
  let i = 0
  let barColor
  testData.map((data) => {
    i / 2 === 0 ? barColor = '' : barColor = 'alt-element'
    todayGrid.append(
      `<div class="temp-graph-element">
      <div>
        <small>${data.temperature}°</small>
        <div class="temp-graph-bar ${barColor}" style="height: ${(data.temperature + 20) / 140}px"></div>
        <small class="bold-small">${data.time}</small>
      </div>
    
      <div class="flex-col">
        <img src="https://placehold.co/20" />
        <small>10%</small>
      </div>
    
      <div class="flex-col">
        <img src="https://placehold.co/20" />
        <small>10 mph NW</small>
      </div>
    </div>`
    )
    i + 1
  })
}

displayTodayWeather()



