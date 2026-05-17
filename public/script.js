let currentCity = '';
let weatherChart = null;
let weatherMap = null;
let weatherMarker = null;

// Getting Weather
async function getWeather() {
  const city = document.getElementById('cityInput').value;

  if (!city) {
    alert('Please enter a city.');
    return;
  }

  const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
  const data = await response.json();

  console.log(data);

  currentCity = data.name;

  document.getElementById('cityName').textContent = `City: ${data.name}`;
  document.getElementById('condition').textContent = `Condition: ${data.weather[0].description}`;
  document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°F`;
  document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById('wind').textContent = `Wind Speed: ${data.wind.speed} mph`;
  document.getElementById('advice').textContent = createAdvice(data);

  createTemperatureChart(data);
  createMap(data);
}

// Advice
function createAdvice(data) {
  const temp = data.main.temp;
  const condition = data.weather[0].main.toLowerCase();
  const wind = data.wind.speed;

  if (condition.includes('rain')) {
    return 'Bring an umbrella today because rain is expected.';
  }

  if (temp < 45) {
    return 'Wear a warm jacket because it is cold outside.';
  }

  if (temp > 85) {
    return 'Stay hydrated because it is hot outside.';
  }

  if (wind > 15) {
    return 'It is windy, so biking may not be the best option.';
  }

  return 'The weather looks comfortable for outdoor activities.';
}

// Chart.js Library
function createTemperatureChart(data) {
  const chartCanvas = document.getElementById('weatherChart');

  if (!chartCanvas) {
    return;
  }

  if (weatherChart) {
    weatherChart.destroy();
  }

  weatherChart = new Chart(chartCanvas, {
    type: 'bar',
    data: {
      labels: ['Current Temp', 'Feels Like', 'Min Temp', 'Max Temp'],
      datasets: [{
        label: 'Temperature °F',
        data: [
          data.main.temp,
          data.main.feels_like,
          data.main.temp_min,
          data.main.temp_max
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Temperature Details for ${data.name}`
        }
      }
    }
  });
}

// Leaflet.js Library
function createMap(data) {
  const mapDiv = document.getElementById('map');

  if (!mapDiv) {
    return;
  }

  const latitude = data.coord.lat;
  const longitude = data.coord.lon;

  if (!weatherMap) {
    weatherMap = L.map('map').setView([latitude, longitude], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(weatherMap);
  } else {
    weatherMap.setView([latitude, longitude], 10);
  }

  if (weatherMarker) {
    weatherMarker.remove();
  }

  weatherMarker = L.marker([latitude, longitude])
    .addTo(weatherMap)
    .bindPopup(`${data.name}: ${data.main.temp}°F`)
    .openPopup();
}

// Saving Location
async function saveLocation() {
  if (!currentCity) {
    alert('Search a city first.');
    return;
  }

  console.log('Saving city:', currentCity);

  const response = await fetch('/api/saved-locations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ city: currentCity })
  });

  const data = await response.json();

  console.log('Save response:', data);

  alert('Location saved!');

  loadSavedLocations();
}

// Loading saved locations
async function loadSavedLocations() {
  const response = await fetch('/api/saved-locations');
  const data = await response.json();

  const list = document.getElementById('savedLocations');
  list.innerHTML = '';

  if (!Array.isArray(data)) {
    list.innerHTML = '<li>Could not load saved locations.</li>';
    return;
  }

  data.forEach(location => {
    const item = document.createElement('li');
    item.textContent = location.city;
    list.appendChild(item);
  });
}

// Clearing saved locations
async function clearSavedLocations() {
  const response = await fetch('/api/saved-locations', {
    method: 'DELETE'
  });

  const data = await response.json();
  console.log('Clear response:', data);

  loadSavedLocations();
  alert('Saved locations cleared!');
}

loadSavedLocations();