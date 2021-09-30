'use strict';

const countriesContainer = document.querySelector('.countries');
const inputCountryName = document.querySelector('.country__name-input');
const btn = document.querySelector('.login__btn');

///////////////////////////////////////

const renderCountry = function (data, className = '') {
  const html = `
            <article class="country ${className}">
            <img class="country__img" src="${data.flags[0]}" />
            <div class="country__data">
                <h3 class="country__name">${data.name.common}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>🗾</span>${(
                  data.area / 1000000
                ).toFixed(1)} million km²</p>
                <p class="country__row"><span>🗣️</span>${
                  Object.values(data.languages)[0]
                }</p>
                <p class="country__row"><span>💰</span>${
                  Object.values(data.currencies)[0].name
                }</p>
            </div>
            </article>
        `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

// output to Caught errors in AJAX Calls
const renderError = function (message) {
  countriesContainer.insertAdjacentText('beforeend', message);
  countriesContainer.style.opacity = 1;
};

///////////////////////////////////////////////////////
// ES2017 Async/Await

const getCountryData = async function (country) {
  // 'try...catch' statement
  try {
    // rendering main Country
    const response = await fetch(
      `https://restcountries.com/v3/name/{${country}}`
    );

    // manually creating an error to handle if fetch fails
    if (!response.ok) {
      throw new Error('Problem fetching Country Data!! 🐍');
    }

    const [data] = await response.json();
    console.log(data);
    renderCountry(data);

    // rendering neighbors
    const [neighbor1, neighbor2] = data.borders;

    // Neighbor - 1
    const neighbor1Response = await fetch(
      `https://restcountries.com/v3/alpha/${neighbor1}`
    );

    if (!neighbor1Response.ok)
      throw new Error('Problem fetching Neighbor1 Data!!');

    const [neighbor1Data] = await neighbor1Response.json();
    renderCountry(neighbor1Data, 'neighbour');

    // Neighbor - 2
    const neighbor2Response = await fetch(
      `https://restcountries.com/v3/alpha/${neighbor2}`
    );

    if (!neighbor2Response.ok)
      throw new Error('Problem fetching Neighbor2 Data!!');

    const [neighbor2Data] = await neighbor2Response.json();
    renderCountry(neighbor2Data, 'neighbour');
  } catch (error) {
    console.error(`⛔ ${error} ⛔`);
    renderError(`⛔ Something went Wrong!! 👺 (${error.message}) ⛔`);
  }
};

getCountryData('United States');

btn.addEventListener('click', function (event) {
  // prevents button from reloading the page on submit
  event.preventDefault();

  // removes existing countries
  [...countriesContainer.children].forEach(child => {
    child.remove();
  });

  // retrieves data from AJAX call and insert the country data to the DOM
  getCountryData(inputCountryName.value);
});

console.log('This will log BEFORE the Async function');

// ////////////////////////////////////////////////////
// // Making AJAX Calls (Promises) --> 'Fetch API'

// // Encapsulating the fetch, error handling and JSON conversion
// const getJSON = function (url, errorMsg = `Something went Wrong!`) {
//   return fetch(url).then(response => {
//     if (!response.ok) {
//       throw new Error(`${errorMsg} (${response.status})`);
//     }
//     return response.json();
//   });
// };

// const getCountryData = function (country) {
//   getJSON(
//     `https://restcountries.com/v3/name/{${country}}`,
//     'Country not found!'
//   )
//     .then(data => {
//       renderCountry(data[0]);

//       const [neighbor1, neighbor2] = data[0].borders;

//       if (!neighbor1 || !neighbor2) {
//         throw new Error('Country is an Island with no neighbors 🤣');
//       }

//       // Neighbor 1
//       return getJSON(
//         `https://restcountries.com/v3/alpha/${neighbor1}`,
//         'Country not found!'
//       ).then(data => {
//         renderCountry(data[0], 'neighbour');

//         // Neighbor 2
//         return getJSON(
//           `https://restcountries.com/v3/alpha/${neighbor2}`,
//           'Country not found!'
//         ).then(data => renderCountry(data[0], 'neighbour'));
//       });
//     })
//     .catch(error =>
//       // ⭐ handling ALL Rejected Promises
//       console.error(`⛔ ${error} ⛔`)
//     )
//     .finally(() => (countriesContainer.style.opacity = 1)); // fades in the container no matter of the state of the Promise
// };

// getCountryData('United States');

// btn.addEventListener('click', function (event) {
//   // prevents button from reloading the page on submit
//   event.preventDefault();

//   // removes existing countries
//   [...countriesContainer.children].forEach(child => {
//     child.remove();
//   });

//   // retrieves data from AJAX call and insert the country data to the DOM
//   getCountryData(inputCountryName.value);
// });

///////////////////////////////////////////////////////
