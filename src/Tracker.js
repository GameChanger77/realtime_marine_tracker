import React, { useState, useEffect } from 'react';
import "./Tracker.css";
import DrawGauge from "./dial.js";
import LinearGauge from './gauge.js';
import LineChart from './LineChart.js';
const dataPoints = [10,15,20,30,40,50,10,30];
const Tracker = ({
  humidityThreshold,
  tempThreshold,
  waterThreshold,
  isHumidityWarningOn,
  isTemperatureWarningOn,
  isWaterWarningOn,
}) => {
  const [temp, setTemp] = useState(-999);
  const [humidity, setHumidity] = useState(-1);
  const [waterLevel, setWaterLevel] = useState(-1);
  const [warning, setWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  function loadData(data) {
    console.log(data);
    setTemp(data.temp);
    setHumidity(data.humidity);
    setWaterLevel(data.waterLevel);

    if((data.temp > tempThreshold) && isTemperatureWarningOn){
      setWarning(true)
      setWarningMessage("Temperature is too high!");
    }

    if ((data.humidity > humidityThreshold) && isHumidityWarningOn) {
      setWarning(true);
      setWarningMessage("Humidity is too high!");
    }

    if ((data.waterLevel > waterThreshold) && isWaterWarningOn) {
      setWarning(true);
      setWarningMessage("Water level is too high!");
    }
  }

  function fetchData() {
    fetch("./data.json")
      .then((response) => response.json())
      .then((data) => loadData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }

  // Use useEffect to fetch data on component mount
  useEffect(() => {
    fetchData();

    // Set up interval to fetch data every 2000 milliseconds
    const intervalId = setInterval(fetchData, 2000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures useEffect runs only once on mount
  
  return (
    <div>
      <div id="overlay" style={{ display: warning ? "block" : "none" }}></div>
      <div id="warning" style={{ display: warning ? "block" : "none" }}>
        WARNING!!<br/>{warningMessage}
      </div>
      <div>
  
  <div class="sensor-container">
    <div class="waterlevel-container">
      <LinearGauge waterLevel={waterLevel} limitLevel={waterThreshold}/>
    </div>
      <DrawGauge value={temp} endValue={250} limitValue={tempThreshold} />
      <DrawGauge value={humidity} endValue={100} limitValue={humidityThreshold} />
  </div>
  <div class = "chart-container">
    <LineChart dataPoints={dataPoints} title={"temperature"} maxChartValue={250}/>
    <LineChart dataPoints={dataPoints} title={"humidity"} maxChartValue={100}/>
    <LineChart dataPoints={dataPoints} title={"waterLevel"} maxChartValue={100}/>
  </div>
</div>
</div>
  );
};

export default Tracker;