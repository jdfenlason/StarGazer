/* exported data */
var observationData = {
  observations: [],
  editing: null,
  nextObvId: 1
};
var astronomyData = {
  zipCode: null
};

var weatherData = {
  zipCode: null
};

var previousobservationDataJSON = localStorage.getItem('observationData-storage');
var previousAstronomyDataJSON = localStorage.getItem('astronomyData-storage');
var previousWeatherDataJSON = localStorage.getItem('astronomyData-storage');

if (previousobservationDataJSON !== null) {
  observationData = JSON.parse(previousobservationDataJSON);
}

if (previousAstronomyDataJSON !== null) {
  astronomyData = JSON.parse(previousAstronomyDataJSON);
}

if (previousWeatherDataJSON !== null) {
  weatherData = JSON.parse(previousWeatherDataJSON);
}

function storeData(event) {
  var observationDataJSON = JSON.stringify(observationData);
  localStorage.setItem('observationData-storage', observationDataJSON);
  var astronomyDataJSON = JSON.stringify(astronomyData);
  localStorage.setItem('astronomyData-storage', astronomyDataJSON);
  var weatherDataJSON = JSON.stringify(weatherData);
  localStorage.setItem('weatherData-storage', weatherDataJSON);

}

window.addEventListener('beforeunload', storeData);
