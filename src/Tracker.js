import React, { useState, useEffect } from 'react';

const Tracker = () => {
  const [data, setData] = useState([]);
  const [temp, setTemp] = useState(-999);
  const [humidity, setHumidity] = useState(-1);
  const [waterLevel, setWaterLevel] = useState(-1);

  function loadData(data) {
    console.log(data);
    setData(data);
    setTemp(data.temp);
    setHumidity(data.humidity);
    setWaterLevel(data.waterLevel);
  }

  function fetchData() {
    fetch('./data.json')
      .then((response) => response.json())
      .then((data) => loadData(data))
      .catch((error) => console.error('Error fetching data:', error));
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
      this is the tracker page
      <div>{humidity}</div>
    </div>
  );
};

export default Tracker;
