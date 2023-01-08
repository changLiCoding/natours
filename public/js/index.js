/* eslint-disable */
import '@babel/polyfill';
import { login } from './login';
import { displayMap } from './mapbox';

// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');

// Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}


if (loginForm) {
  loginForm.addEventListener('submit', function(event) {
    // Values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    event.preventDefault();
    console.log(email, password);
    login(email, password);
  });
}
