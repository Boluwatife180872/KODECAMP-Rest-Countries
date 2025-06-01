// DOM elements
const backBtn = document.getElementById("back-btn");
const loadingDiv = document.getElementById("loading");
const countryDetailDiv = document.getElementById("country-detail");
const themeBtn = document.getElementById("theme-btn");

// Initialize
init();

function init() {
  loadTheme();
  setupEventListeners();
  loadCountryDetail();
}

// Theme functions (same as main page)
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️ Light Mode";
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");

  if (isDark) {
    themeBtn.textContent = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    themeBtn.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  }
}

// Event listeners
function setupEventListeners() {
  themeBtn.addEventListener("click", toggleTheme);
  backBtn.addEventListener("click", () => window.history.back());
}

// Get country name from URL
function getCountryName() {
  const params = new URLSearchParams(window.location.search);
  return params.get("name");
}

// Load country detail
async function loadCountryDetail() {
  const countryName = getCountryName();

  if (!countryName) {
    loadingDiv.textContent = "No country specified";
    return;
  }

  try {
    // Fetch specific country and all countries (for borders)
    const [countryResponse, allCountriesResponse] = await Promise.all([
      fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`),
      fetch("https://restcountries.com/v3.1/all"),
    ]);

    const countryData = await countryResponse.json();
    const allCountries = await allCountriesResponse.json();

    const country = countryData[0];
    displayCountryDetail(country, allCountries);
    loadingDiv.style.display = "none";
  } catch (error) {
    loadingDiv.textContent = "Error loading country details";
    console.error("Error:", error);
  }
}

// Display country detail
function displayCountryDetail(country, allCountries) {
  // Get native name
  const nativeName = country.name.nativeName
    ? Object.values(country.name.nativeName)[0].common
    : country.name.common;

  // Get currencies
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((c) => c.name)
        .join(", ")
    : "N/A";

  // Get languages
  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";

  // Get border countries
  const borderCountries = country.borders
    ? country.borders.map((border) => {
        const borderCountry = allCountries.find((c) => c.cca3 === border);
        return borderCountry ? borderCountry.name.common : border;
      })
    : [];

  countryDetailDiv.innerHTML = `
        <div class="detail-container">
            <img src="${country.flags.svg}" alt="${
    country.name.common
  } flag" class="detail-flag">
            <div class="detail-info">
                <h2>${country.name.common}</h2>
                <div class="detail-grid">
                    <div>
                        <div class="detail-item"><span class="label">Native Name:</span> ${nativeName}</div>
                        <div class="detail-item"><span class="label">Population:</span> ${country.population.toLocaleString()}</div>
                        <div class="detail-item"><span class="label">Region:</span> ${
                          country.region
                        }</div>
                        <div class="detail-item"><span class="label">Sub Region:</span> ${
                          country.subregion || "N/A"
                        }</div>
                        <div class="detail-item"><span class="label">Capital:</span> ${
                          country.capital ? country.capital[0] : "N/A"
                        }</div>
                    </div>
                    <div>
                        <div class="detail-item"><span class="label">Top Level Domain:</span> ${
                          country.tld ? country.tld[0] : "N/A"
                        }</div>
                        <div class="detail-item"><span class="label">Currencies:</span> ${currencies}</div>
                        <div class="detail-item"><span class="label">Languages:</span> ${languages}</div>
                    </div>
                </div>
                ${
                  borderCountries.length > 0
                    ? `
                    <div class="borders">
                        <h3>Border Countries:</h3>
                        <div class="border-countries">
                            ${borderCountries
                              .map(
                                (border) =>
                                  `<a href="country.html?name=${border}" class="border-country">${border}</a>`
                              )
                              .join("")}
                        </div>
                    </div>
                `
                    : ""
                }
            </div>
        </div>
    `;
}
