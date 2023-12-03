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
  const [temp, setTemp] = useState(-999);
  const [humidity, setHumidity] = useState(-1);
  const [waterLevel, setWaterLevel] = useState(-1);
  const [warning, setWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [highestId, setHighestId] = useState(0);
  const [tempDataPoints, setTempDataPoints] = useState([]);
  const [humidityDataPoints, setHumidityDataPoints] = useState([]);
  const [waterLevelDataPoints, setWaterLevelDataPoints] = useState([]);
  const [timeArray, setTimeArray] = useState([]);

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

  function getMethodById(id) {
    fetch('http://localhost:8081/listData/' + id)
    .then(response => response.json())
    .then(data => {
      updateTimeDataPoints(data.CurrentTime, id - highestId + 7);
      updateTempDataPoints(data.Temperature, id - highestId + 7);
      updateHumidityDataPoints(data.Humidity, id - highestId + 7);
      updateWaterLevelDataPoints(data.WaterLevel, id - highestId + 7);
      console.log(waterLevelDataPoints);
  });
  }

  const updateTempDataPoints = (newValue, indexToUpdate) => {
    setTempDataPoints(tempDataPoints => {
      const updatedDataPoints = [...tempDataPoints]; // Create a copy of the array
      updatedDataPoints[indexToUpdate] = newValue; // Update the specific index
      return updatedDataPoints.slice(0,8); // Set the state with the updated array
    });
  };
  const updateWaterLevelDataPoints = (newValue, indexToUpdate) => {
    setWaterLevelDataPoints(waterLevelDataPoints => {
      const updatedDataPoints = [...waterLevelDataPoints]; // Create a copy of the array
      updatedDataPoints[indexToUpdate] = newValue; // Update the specific index
      return updatedDataPoints.slice(0,8); // Set the state with the updated array
    });
  };
  const updateHumidityDataPoints = (newValue, indexToUpdate) => {
    setHumidityDataPoints(humidityDataPoints => {
      const updatedDataPoints = [...humidityDataPoints]; // Create a copy of the array
      updatedDataPoints[indexToUpdate] = newValue; // Update the specific index
      return updatedDataPoints.slice(0,8); // Set the state with the updated array
    });
  };
  const updateTimeDataPoints = (newValue, indexToUpdate) => {
    setTimeArray(timeArray => {
      const updatedDataPoints = [...timeArray]; // Create a copy of the array
      updatedDataPoints[indexToUpdate] = newValue; // Update the specific index
      return updatedDataPoints.slice(0,8); // Set the state with the updated array
    });
  };

  function getMostRecentData(){
    //setTempDataPoints();
    fetch('http://localhost:8081/latestID')
    .then(response => response.json())
    .then(data => {
    setHighestId(data.id);
    for (let i = data.id; i > data.id-8;  i--){
      if (i > 0)
        getMethodById(i);
    }
     console.log(tempDataPoints); 
  });
    
  }

  // Use useEffect to fetch data on component mount
  useEffect(() => {
    
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
  
  <div class="sensor-container">
    <div class="waterlevel-container">
      <LinearGauge waterLevel={waterLevel} limitLevel={waterThreshold}/>
    </div>
      <DrawGauge value={temp} endValue={250} limitValue={tempThreshold} />
      <DrawGauge value={humidity} endValue={100} limitValue={humidityThreshold} />
  </div>
  <div class = "chart-container">
    <LineChart dataPoints={tempDataPoints} timePoints={timeArray} title={"temperature"} maxChartValue={250}/>
    <LineChart dataPoints={humidityDataPoints} timePoints={timeArray} title={"humidity"} maxChartValue={100}/>
    <LineChart dataPoints={waterLevelDataPoints} timePoints={timeArray} title={"waterLevel"} maxChartValue={100}/>
  </div>
</div>
</div>
  );
};

export default Tracker;