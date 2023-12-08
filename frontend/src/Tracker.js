/*
Tim Kuehn
TimKuehn@iastate.edu
Jacob Schulmeister
jdschul5@iastate.edu
11/29/2023*/

import React, { useState, useEffect } from 'react'; 
import "./Tracker.css";
import DrawGauge from "./dial.js";
import LinearGauge from './gauge.js';
import LineChart from './LineChart.js';


const Tracker = ({
  humidityThreshold,
  tempThreshold,
  waterThreshold,
  isHumidityWarningOn,
  isTemperatureWarningOn,
  isWaterWarningOn,
}) => {
  const [temp, setTemp] = useState(100);
  const [humidity, setHumidity] = useState(50);
  const [waterLevel, setWaterLevel] = useState(50);
  const [warning, setWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [tempDataPoints, setTempDataPoints] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [humidityDataPoints, setHumidityDataPoints] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [waterLevelDataPoints, setWaterLevelDataPoints] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [timeArray, setTimeArray] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  
  const address = "http://10.26.49.231:8081/"; // "http://10.26.53.178:8081/"; // Make sure to change settings.js too

  function loadData(data) {
    console.log(data);
    console.log(data.Temperature);
    setTemp(data.Temperature);
    setHumidity(data.Humidity);
    setWaterLevel(data.WaterLevel);

    if((data.Temperature > tempThreshold) && isTemperatureWarningOn){
      setWarning(true)
      setWarningMessage("Temperature is too high!");
    }

    if ((data.Humidity > humidityThreshold) && isHumidityWarningOn) {
      setWarning(true);
      setWarningMessage("Humidity is too high!");
    }

    if ((data.WaterLevel > waterThreshold) && isWaterWarningOn) {
      setWarning(true);
      setWarningMessage("Water level is too high!");
    }
  }

  function fetchData() {
    fetch(address + 'realtimeData')
      .then((response) => response.json())
      .then((data) => loadData(data[0]))
      .catch((error) => console.error("Error fetching data:", error));
  }

  function getMostRecentData(){
  fetch(address + 'latestDataPoints')
  .then(response => response.json())
  .then(data => {
    // Assuming the response data has the same structure as expected (check the API response structure)
    const { temperature, humidity, waterlevel, currentTime } = data;

    // Update state variables with new data
    setTempDataPoints(temperature.reverse() || [0, 0, 0, 0, 0, 0, 0, 0]);
    setHumidityDataPoints(humidity.reverse() || [0, 0, 0, 0, 0, 0, 0, 0]);
    setWaterLevelDataPoints(waterlevel.reverse() || [0, 0, 0, 0, 0, 0, 0, 0]);
    setTimeArray(currentTime.reverse() || [0, 0, 0, 0, 0, 0, 0, 0]);
  })
  .catch(error => {
    console.error('Error fetching latest data points:', error);
  });
  }

  // Use useEffect to fetch data on component mount
  useEffect(() => {
    fetchData();
    getMostRecentData();
    
    const intervalId = setInterval(fetchData, 2000);
    const intervalId2 = setInterval(getMostRecentData, 2000);

    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId);
      clearInterval(intervalId2);
    }
  }, []); // Empty dependency array ensures useEffect runs only once on mount
  
  return (
    <div>
      <div id="overlay" style={{ display: warning ? "block" : "none" }}></div>
      <div id="warning" style={{ display: warning ? "block" : "none" }}>
        WARNING!!<br/>{warningMessage}
      </div>
      <div>
  
  <div className="sensor-container">
    <div className="waterlevel-container">
      <LinearGauge waterLevel={waterLevel} limitLevel={waterThreshold}/>
    </div>
      <DrawGauge value={temp} endValue={250} limitValue={tempThreshold} />
      <DrawGauge value={humidity} endValue={100} limitValue={humidityThreshold} />
  </div>
  <div className = "chart-container">
    <LineChart dataPoints={tempDataPoints} timePoints={timeArray} title={"temperature"} maxChartValue={250}/>
    <LineChart dataPoints={humidityDataPoints} timePoints={timeArray} title={"humidity"} maxChartValue={100}/>
    <LineChart dataPoints={waterLevelDataPoints} timePoints={timeArray} title={"waterLevel"} maxChartValue={100}/>
  </div>
</div>
</div>
  );
};

export default Tracker;
