import "./Settings.css";
import React, { useState, useEffect } from "react";

const Settings = ({
  humidityThreshold,
  setHumidityThreshold,
  tempThreshold,
  setTempThreshold,
  waterThreshold,
  setWaterThreshold,
  isHumidityWarningOn,
  setHumidityWarningOn,
  isTemperatureWarningOn,
  setTemperatureWarningOn,
  isWaterWarningOn,
  setWaterWarningOn,
}) => {

  function handleEnterKeyPress(event, thresholdType) {
    if (event.key === "Enter") {
      const newValue = parseInt(event.target.value, 10);

      if (!isNaN(newValue)) {
        // Update state
        switch (thresholdType) {
          case "humidity":
            setHumidityThreshold(newValue);
            break;
          case "temperature":
            setTempThreshold(newValue);
            break;
          case "waterLevel":
            setWaterThreshold(newValue);
            break;
          default:
            break;
        }
      } else {
        alert("Please enter a valid number.");
        // Reset the input value to the previous state
        switch (thresholdType) {
          case "humidity":
            event.target.value = humidityThreshold;
            break;
          case "temperature":
            event.target.value = tempThreshold;
            break;
          case "waterLevel":
            event.target.value = waterThreshold;
            break;
          default:
            break;
        }
      }
    }
  }

  return (
    <div>
      <h1>Alert Thresholds</h1>
      <p>
        Type in a value without units and press enter to change the Thresholds.
        Use the toggle buttons to the right to turn the warning system on or
        off.
      </p>
      <div>
        <div>
          <span className="infoBox">Humidity Level: </span>
          <span className="thresholdBox">
            <input
              type="text"
              id="humidity"
              placeholder={humidityThreshold + "%"}
              onKeyPress={(e) => handleEnterKeyPress(e, "humidity")}
            />
          </span>
          <span>
            <button
              className={`toggleSwitch ${isHumidityWarningOn ? "on" : ""}`}
              onClick={() => setHumidityWarningOn(!isHumidityWarningOn)}
            >
              {isHumidityWarningOn ? "On" : "Off"}
            </button>
          </span>
        </div>
      </div>
      <div>
        <div>
          <span className="infoBox">Temperature Level: </span>
          <span className="thresholdBox">
            <input
              type="text"
              id="temperature"
              placeholder={tempThreshold + "°F"}
              onKeyPress={(e) => handleEnterKeyPress(e, "temperature")}
            />
          </span>
          <span>
            <button
              className={`toggleSwitch ${isTemperatureWarningOn ? "on" : ""}`}
              onClick={() => setTemperatureWarningOn(!isTemperatureWarningOn)}
            >
              {isTemperatureWarningOn ? "On" : "Off"}
            </button>
          </span>
        </div>
      </div>
      <div>
        <div>
          <span className="infoBox">Water Level: </span>
          <span className="thresholdBox">
            <input
              type="text"
              id="water"
              placeholder={waterThreshold + "%"}
              onKeyPress={(e) => handleEnterKeyPress(e, "waterLevel")}
            />
          </span>
          <span>
            <button
              className={`toggleSwitch ${isWaterWarningOn ? "on" : ""}`}
              onClick={() => setWaterWarningOn(!isWaterWarningOn)}
            >
              {isWaterWarningOn ? "On" : "Off"}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
