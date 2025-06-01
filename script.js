// DOM elements
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const countriesContainer = document.getElementById("countries");
const loadingDiv = document.getElementById("loading");
const themeBtn = document.getElementById("theme-btn");

// Initialize app
let countries = [];

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

searchInput.addEventListener("input", updateDisplay);
filterSelect.addEventListener("change", updateDisplay);

// Fetch countries
fetch("https://restcountries.com/v3.1/all")
  .then((response) => response.json())
  .then((data) => {
    countries = data;
    updateDisplay();
    loadingDiv.style.display = "none";
  })
  .catch((error) => {
    loadingDiv.textContent = "Error loading countries";
    console.error("Error:", error);
  });

// Update display based on search and filter
function updateDisplay() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedRegion = filterSelect.value;

  const filtered = countries.filter((country) => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(searchTerm);
    const matchesRegion = !selectedRegion || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  if (filtered.length === 0) {
    countriesContainer.innerHTML = "<p>No countries found</p>";
    return;
  }

  countriesContainer.innerHTML = filtered
    .map(
      (country) => `
    <a href="country.html?name=${country.name.common}" class="country">
      <img src="${country.flags.svg}" alt="${country.name.common} flag">
      <div class="country-info">
        <div class="country-name">${country.name.common}</div>
        <div class="country-details">
          <div><span class="label">Population:</span> ${country.population.toLocaleString()}</div>
          <div><span class="label">Region:</span> ${country.region}</div>
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
