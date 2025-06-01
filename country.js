// DOM elements
const backBtn = document.getElementById("back-btn");
const loadingDiv = document.getElementById("loading");
const countryDetailDiv = document.getElementById("country-detail");
const themeBtn = document.getElementById("theme-btn");

// Load theme from localStorage
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️ Light Mode";
} else {
  themeBtn.textContent = "🌙 Dark Mode";
}

// Set up event listeners
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

backBtn.addEventListener("click", () => window.history.back());

// Get country name from URL
const params = new URLSearchParams(window.location.search);
const countryName = params.get("name");

// Load country detail
if (!countryName) {
  loadingDiv.textContent = "No country specified";
} else {
  // Fetch country data
  Promise.all([
    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`),
    fetch("https://restcountries.com/v3.1/all"),
  ])
    .then((responses) => Promise.all(responses.map((res) => res.json())))
    .then(([countryData, allCountries]) => {
      const country = countryData[0];

      // Get native name, currencies, and languages
      const nativeName = country.name.nativeName
        ? Object.values(country.name.nativeName)[0].common
        : country.name.common;

      const currencies = country.currencies
        ? Object.values(country.currencies)
            .map((c) => c.name)
            .join(", ")
        : "N/A";

      const languages = country.languages
        ? Object.values(country.languages).join(", ")
        : "N/A";

      // Get border countries
      const borderCountries = [];
      if (country.borders) {
        country.borders.forEach((border) => {
          const borderCountry = allCountries.find((c) => c.cca3 === border);
          if (borderCountry) {
            borderCountries.push(borderCountry.name.common);
          }
        });
      }

      // Create HTML for border countries
      const borderHTML =
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
          : "";

      // Display country details
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
            ${borderHTML}
          </div>
        </div>
      `;

      // Hide loading indicator
      loadingDiv.style.display = "none";
    })
    .catch((error) => {
      loadingDiv.textContent = "Error loading country details";
      console.error("Error:", error);
    });
}
