/*
Tim Kuehn
TimKuehn@iastate.edu
11/29/2023*/
var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "10.26.49.19",
  port: 3306,
  user: "root",
  password: "root",
  database: "sensordata",
  connectionLimit: 5
});


app.use(cors());
app.use(bodyParser.json());
const port = "8081";
const host = "10.26.53.178";
app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});

app.get("/listData", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("Connected successfully to MariaDB");

    const rows = await conn.query("SELECT * FROM sensordata LIMIT 8");
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

    const rows = await conn.query("SELECT * FROM sensordata WHERE id = ?", [dataID]);
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

app.get("/latestID", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("Connected successfully to MariaDB");

    const rows = await conn.query("SELECT * FROM sensordata ORDER BY id DESC LIMIT 1");
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
