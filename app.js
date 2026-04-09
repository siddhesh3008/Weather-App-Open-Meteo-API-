/* ═══════════════════════════════════════════════════════════
   SkyPulse — Weather App Logic
   Uses Open-Meteo Geocoding & Forecast APIs (no API key needed)
   ═══════════════════════════════════════════════════════════ */

// ── API Endpoints ────────────────────────────────────────
const GEO_API  = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// ── DOM References ───────────────────────────────────────
const searchForm     = document.getElementById('search-form');
const cityInput      = document.getElementById('city-input');
const loader         = document.getElementById('loader');
const errorBox       = document.getElementById('error-box');
const errorMsg       = document.getElementById('error-msg');
const weatherCard    = document.getElementById('weather-card');
const welcome        = document.getElementById('welcome');
const recentSection  = document.getElementById('recent-searches');
const recentList     = document.getElementById('recent-list');
const statusTime     = document.getElementById('status-time');

// Weather display elements
const elCityName     = document.getElementById('city-name');
const elCityCountry  = document.getElementById('city-country');
const elFetchedTime  = document.getElementById('fetched-time');
const elWeatherIcon  = document.getElementById('weather-icon');
const elTemperature  = document.getElementById('temperature');
const elWeatherDesc  = document.getElementById('weather-desc');
const elWindSpeed    = document.getElementById('wind-speed');
const elWindDir      = document.getElementById('wind-direction');
const elHumidity     = document.getElementById('humidity');

// ── localStorage key for recent cities ───────────────────
const STORAGE_KEY = 'skypulse_recent';
const MAX_RECENT  = 5;

// ══════════════════════════════════════════════════════════
//  WMO Weather Code Mapping
// ══════════════════════════════════════════════════════════
const WMO_CODES = {
  0:  { desc: 'Clear sky',              icon: '☀️' },
  1:  { desc: 'Mainly clear',           icon: '🌤️' },
  2:  { desc: 'Partly cloudy',          icon: '⛅' },
  3:  { desc: 'Overcast',               icon: '☁️' },
  45: { desc: 'Foggy',                  icon: '🌫️' },
  48: { desc: 'Depositing rime fog',    icon: '🌫️' },
  51: { desc: 'Light drizzle',          icon: '🌦️' },
  53: { desc: 'Moderate drizzle',       icon: '🌦️' },
  55: { desc: 'Dense drizzle',          icon: '🌧️' },
  56: { desc: 'Freezing light drizzle', icon: '🌧️' },
  57: { desc: 'Freezing dense drizzle', icon: '🌧️' },
  61: { desc: 'Slight rain',            icon: '🌧️' },
  63: { desc: 'Moderate rain',          icon: '🌧️' },
  65: { desc: 'Heavy rain',             icon: '🌧️' },
  66: { desc: 'Light freezing rain',    icon: '🌧️' },
  67: { desc: 'Heavy freezing rain',    icon: '🌧️' },
  71: { desc: 'Slight snowfall',        icon: '🌨️' },
  73: { desc: 'Moderate snowfall',      icon: '🌨️' },
  75: { desc: 'Heavy snowfall',         icon: '❄️' },
  77: { desc: 'Snow grains',            icon: '❄️' },
  80: { desc: 'Slight rain showers',    icon: '🌦️' },
  81: { desc: 'Moderate rain showers',  icon: '🌧️' },
  82: { desc: 'Violent rain showers',   icon: '⛈️' },
  85: { desc: 'Slight snow showers',    icon: '🌨️' },
  86: { desc: 'Heavy snow showers',     icon: '❄️' },
  95: { desc: 'Thunderstorm',           icon: '⛈️' },
  96: { desc: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { desc: 'Thunderstorm with heavy hail',  icon: '⛈️' },
};

/**
 * Convert wind direction degrees to compass label.
 */
function degreesToCompass(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE',
                'S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

/**
 * Decode WMO weather code to description + icon.
 */
function decodeWeather(code) {
  return WMO_CODES[code] || { desc: `Code ${code}`, icon: '🌡️' };
}

// ══════════════════════════════════════════════════════════
//  UI Helpers
// ══════════════════════════════════════════════════════════

/** Hide all content states, then show the requested one. */
function showSection(section) {
  // Hide everything
  loader.classList.add('hidden');
  errorBox.classList.add('hidden');
  weatherCard.classList.add('hidden');
  welcome.classList.add('hidden');

  if (section) {
    section.classList.remove('hidden');
    // Re-trigger entrance animation on weather display
    if (section === weatherCard) {
      section.style.animation = 'none';
      void section.offsetWidth;
      section.style.animation = '';
    }
  }
}

/** Display an error message. */
function showError(message) {
  errorMsg.textContent = message;
  showSection(errorBox);
}

// ══════════════════════════════════════════════════════════
//  Status Bar Clock
// ══════════════════════════════════════════════════════════
function updateClock() {
  const now = new Date();
  statusTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
updateClock();
setInterval(updateClock, 30000);

// ══════════════════════════════════════════════════════════
//  Recent Searches (localStorage)
// ══════════════════════════════════════════════════════════

function loadRecent() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveRecent(city) {
  let list = loadRecent();
  list = list.filter(c => c.toLowerCase() !== city.toLowerCase());
  list.unshift(city);
  if (list.length > MAX_RECENT) list = list.slice(0, MAX_RECENT);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  renderRecent();
}

function removeRecent(city) {
  let list = loadRecent();
  list = list.filter(c => c.toLowerCase() !== city.toLowerCase());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  renderRecent();
}

function renderRecent() {
  const list = loadRecent();
  if (list.length === 0) {
    recentSection.classList.add('hidden');
    return;
  }
  recentSection.classList.remove('hidden');
  recentList.innerHTML = '';

  list.forEach(city => {
    const chip = document.createElement('div');
    chip.className = 'recent-chip';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'recent-chip-name';
    nameSpan.textContent = city;
    nameSpan.addEventListener('click', () => {
      cityInput.value = city;
      fetchWeather(city);
    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'recent-chip-remove';
    removeBtn.type = 'button';
    removeBtn.title = `Remove ${city}`;
    removeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeRecent(city);
    });

    chip.appendChild(nameSpan);
    chip.appendChild(removeBtn);
    recentList.appendChild(chip);
  });
}

// ══════════════════════════════════════════════════════════
//  API Logic
// ══════════════════════════════════════════════════════════

async function fetchWeather(city) {
  const trimmed = city.trim();
  if (!trimmed) return;

  showSection(loader);

  try {
    // Step 1: Geocode
    const geoUrl = `${GEO_API}?name=${encodeURIComponent(trimmed)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error(`Geocoding error (HTTP ${geoRes.status})`);

    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      showError(`City "${trimmed}" not found. Check spelling and try again.`);
      return;
    }

    const { latitude, longitude, name, country, admin1 } = geoData.results[0];

    // Step 2: Fetch weather
    const wxUrl = `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m`;
    const wxRes = await fetch(wxUrl);
    if (!wxRes.ok) throw new Error(`Weather API error (HTTP ${wxRes.status})`);

    const wxData = await wxRes.json();
    const cw = wxData.current;

    // Step 3: Decode
    const { desc, icon } = decodeWeather(cw.weather_code);

    // Step 4: Populate UI
    elCityName.textContent    = name;
    elCityCountry.textContent = [admin1, country].filter(Boolean).join(', ');
    elFetchedTime.textContent = `Updated ${new Date(cw.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    elWeatherIcon.textContent = icon;
    elTemperature.textContent = `${cw.temperature_2m}°`;
    elWeatherDesc.textContent = desc;
    elWindSpeed.textContent   = `${cw.wind_speed_10m} km/h`;
    elWindDir.textContent     = `${degreesToCompass(cw.wind_direction_10m)}`;
    elHumidity.textContent    = `${cw.relative_humidity_2m}%`;

    showSection(weatherCard);
    saveRecent(name);

  } catch (err) {
    console.error('fetchWeather error:', err);
    showError(err.message || 'Something went wrong. Check your connection.');
  }
}

// ══════════════════════════════════════════════════════════
//  Event Listeners
// ══════════════════════════════════════════════════════════

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  fetchWeather(cityInput.value);
});

// ── Init ─────────────────────────────────────────────────
renderRecent();
