// Global variables
let allCountries = [];
let filteredCountries = [];

// DOM elements
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const countriesContainer = document.getElementById("countries");
const loadingDiv = document.getElementById("loading");
const themeBtn = document.getElementById("theme-btn");

// Initialize app
init();

function init() {
  loadTheme();
  setupEventListeners();
  fetchCountries();
}

// Theme functions
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
  searchInput.addEventListener("input", handleSearch);
  filterSelect.addEventListener("change", handleFilter);
}

// API functions
async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    allCountries = await response.json();
    filteredCountries = allCountries;
    displayCountries();
    loadingDiv.style.display = "none";
  } catch (error) {
    loadingDiv.textContent = "Error loading countries";
    console.error("Error:", error);
  }
}

// Search and filter functions
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedRegion = filterSelect.value;

  filteredCountries = allCountries.filter((country) => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(searchTerm);
    const matchesRegion = !selectedRegion || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  displayCountries();
}

function handleFilter() {
  const selectedRegion = filterSelect.value;
  const searchTerm = searchInput.value.toLowerCase();

  filteredCountries = allCountries.filter((country) => {
    const matchesRegion = !selectedRegion || country.region === selectedRegion;
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(searchTerm);
    return matchesRegion && matchesSearch;
  });

  displayCountries();
}

// Display functions
function displayCountries() {
  if (filteredCountries.length === 0) {
    countriesContainer.innerHTML = "<p>No countries found</p>";
    return;
  }

  countriesContainer.innerHTML = filteredCountries
    .map(
      (country) => `
        <a href="country.html?name=${country.name.common}" class="country">
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
            <div class="country-info">
                <div class="country-name">${country.name.common}</div>
                <div class="country-details">
                    <div><span class="label">Population:</span> ${country.population.toLocaleString()}</div>
                    <div><span class="label">Region:</span> ${
                      country.region
                    }</div>
                    <div><span class="label">Capital:</span> ${
                      country.capital ? country.capital[0] : "N/A"
                    }</div>
                </div>
            </div>
        </a>
    `
    )
    .join("");
}
