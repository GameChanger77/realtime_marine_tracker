import logo from "./logo.svg";
import "./App.css";
import Tracker from "./Tracker";
import Settings from "./Settings";
import About from "./About";
import { useState } from "react";

function App() {
  const [page, setPage] = useState(0);
  const [humidityThreshold, setHumidityThreshold] = useState(65);
  const [tempThreshold, setTempThreshold] = useState(200);
  const [waterThreshold, setWaterThreshold] = useState(85);
  const [isHumidityWarningOn, setHumidityWarningOn] = useState(true);
  const [isTemperatureWarningOn, setTemperatureWarningOn] = useState(true);
  const [isWaterWarningOn, setWaterWarningOn] = useState(true);

  const displayPage = () => {
    switch (page) {
      case 0: // Tracker Page
        return <Tracker 
        humidityThreshold={humidityThreshold}
        tempThreshold={tempThreshold}
        waterThreshold={waterThreshold}/>;
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
