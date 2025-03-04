// Fetch the API key from Netlify (via a serverless function)
let response = await fetch("/.netlify/functions/getApiKey");
let data = await response.json();
let API_KEY = data.apiKey;

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let day = date.getDate();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  return ` ${day} ${month} ${hours}:${minutes}`;
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}
function displayForecast(response) {
  let dailyForecast = response.data.daily;
  let forecastHTML = `<div class="row">`;
  dailyForecast.forEach(function (forecastDay, index) {
    let icon = response.data.daily[(forecastDay, index)].condition.icon;
    let time = response.data.daily[(forecastDay, index)].time;
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-2 forecast">
      <span class="forecast-day">${formatDay(time)}</span>
      <img class="forecast-icon" src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${icon}.png" alt="icon" />
      <span class="forecast-min-temp">${Math.round(
        forecastDay.temperature.minimum
      )}° - </span><span class="forecast-max-temp">${Math.round(
          forecastDay.temperature.maximum
        )}°</span>
    </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHTML;
}
function getForecast(response) {
  let city = response.city;
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${API_KEY}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}
function findCurrentData(response) {
  console.log(response);
  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = Math.round(response.data.temperature.current);
  let h1 = document.querySelector("#city-country");
  h1.innerHTML = `${response.data.city}, ${response.data.country}`;
  let description = document.querySelector("#description");
  description.innerHTML = response.data.condition.description;
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${Math.round(response.data.temperature.humidity)}%`;
  let wind = document.querySelector("#wind");
  wind.innerHTML = `${response.data.wind.speed}mph`;
  let date = document.querySelector("#date");
  date.innerHTML = formatDate(response.data.time * 1000);
  celsiusTemperature = Math.round(response.data.temperature.current);
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  getForecast(response.data);
}
function findCity(city) {
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${API_KEY}&units=metric`;
  axios.get(apiUrl).then(findCurrentData);
}

function submitForm(event) {
  event.preventDefault();
  let input = document.querySelector("#search-input").value;
  findCity(input);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", submitForm);

findCity("London");
