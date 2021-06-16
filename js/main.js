/* global weatherData */
/* global astronomyData */
/* global nasaData */
/* global observationData */

var $loading = document.querySelector('.fa-moon');
var $zipCodeInput = document.querySelector('.zip-code');
var $headerBookIcon = document.querySelector('#book-header');
var $headerStarIcon = document.querySelector('#star-header');
var $headerMoonIcon = document.querySelector('#moon-header');
var $headerPlusIcon = document.querySelector('#plus-header');
var $footerBookIcon = document.querySelector('#book-footer');
var $footerMoonIcon = document.querySelector('#moon-footer');
var $footerPlusIcon = document.querySelector('#plus-footer');
var $footerStarIcon = document.querySelector('#star-footer');
var recordObv = document.querySelector('.observation-form');

var $imageUrl = document.querySelector('.image-url');
var $newUlobservations = document.querySelector('.list-observations');
var $observationTitle = document.querySelector('.observation-title');
var $warningMessage = document.querySelector('.warning');
var $deleteEntryBtn = document.querySelector('.delete-entry');
var $viewModal = document.querySelector('.view-modal');
var $cancelbutton = document.querySelector('.cancel-button');
var $confirmbutton = document.querySelector('.confirm-button');
var $searchInput = document.querySelector('#user-search');
var $favoriteStarBtn = document.querySelector('#starBtn');
var $emptystarBtn = document.querySelector('#emptystarBtn');
var $favoriteImages = document.querySelector('#favorites');
var $leftArrow = document.querySelector('.fa-chevron-left');
var $rightArrow = document.querySelector('.fa-chevron-right');

var indexCounter = 0;
var observationId = null;
var intervalId = null;

$cancelbutton.addEventListener('click', hideModal);
$confirmbutton.addEventListener('click', confirmDelete);
$deleteEntryBtn.addEventListener('click', deleteModalView);
$leftArrow.addEventListener('click', leftArrowClick);
$rightArrow.addEventListener('click', rightArrowClick);
$footerPlusIcon.addEventListener('click', plusClick);
$footerBookIcon.addEventListener('click', bookClick);
$footerMoonIcon.addEventListener('click', moonClick);
$footerStarIcon.addEventListener('click', starClick);
$emptystarBtn.addEventListener('click', dislikeClick);
$newUlobservations.addEventListener('click', editObservationItem);
$favoriteStarBtn.addEventListener('click', favoriteClick);

$searchInput.addEventListener('keyup', searchInput);
$zipCodeInput.addEventListener('keyup', enterZip);
window.addEventListener('keyup', submit);
recordObv.addEventListener('submit', saveObvs);

function spinIcon() {
  $loading.className = 'fas fa-moon invisible';
}

function moonClick(event) {
  clearInterval(intervalId);
  $headerBookIcon.className = 'fas fa-book hidden';
  $headerMoonIcon.className = 'fas fa-cloud-moon';
  $headerPlusIcon.className = 'fas fa-plus hidden';
  $headerStarIcon.className = 'fas fa-star hidden';
  observationData.editing = null;
}

function plusClick(event) {
  clearInterval(intervalId);
  $headerMoonIcon.className = 'fas fa-cloud-moon hidden';
  $headerBookIcon.className = 'fas fa-book hidden';
  $headerPlusIcon.className = 'fas fa-plus';
  $headerStarIcon.className = 'fas fa-star hidden';
  $deleteEntryBtn.className = 'invisible delete-entry';
  $emptystarBtn.className = 'hidden far fa-star';
  $favoriteStarBtn.className = 'hidden fas fa-star';
  $observationTitle.textContent = 'New Observation';
  if (recordObv.elements.zipcode.value.length === 0) {
    $warningMessage.textContent = 'Please Enter Zipcode at Home Page';
  } else {
    $warningMessage.textContent = '';
  }
}

function bookClick(event) {
  clearInterval(intervalId);
  window.location.hash = '#observations';
  var $pastObvs = document.querySelector('.past-observations');
  $headerMoonIcon.className = 'fas fa-cloud-moon hidden';
  $headerBookIcon.className = 'fas fa-book';
  $headerPlusIcon.className = 'fas fa-plus hidden';
  $headerStarIcon.className = 'fas fa-star hidden';
  if (observationData.observations.length === 0) {
    $pastObvs.className = 'past-observations center';
    $pastObvs.textContent = 'No Observations!';
  } else {
    $pastObvs.className = 'past-observations center';
    $pastObvs.textContent = 'Observations';
  }
}
function starClick(event) {
  $headerBookIcon.className = 'fas fa-book hidden';
  $headerMoonIcon.className = 'fas fa-cloud-moon hidden';
  $headerPlusIcon.className = 'fas fa-plus hidden';
  $headerStarIcon.className = 'fas fa-star';
  intervalId = setInterval(slideShow, 8000);
}

function slideShow() {
  var data = observationData.observations;
  var favoritesSlider = data.filter(observations => {
    return observations.starId;
  });
  if (data.length === 0 || favoritesSlider.length === 0) {
    clearInterval(intervalId);
  }
  if (indexCounter < 0) {
    indexCounter = 0;
  }
  if (indexCounter <= favoritesSlider.length - 1) {
    $favoriteImages.setAttribute('src', favoritesSlider[indexCounter].image);
    indexCounter++;
  } else {
    indexCounter = 0;
    $favoriteImages.setAttribute('src', favoritesSlider[indexCounter].image);
    indexCounter++;
  }
}

function rightArrowClick(event) {
  clearInterval(intervalId);
  var data = observationData.observations;
  var favoritesSlider = data.filter(observations => {
    return observations.starId;
  });
  if (data.length === 0 || favoritesSlider.length === 0) {
    clearInterval(intervalId);
  }
  if (indexCounter < 0) {
    indexCounter = 0;
  }
  if (indexCounter <= favoritesSlider.length - 1) {
    $favoriteImages.setAttribute('src', favoritesSlider[indexCounter].image);
    indexCounter++;
  } else {
    indexCounter = 0;
    $favoriteImages.setAttribute('src', favoritesSlider[indexCounter].image);
    indexCounter++;
  }
  intervalId = setInterval(slideShow, 8000);
}

function leftArrowClick(event) {
  clearInterval(intervalId);
  var data = observationData.observations;
  var favoritesSlider = data.filter(observations => {
    return observations.starId;
  });
  if (data.length === 0 || favoritesSlider.length === 0) {
    clearInterval(intervalId);
  }
  if (indexCounter > favoritesSlider.length) {
    indexCounter = favoritesSlider.length - 1;
    $favoriteImages.setAttribute('src', favoritesSlider[indexCounter].image);
    indexCounter--;
  }
  if (indexCounter >= 0 && indexCounter < favoritesSlider.length) {
    $favoriteImages.setAttribute('src', favoritesSlider[indexCounter].image);
    indexCounter--;
  } else {
    indexCounter = favoritesSlider.length - 1;
    $favoriteImages.setAttribute('src', favoritesSlider[indexCounter].image);
    indexCounter--;
  }

  intervalId = setInterval(slideShow, 8000);
}

function searchInput(event) {
  var searchString = event.target.value.toLowerCase();
  var $li = document.querySelectorAll('li');
  for (var i = 0; i < observationData.observations.length; i++) {
    if (
      observationData.observations[i].date.includes(searchString) === true ||
      observationData.observations[i].time.includes(searchString) === true ||
      observationData.observations[i].zipcode.includes(searchString) === true ||
      observationData.observations[i].observations
        .toLowerCase()
        .includes(searchString) === true ||
      observationData.observations[i].lunarPhase
        .toLowerCase()
        .includes(searchString) === true ||
      observationData.observations[i].location
        .toLowerCase()
        .includes(searchString) === true
    ) {
      $li[i].getAttribute('observation-data-id');
      $li[i].className = 'observation-entry';
    } else {
      $li[i].className = 'observation-entry hidden';
    }
  }
}

function saveObvs(event) {
  event.preventDefault();
  if (observationData.editing === null) {
    var userInput = {};
    userInput.dayLength = astronomyData.dayLength;
    userInput.zipcode = recordObv.elements.zipcode.value;
    userInput.location = recordObv.elements.location.value;
    userInput.date = recordObv.elements.date.value;
    userInput.time = recordObv.elements.time.value;
    userInput.lunarPhase = weatherData.moon_phase;
    userInput.moonrise = weatherData.moonrise;
    userInput.moonset = weatherData.moonset;
    userInput.moonIll = weatherData.moon_illumination;
    userInput.sunset = weatherData.sunset;
    userInput.moonDistance = astronomyData.moon_distance;
    userInput.temp = weatherData.temp;
    userInput.wind = weatherData.wind;
    userInput.image = recordObv.elements.image.value;
    userInput.observations = recordObv.elements.observations.value;
    observationData.observations.unshift(userInput);
    userInput.nextObvId = observationData.nextObvId;
    observationData.nextObvId++;
    var newNode = createObservation(observationData.observations[0]);
    $newUlobservations.prepend(newNode);
  } else {
    observationData.editing.zipcode = recordObv.elements.zipcode.value;
    observationData.editing.location = recordObv.elements.location.value;
    observationData.editing.date = recordObv.elements.date.value;
    observationData.editing.time = recordObv.elements.time.value;
    observationData.editing.image = recordObv.elements.image.value;
    observationData.editing.observations =
      recordObv.elements.observations.value;
    for (var i = 0; i < observationData.observations.length; i++) {
      if (
        observationData.observations[i].nextObvId ===
        observationData.editing.nextObvId
      ) {
        observationData.observations[i] = observationData.editing;
        var $observationNode = document.querySelectorAll('.observation-entry');
        var editObservationItem = createObservation(observationData.editing);
        $observationNode[i].replaceWith(editObservationItem);
      }
    }
  }
  recordObv.reset();
  $warningMessage.textContent = 'Please Enter Zipcode at Home Page';
  observationData.editing = null;
  bookClick();
}
function createObservation(entry) {
  var newList = document.createElement('li');
  newList.setAttribute('class', 'observation-entry');
  newList.setAttribute('observation-data-id', entry.nextObvId);

  var row = document.createElement('div');
  row.setAttribute('class', 'row');

  var columnhalf1 = document.createElement('div');
  columnhalf1.setAttribute('class', 'column-half');

  var columnhalf2 = document.createElement('div');
  columnhalf2.setAttribute('class', 'column-half');

  var img = document.createElement('img');
  img.setAttribute('src', entry.image);
  img.setAttribute('class', 'image-url');

  var observationheader = document.createElement('div');
  observationheader.setAttribute('class', 'observation-header');
  var h2 = document.createElement('h2');
  h2.setAttribute('class', 'post-location');

  h2.textContent = `Location: ${entry.location}`;

  var pdate = document.createElement('p');
  pdate.setAttribute('class', 'post-date');
  pdate.textContent = `Date: ${entry.date}`;

  var pTime = document.createElement('p');
  pTime.setAttribute('class', 'post-time');
  pTime.textContent = `Time: ${entry.time}`;

  var pTemp = document.createElement('p');
  pTemp.setAttribute('class', 'post-zip');
  pTemp.textContent = `Temperature: ${entry.temp}`;

  var pWind = document.createElement('p');
  pWind.setAttribute('class', 'post-wind');
  pWind.textContent = `Wind Direction: ${entry.wind}`;

  var pMoonrise = document.createElement('p');
  pMoonrise.textContent = `Moonrise: ${entry.moonrise}`;

  var pMoonset = document.createElement('p');
  pMoonset.textContent = `Moonset: ${entry.moonset}`;

  var pMoonIll = document.createElement('p');
  pMoonIll.textContent = `Moon Illumination: ${entry.moonIll}`;

  var pDayLength = document.createElement('p');
  pDayLength.textContent = `Day Length: ${entry.dayLength} Hrs.`;

  var atag = document.createElement('a');
  var editIcon = document.createElement('i');
  editIcon.setAttribute('class', 'fas fa-edit');
  atag.setAttribute('class', 'tab');
  atag.href = '#observation-form';

  var pElement = document.createElement('p');
  pElement.textContent = `Observations: ${entry.observations}`;

  var plunar = document.createElement('p');
  plunar.textContent = `Lunar Phase: ${entry.lunarPhase}`;

  var pSunset = document.createElement('p');
  pSunset.textContent = `Sunset: ${entry.sunset}`;

  observationheader.appendChild(h2);
  observationheader.appendChild(atag);
  atag.appendChild(editIcon);
  columnhalf2.appendChild(observationheader);
  columnhalf2.appendChild(pdate);
  columnhalf2.appendChild(pTime);
  columnhalf2.appendChild(pTemp);
  columnhalf2.appendChild(pWind);
  columnhalf2.appendChild(pDayLength);
  columnhalf2.appendChild(pSunset);
  columnhalf2.appendChild(pMoonrise);
  columnhalf2.appendChild(pMoonset);
  columnhalf2.appendChild(plunar);
  columnhalf2.appendChild(pMoonIll);
  columnhalf2.appendChild(pElement);
  columnhalf1.appendChild(img);
  row.appendChild(columnhalf1);
  row.appendChild(columnhalf2);
  newList.appendChild(row);

  return newList;
}

function loadObservations(event) {
  for (var i = 0; i < observationData.observations.length; i++) {
    var $observationNode = createObservation(observationData.observations[i]);
    $newUlobservations.append($observationNode);
  }
}

function editObservationItem(event) {
  if (event.target.matches('.fa-edit')) {
    viewEditForm();
    var closestObservation = event.target.closest('.observation-entry');
    observationId = closestObservation.getAttribute('observation-data-id');
    for (var i = 0; i < observationData.observations.length; i++) {
      if (
        observationData.observations[i].nextObvId.toString() === observationId
      ) {
        observationData.editing = observationData.observations[i];
        recordObv.elements.zipcode.value = observationData.editing.zipcode;
        recordObv.elements.location.value = observationData.editing.location;
        recordObv.elements.date.value = observationData.editing.date;
        recordObv.elements.time.value = observationData.editing.time;
        recordObv.elements.image.value = observationData.editing.image;
        $imageUrl.setAttribute('src', observationData.editing.image);
        recordObv.elements.observations.value =
          observationData.editing.observations;
        starCheck();
      }
    }
  }
}

function viewEditForm(event) {
  clearInterval(intervalId);
  $favoriteStarBtn.className = 'hidden fa-star';
  $emptystarBtn.className = 'far fa-star';
  $observationTitle.textContent = 'Edit Observation';
  $warningMessage.textContent = '';
  $deleteEntryBtn.className = 'delete-entry';
}

function starCheck() {
  if (observationData.editing.starId) {
    $emptystarBtn.className = 'hidden far fa-star';
    $favoriteStarBtn.className = 'fas fa-star';
  } else {
    $emptystarBtn.className = 'far fa-star';
    $favoriteStarBtn.className = 'hidden fas fa-star';
  }
}
function dislikeClick(event) {
  if (!observationData.editing.starId);
  $favoriteStarBtn.className = 'fas fa-star';
  $emptystarBtn.className = 'hidden far fa-star';
  observationData.editing.starId = true;
}

function favoriteClick(event) {
  if (!observationId.editing.starId) {
    $emptystarBtn.className = 'far fa-star';
    $favoriteStarBtn.className = 'hidden fas fa-star';
  } else {
    observationId.editing.starId = false;
  }
}

function deleteModalView(event) {
  event.preventDefault();
  $viewModal.className = 'view-modal';
}

function confirmDelete(event) {
  for (var i = 0; i < observationData.observations.length; i++) {
    if (
      observationData.observations[i].nextObvId.toString() === observationId
    ) {
      observationData.observations.splice(i, 1);
    }
  }
  var $li = document.querySelectorAll('li');
  for (var x = 0; x < $li.length; x++) {
    if ($li[x].getAttribute('observation-data-id') === observationId) {
      $li[x].remove();
    }
  }

  $imageUrl.setAttribute('src', 'images/placeholder.jpeg');
  recordObv.reset();
  observationData.editing = null;
  hideModal();
  bookClick();
}

function hideModal(event) {
  $viewModal.className = 'hidden view-modal';
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
    'https://api.weatherapi.com/v1/forecast.json?key=747120ab42924582925172532211204&q=' +
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
    nasaData.media_type = xhr.response.media_type;
    renderData();
  });
  xhr.send();
}

function renderData() {
  var $zipCodeTitle = document.querySelector('.zip-code-title');
  $zipCodeTitle.textContent = weatherData.city;

  var zipcode = document.querySelector('#zipcode');
  zipcode.value = weatherData.zipCode;

  var $latitude = document.querySelector('.latitude');
  $latitude.textContent =
    weatherData.lat + '° N, ' + ' ' + weatherData.lon + '° W';

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

  var imageurl = document.querySelector('#user-imageUrl');
  imageurl.value = nasaData.image;
  $imageUrl.setAttribute('src', nasaData.image);
  $imageUrl.setAttribute('alt', 'api images');

  if (nasaData.media_type === 'video') {
    $imageUrl.setAttribute('src', 'images/placeholder.jpeg');
    imageurl.value = 'images/placeholder.peg';
  }

  $zipCodeInput.value = null;
  nasaData.image = null;
  spinIcon();
}

var $tabs = document.querySelectorAll('.tab');
var $views = document.querySelectorAll('.view');

showView(window.location.hash);

window.addEventListener('hashchange', function (event) {
  showView(window.location.hash);
});

function showView(newHash) {
  var route = newHash.startsWith('#') ? newHash.replace('#', '') : newHash;

  if (route === '') return;

  for (var tabIndex = 0; tabIndex < $tabs.length; tabIndex++) {
    if ($tabs[tabIndex].hash === newHash) {
      $tabs[tabIndex].className = 'tab active';
    } else {
      $tabs[tabIndex].className = 'tab';
    }
  }

  for (var viewIndex = 0; viewIndex < $views.length; viewIndex++) {
    if ($views[viewIndex].getAttribute('data-view') !== route) {
      $views[viewIndex].className = 'view hidden';
    } else {
      $views[viewIndex].className = 'view';
    }
  }
}

window.addEventListener('DOMContentLoaded', loadObservations);
