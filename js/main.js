/* global weatherData */
/* global astronomyData */
/* global nasaData */
/* global observationData */

var $zipCodeInput = document.querySelector('.zip-code');
var $zipCodeTitle = document.querySelector('.zip-code-title');
var $loading = document.querySelector('.fa-moon');
var $headerBookIcon = document.querySelector('#book-header');
var $footerBookIcon = document.querySelector('#book-footer');
var $headerMoonIcon = document.querySelector('#header-moon');
var $footerMoonIcon = document.querySelector('#moon-footer');
var $observationView = document.querySelector('.observation-container');
var $weatherView = document.querySelector('.container');
var recordObv = document.querySelector('.observation-form');

var $imageUrl = document.querySelector('.image-url');
var $userPhotoUrl = document.querySelector('#user-photoUrl');

$zipCodeInput.addEventListener('keyup', enterZip);
window.addEventListener('keypress', submit);
$footerBookIcon.addEventListener('click', bookClick);
$footerMoonIcon.addEventListener('click', moonClick);
recordObv.addEventListener('submit', saveObvs);
$userPhotoUrl.addEventListener('input', imageUpdate);

function saveObvs(event) {
  event.preventDefault();
  if (observationData.editing === null) {
    var userInput = {};
    userInput.zipcode = recordObv.elements.zipcode.value;
    userInput.location = recordObv.elements.location.value;
    userInput.date = recordObv.elements.date.value;
    userInput.time = recordObv.elements.time.value;
    userInput.lunarPhase = recordObv.elements.lunarPhase.value;
    userInput.image = recordObv.elements.photo.value;
    userInput.observations = recordObv.elements.observations.value;
    observationData.observations.unshift(userInput);
    userInput.nextObvId = observationData.nextObvId;
    observationData.nextObvId++;
  }
  $imageUrl.setAttribute('src', 'images/placeholder.jpeg');
  recordObv.reset();
  observationData.editing = null;
}

function bookClick(event) {
  $headerMoonIcon.className = 'fas fa-cloud-moon hidden';
  $headerBookIcon.className = 'fas fa-book';
  $weatherView.className = 'hidden';
  $observationView.className = 'observation-container';
}

function moonClick(event) {
  $headerBookIcon.className = 'fas fa-book hidden';
  $headerMoonIcon.className = 'fas fa-cloud-moon';
  $observationView.className = 'hidden observation-container';
  $weatherView.className = 'container';
}

function enterZip(event) {
  if ($zipCodeInput.value.length > 5) {
    $zipCodeInput.className = 'zip-code-error';
  }
  if ($zipCodeInput.value.length === 5) {
    $zipCodeInput.className = 'zip-code';
    astronomyData.zipCode = $zipCodeInput.value;
    weatherData.zipCode = $zipCodeInput.value;
  }
}
function spinIcon() {
  $loading.className = 'fas fa-moon invisible';
}
function submit(event) {
  if (
    event.key === 'Enter' &&
    Number($zipCodeInput.value && weatherData.zipCode !== null)
  ) {
    $loading.className = 'fas fa-moon loading';
    getWeatherData();
  }
}

function getWeatherData() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    'http://api.weatherapi.com/v1/forecast.json?key=747120ab42924582925172532211204&q=' +
      weatherData.zipCode +
      '&days=1&aqi=no&alerts=no'
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    weatherData.lat = xhr.response.location.lat;
    weatherData.lon = xhr.response.location.lon;
    weatherData.time = xhr.response.location.localtime.slice(11, 16);
    weatherData.date = xhr.response.location.localtime.slice(6, 10) + '-2021';
    weatherData.temp = xhr.response.current.temp_f + '°';
    weatherData.feels = xhr.response.current.feelslike_f + '°';
    weatherData.wind =
      xhr.response.current.wind_mph + ' ' + xhr.response.current.wind_dir;
    weatherData.moonrise = xhr.response.forecast.forecastday[0].astro.moonrise;
    weatherData.sunset = xhr.response.forecast.forecastday[0].astro.sunset;
    weatherData.moonset = xhr.response.forecast.forecastday[0].astro.moonset;
    weatherData.moon_phase =
      xhr.response.forecast.forecastday[0].astro.moon_phase;
    weatherData.moon_illumination =
      xhr.response.forecast.forecastday[0].astro.moon_illumination;
    weatherData.city = xhr.response.location.name;
    getAstronomyData();
  });
  xhr.send();
}

function getAstronomyData() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    'https://api.ipgeolocation.io/astronomy?apiKey=269e58c8ced7450593d0b670723b7b18&location=US'
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    astronomyData.dayLength = xhr.response.day_length;
    astronomyData.moon_distance = Math.floor(xhr.response.moon_distance);
    getNasaData();
  });
  xhr.send();
}
function getNasaData() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    'https://api.nasa.gov/planetary/apod?api_key=c39xLCyknC5Yk1SHwmpIVzqHud1ISaewFRDLhIp2'
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    nasaData.image = xhr.response.hdurl;
    renderData();
  });
  xhr.send();
}

function renderData() {
  $zipCodeTitle.textContent = $zipCodeInput.value;

  var zipcode = document.querySelector('#zipcode');
  zipcode.value = weatherData.zipCode;

  var $latitude = document.querySelector('.latitude');
  $latitude.textContent = weatherData.lat + '° N, ' + ' ' + weatherData.lon + '° W';

  var $date = document.querySelector('.date');
  $date.textContent = weatherData.date;

  var $time = document.querySelector('.time');
  $time.textContent = weatherData.time;

  var $temp = document.querySelector('.temp');
  $temp.textContent = weatherData.temp;

  var $feels = document.querySelector('.feels');
  $feels.textContent = weatherData.feels;

  var $wind = document.querySelector('.wind');
  $wind.textContent = weatherData.wind;

  var $moonrise = document.querySelector('.moonrise');
  $moonrise.textContent = weatherData.moonrise;

  var $sunset = document.querySelector('.sunset');
  $sunset.textContent = weatherData.sunset;

  var $moonset = document.querySelector('.moonset');
  $moonset.textContent = weatherData.moonset;

  var $moonphase = document.querySelector('.moonphase');
  $moonphase.textContent = weatherData.moon_phase;

  var $moonIll = document.querySelector('.moonIll');
  $moonIll.textContent = weatherData.moon_illumination;

  var $dayLength = document.querySelector('.dayLength');
  $dayLength.textContent = astronomyData.dayLength + ' HRS.';

  var $moonDistance = document.querySelector('.moon-distance');
  $moonDistance.textContent = astronomyData.moon_distance + ' Miles';

  var location = document.querySelector('#location');
  location.value = weatherData.city;

  var date = document.querySelector('#date');
  date.value = weatherData.date;

  var time = document.querySelector('#time');
  time.value = weatherData.time;

  var lunarPhase = document.querySelector('#lunarPhase');
  lunarPhase.value = weatherData.moon_phase;

  var imageurl = document.querySelector('#user-photoUrl');
  imageurl.value = nasaData.image;
  $imageUrl.setAttribute('src', nasaData.image);

  $zipCodeInput.value = null;
  nasaData.image = null;
  spinIcon();

}

function imageUpdate(event) {
  var newImage = event.target.value;
  $imageUrl.setAttribute('src', newImage);
}
