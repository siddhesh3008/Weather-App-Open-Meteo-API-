# ☁️ SkyPulse — Live Weather App

A beautiful, responsive weather web app with a **mobile-first design** that fetches real-time weather data using the [Open-Meteo API](https://open-meteo.com/). Built with pure HTML, CSS, and JavaScript — **no frameworks, no API keys, no backend.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Open-Meteo](https://img.shields.io/badge/API-Open--Meteo-blue?style=flat)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **City Search** | Search any city worldwide using the Open-Meteo Geocoding API |
| 🌡️ **Current Weather** | Real-time temperature, humidity, wind speed & direction |
| 🎨 **Weather Icons** | Emoji-based icons mapped from WMO weather codes |
| 📱 **Mobile App Design** | Phone-shell UI with status bar, glassmorphism, and smooth animations |
| 🕐 **Recent Searches** | Last 5 cities saved in `localStorage` with one-click removal |
| ⚡ **Loading States** | Spinner while fetching, shake animation on errors |
| 📐 **Fully Responsive** | Adapts from mobile (full-screen) to desktop (centered phone shell) |
| 🚫 **No Dependencies** | Pure vanilla HTML/CSS/JS — zero build tools required |

---

## 🖼️ Preview

<p align="center">
  <img src="https://github.com/user-attachments/assets/placeholder" alt="SkyPulse Weather App Preview" width="380" />
</p>

> ⚠️ *Replace the placeholder above with an actual screenshot after deployment.*

---

## 📁 Project Structure

```
Weather App (Open-Meteo API)/
├── index.html      → Main UI layout (semantic HTML5)
├── style.css       → Styling, gradients, glassmorphism, responsive design
├── app.js          → API logic, DOM manipulation, localStorage
├── .gitignore      → Git ignore rules
└── README.md       → Project documentation
```

---

## 🚀 Getting Started

### Run Locally

No installation needed. Just open the HTML file:

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/weather-app-open-meteo.git
   cd weather-app-open-meteo
   ```

2. **Open in browser**
   - Double-click `index.html`, **or**
   - Use VS Code Live Server extension, **or**
   - Run a local server:
     ```bash
     npx serve .
     ```

3. **Search a city** and see the weather! 🌤️

---

## 🌐 API Reference

This app uses two **free, open-source APIs** from [Open-Meteo](https://open-meteo.com/) — **no API key required**.

| API | Endpoint | Purpose |
|-----|----------|---------|
| **Geocoding** | `geocoding-api.open-meteo.com/v1/search` | Convert city name → latitude/longitude |
| **Forecast** | `api.open-meteo.com/v1/forecast` | Fetch current weather by coordinates |

### Data Fetched
- `temperature_2m` — Current temperature (°C)
- `relative_humidity_2m` — Humidity (%)
- `wind_speed_10m` — Wind speed (km/h)
- `wind_direction_10m` — Wind direction (degrees → compass)
- `weather_code` — WMO code mapped to description & emoji icon

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure, accessibility attributes
- **CSS3** — Custom properties, gradients, glassmorphism, `backdrop-filter`, CSS Grid, Flexbox, keyframe animations
- **JavaScript (ES6+)** — `async/await`, `fetch()`, `localStorage`, DOM API
- **Google Fonts** — [Inter](https://fonts.google.com/specimen/Inter) typeface
- **Open-Meteo API** — Free weather data (no key required)

---

## 📦 Deployment

This is a **static site** — no server, no build step. Deploy anywhere:

| Platform | How | Free? |
|----------|-----|-------|
| **[GitHub Pages](https://pages.github.com/)** | Push to repo → Settings → Pages → Deploy from `main` | ✅ |
| **[Netlify](https://netlify.com/)** | Drag & drop folder or connect GitHub repo | ✅ |
| **[Vercel](https://vercel.com/)** | Import GitHub repo → auto-deploy | ✅ |

> **No additional configuration needed.** Just upload the 3 files and it works.

### Deploy to GitHub Pages (Recommended)

1. Push your code to a GitHub repository
2. Go to **Settings → Pages**
3. Under **Source**, select `Deploy from a branch`
4. Choose `main` branch and `/ (root)` folder
5. Click **Save** — your app will be live at `https://username.github.io/repo-name/`

---

## 📄 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

---

<p align="center">
  Built with ❤️ using <a href="https://open-meteo.com/">Open-Meteo</a>
</p>
