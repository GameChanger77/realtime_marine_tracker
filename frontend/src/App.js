import logo from "./logo.svg";
import "./App.css";
import Tracker from "./Tracker";
import Settings from "./Settings";
import About from "./About";
import { useState, useEffect } from "react";

function App() {
  const [page, setPage] = useState(0);
  const [shouldUpdateSettings, setUpdateSettings] = useState(false);
  const [humidityThreshold, setHumidityThreshold] = useState(65);
  const [tempThreshold, setTempThreshold] = useState(200);
  const [waterThreshold, setWaterThreshold] = useState(85);
  const [isHumidityWarningOn, setHumidityWarningOn] = useState(true);
  const [isTemperatureWarningOn, setTemperatureWarningOn] = useState(true);
  const [isWaterWarningOn, setWaterWarningOn] = useState(true);

  const address = "http://localhost:8081/"; // "http://10.26.53.178:8081/"; // Make sure to change tracker.js too

  useEffect(() => {
    if (!shouldUpdateSettings)
      loadSettings();
  }, []);

  useEffect(() => {
    if (shouldUpdateSettings){
      updateSettings();
    }
  }, [
    humidityThreshold,
    tempThreshold,
    waterThreshold,
    isHumidityWarningOn,
    isTemperatureWarningOn,
    isWaterWarningOn,
  ]);

  function loadSettings() {
    fetch(address + 'settingsData')
    .then(response => response.json())
    .then(data => {
      console.log("Below is the data from loading the settings");
      console.log(data[0]);
      setHumidityThreshold(data[0].HumidityThreshold);
      setTempThreshold(data[0].TempThreshold);
      setWaterThreshold(data[0].WaterLevelThreshold);
      setHumidityWarningOn(data[0].warnHumidity);
      setTemperatureWarningOn(data[0].warnTemp);
      setWaterWarningOn(data[0].warnWater);
      setUpdateSettings(true);
    })
    .catch(error => {
      console.error('Error fetching latest data points:', error);
    });
  }

  const updateSettings = async () => {
    try {
      const response = await fetch(address + "updateSettings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          humidityThreshold: humidityThreshold,
          tempThreshold: tempThreshold,
          waterThreshold: waterThreshold,
          isHumidityWarningOn: isHumidityWarningOn,
          isTemperatureWarningOn: isTemperatureWarningOn,
          isWaterWarningOn: isWaterWarningOn,
        }),
      });

      if (response.ok) {
        console.log("Settings updated successfully");
      } else {
        console.error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const displayPage = () => {
    switch (page) {
      case 0: // Tracker Page
        return <Tracker 
        humidityThreshold={humidityThreshold}
        tempThreshold={tempThreshold}
        waterThreshold={waterThreshold}
        isHumidityWarningOn={isHumidityWarningOn}
        isTemperatureWarningOn={isTemperatureWarningOn}
        isWaterWarningOn={isWaterWarningOn}/>;
      case 1: // Settings Page
        return <Settings 
        humidityThreshold={humidityThreshold}
        setHumidityThreshold={setHumidityThreshold}
        tempThreshold={tempThreshold}
        setTempThreshold={setTempThreshold}
        waterThreshold={waterThreshold}
        setWaterThreshold={setWaterThreshold}
        isHumidityWarningOn={isHumidityWarningOn}
        setHumidityWarningOn={setHumidityWarningOn}
        isTemperatureWarningOn={isTemperatureWarningOn}
        setTemperatureWarningOn={setTemperatureWarningOn}
        isWaterWarningOn={isWaterWarningOn}
        setWaterWarningOn={setWaterWarningOn}
        />;
      case 2: // About Page
        return <About />;
    }
  };

  const displayMenuButtons = () => {
    switch (page) {
      case 0:
        return (
          <div>
            <p>
              <button id="settings-button" className="primary-button" onClick={handleSettingsButtonClick}>⚙</button>
              <button id="about-button" className="secondary-button" onClick={handleAboutButtonClick}>About</button>
            </p>
          </div>
        );
      case 1:
        return (
          <div>
            <p>
                <button id="about-button" className="secondary-button" onClick={handleAboutButtonClick}>About</button>
                <button id="settings-button" className="primary-button" onClick={handleTrackerButtonClick}><img src="/images/icons8-temperature-32.png" alt="Tracker"/></button>
            </p>
          </div>
        );
        case 2:
          return (
            <div>
              <p>
              <button id="settings-button" className="secondary-button" onClick={handleSettingsButtonClick}>⚙</button>
              <button id="tracker-button" className="primary-button" onClick={handleTrackerButtonClick}><img src="/images/icons8-temperature-32.png" alt="Tracker"/></button>
              </p>
            </div>
          );
    }
  }

  const handleAboutButtonClick = () => {
    setPage(2);
  };

  const handleSettingsButtonClick = () => {
    setPage(1);
  };

  const handleTrackerButtonClick = () => {
    setPage(0);
  }

  return (
    <div>
      <header>
        <h1>Realtime Marine Tracker</h1>
        {displayMenuButtons()}
      </header>

      <div className="content">
        {displayPage()}
      </div>

      <footer>
        <div>
          <p>© 2023 Timothy Kuehn & Jacob Schulmeister V</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
