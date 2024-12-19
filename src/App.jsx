import React, { useState } from "react";
import sunImg from "./assets/sun.png";
import rainImg from "./assets/rain.png";
import rainLightningImg from "./assets/rt.png";
import sunCloudy from "./assets/sc.png";
import sunRain from "./assets/sr.png";

function App() {
  const [city, setCity] = useState("");
  const [gData, setGData] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      try {
        await fetchCityData(city);
      } catch (error) {
        console.error("Error in handleKeyDown:", error);
      }
    }
  };

  const fetchCityData = async (cityName) => {
    const myApiKey = "0a930ee91db49bfd351e686df05556d6";

    if (!cityName.trim()) {
      setErrorMessage("Please enter a valid city name.");
      return;
    }

    try {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${myApiKey}`
      );

      if (!geoResponse.ok) {
        throw new Error(`Geocoding API error: ${geoResponse.status}`);
      }

      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        setErrorMessage("No data found for the given city.");
        return;
      }

      setGData(geoData[0].name);
      const { lat, lon } = geoData[0];

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myApiKey}`
      );

      if (!weatherResponse.ok) {
        throw new Error(`Weather API error: ${weatherResponse.status}`);
      }

      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(`Error: ${error.message}`);
    }
  };

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes("cloud")) {
      return sunCloudy;
    } else if (desc.includes("rain")) {
      return rainImg;
    } else if (desc.includes("sun")) {
      return sunImg;
    } else if (desc.includes("storm")) {
      return rainLightningImg;
    }
    return sunRain;
  };

  return (
    <div
      className="app-wrapper"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <div
        className="app-container"
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#1e293b",
          color: "#fff",
          borderRadius: "20px",
          width: "400px",
          textAlign: "center",
          padding: "20px",
        }}
      >
        {/* Header Section */}
        <div
          className="header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <button className="icon-btn">
            <i className="fa-solid fa-bars"></i>
          </button>

          <div>
            <i className="fa-solid fa-location-dot"></i>
            <span style={{ marginLeft: "10px", fontWeight: "bold" }}>{gData}</span>
          </div>

          <button className="icon-btn">
            <i className="fa-solid fa-star"></i>
          </button>
        </div>

        <input
          type="text"
          className="city-input"
          placeholder="Search City..."
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{
            padding: "10px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            width: "100%",
            marginBottom: "20px",
          }}
        />

        {/* Main Content */}
        <div className="content">
          {errorMessage ? (
            <p style={{ color: "red" }}>{errorMessage}</p>
          ) : weatherData ? (
            <div className="weather-display">
              <h1 style={{ fontSize: "3rem", color: "#fff" }}>
                {parseFloat(weatherData.list[0].main.temp - 273.15).toFixed(2)}°C
              </h1>
              <img
                src={getWeatherIcon(weatherData.list[0].weather[0].description)}
                alt="Weather Icon"
                style={{
                  width: "150px",
                  height: "150px",
                  margin: "20px auto",
                }}
              />
              <p style={{ fontSize: "1.2rem", color: "#f1f5f9" }}>
                {weatherData.list[0].weather[0].description}
              </p>
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#f1f5f9" }}>
              Type a city name and press Enter to get the weather data.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
