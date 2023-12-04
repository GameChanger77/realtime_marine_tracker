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
  const [tempDataPoints, setTempDataPoints] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [humidityDataPoints, setHumidityDataPoints] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [waterLevelDataPoints, setWaterLevelDataPoints] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [timeArray, setTimeArray] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  
  //const tempDataPoints = [0, 0, 0, 0, 0, 0, 0, 0];
  //const humidityDataPoints = [0, 0, 0, 0, 0, 0, 0, 0];
  //const waterLevelDataPoints = [0, 0, 0, 0, 0, 0, 0, 0];
  //const timeArray = [0, 0, 0, 0, 0, 0, 0, 0];

  function loadData(data) {
    //console.log(data);
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
    fetch('http://10.26.53.178:8081/listData/' + id)
    .then(response => response.json())
    .then(data => {
      //updateTimeDataPoints(data.CurrentTime, id - highestId + 7);
      console.log("CURRENT TIME======" + data.CurrentTime);
      //updateTempDataPoints(data.Temperature, id - highestId + 7);
      //updateHumidityDataPoints(data.Humidity, id - highestId + 7);
      //updateWaterLevelDataPoints(data.WaterLevel, id - highestId + 7);
      console.log(id-highestId+7);
      timeArray[id-highestId+7] = data.CurrentTime;
      humidityDataPoints[id-highestId+7] = data.Humidity;
      tempDataPoints[id-highestId+7] = data.Temperature;
      waterLevelDataPoints[id-highestId+7] = data.WaterLevel;
      
      console.log("waterLevel data poihts:" + waterLevelDataPoints);
      
      console.log("temp data poihts:" + tempDataPoints);
      console.log("humidity data poihts:" + humidityDataPoints);
      console.log("time stuff: " + timeArray);
      
  });
  }

  /*const updateTempDataPoints = (newValue, indexToUpdate) => {
    setTempDataPoints(tempDataPoints => {
      const updatedDataPoints = [...tempDataPoints];
      updatedDataPoints[indexToUpdate] = newValue;
      return updatedDataPoints;
    });
  };
  const updateWaterLevelDataPoints = (newValue, indexToUpdate) => {
    setWaterLevelDataPoints(WaterLevelDataPoints => {
      const updatedDataPoints = [...WaterLevelDataPoints];
      updatedDataPoints[indexToUpdate] = newValue;
      return updatedDataPoints;
    });
  };
  const updateHumidityDataPoints = (newValue, indexToUpdate) => {
    setHumidityDataPoints(humidityDataPoints => {
      const updatedDataPoints = [...humidityDataPoints]; // Create a copy of the array
      updatedDataPoints[indexToUpdate] = newValue; // Update the specific index
      return updatedDataPoints;
    });
  };
  const updateTimeDataPoints = (newValue, indexToUpdate) => {
    setTimeArray(timeArray => {
      const updatedDataPoints = [...timeArray]; // Create a copy of the array
      updatedDataPoints[indexToUpdate] = newValue; // Update the specific index
      return updatedDataPoints;
    });
  };*/

  function getMostRecentData(){
    fetch('http://10.26.53.178:8081/latestID')
    .then(response => response.json())
    .then(data => {
    setHighestId(data.id);
    console.log("highest id: " + data.id);
    for (let i = data.id; i > data.id-8;  i--){
      if (i > 0){
        console.log("====================" + i);
        getMethodById(i);
      }
    }
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
