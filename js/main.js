/* eslint-disable no-console */
var $zipCodeInput = document.querySelector('.zip-code');

$zipCodeInput.addEventListener('keypress', enterZip);

function enterZip(event) {
  console.log(event.target.value);
}
