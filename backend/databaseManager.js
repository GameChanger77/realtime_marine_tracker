/*
Tim Kuehn
TimKuehn@iastate.edu
Jacob Schulmeister
jdschul5@iastate.edu
11/29/2023*/
var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");

const mariadb = require("mariadb");
const host =  "localhost"; // "10.26.53.178"; 

const pool = mariadb.createPool({
  port: 3307,  // 3306, // 3306 was already in use from mySql on my computer 
  // user: "tim",
  // password: "root",
  host: host,
  user: "root",
  password: "gamer",
  database: "sensordata",
  connectionLimit: 5,
});

app.use(cors());
app.use(bodyParser.json());
const port = "8081";
app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});

app.get("/listData", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("Connected successfully to MariaDB");

    const rows = await conn.query("SELECT * FROM sensordata");
    console.log(rows);
    res.status(200).send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  } finally {
    if (conn) conn.release(); // release to pool
  }
});

app.get("/listData/:id", async (req, res) => {
  let conn;
  const dataID = Number(req.params.id);
  console.log("Data to find:", dataID);

  try {
    conn = await pool.getConnection();
    console.log("Connected successfully to MariaDB");

    const rows = await conn.query("SELECT * FROM sensordata WHERE id = ?", [
      dataID,
    ]);
    console.log("Results:", rows);
    if (rows.length === 0) res.status(404).send("Not Found, Idiot");
    else res.status(200).send(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  } finally {
    if (conn) conn.release(); // release to pool
  }
});

app.get("/latestDataPoints", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("Connected successfully to MariaDB");

    // Fetch the 8 most recent entries
    const rows = await conn.query(
      "SELECT CurrentTime, Humidity, Temperature, Waterlevel FROM sensordata ORDER BY id DESC LIMIT 8"
    );

    // Extract values into separate arrays
    const currentTimeArray = [];
    const humidityArray = [];
    const temperatureArray = [];
    const waterlevelArray = [];

    rows.forEach((row) => {
      currentTimeArray.push(row.CurrentTime);
      humidityArray.push(row.Humidity);
      temperatureArray.push(row.Temperature);
      waterlevelArray.push(row.Waterlevel);
    });

    // Create JSON response
    const jsonResponse = {
      currentTime: currentTimeArray,
      humidity: humidityArray,
      temperature: temperatureArray,
      waterlevel: waterlevelArray,
    };

    if (rows.length === 0) {
      res.status(404).send("No data found");
    } else {
      console.log(jsonResponse)
      res.status(200).json(jsonResponse);
    }

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  } finally {
    if (conn) conn.release(); // release to pool
  }
});


app.get("/latestID", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("Connected successfully to MariaDB");

    const rows = await conn.query(
      "SELECT * FROM sensordata ORDER BY id DESC LIMIT 1"
    );
    console.log("Latest ID result:", rows[0]);

    if (rows.length === 0) {
      res.status(404).send("No data found");
    } else {
      res.status(200).send(rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  } finally {
    if (conn) conn.release(); // release to pool
  }
});

app.get("/settingsData", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("Connected successfully to MariaDB");

    const rows = await conn.query("SELECT * FROM settings");
    console.log(rows);
    res.status(200).send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  } finally {
    if (conn) conn.release(); // release to pool
  }
})

app.put("/updateSettings", async (req, res) => {
  console.log(req.body);
  console.log(req.body.humidityThreshold);

  let conn;

  try {
    conn = await pool.getConnection();
    console.log("Connected successfully to MariaDB");

    // Update all values for the row where id is 0
    const result = await conn.query(
      "UPDATE settings SET HumidityThreshold = ?, TempThreshold = ?, WaterLevelThreshold = ?, warnHumidity = ?, warnTemp = ?, warnWater = ? WHERE id = 1",
      [req.body.humidityThreshold, req.body.tempThreshold, req.body.waterThreshold, req.body.isHumidityWarningOn, req.body.isTemperatureWarningOn, req.body.isWaterWarningOn]
    );

    console.log(result);

    res.status(200).send("Settings updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  } finally {
    if (conn) conn.release(); // Release to pool
  }
});
