#!/usr/bin/python

import sys
import Adafruit_DHT
from datetime import datetime
import time
import serial
import json
import mariadb

# MariaDB Connection Configuration
try:
    conn = mariadb.connect(
        user="gamer",
        password="gamer",
        host="localhost",
        port=3306,
        database="sensordata"
    )
except mariadb.Error as e:
    print(f"Error connecting to MariaDB: {e}")
    sys.exit(1)

cursor = conn.cursor()

print("Beginning Realtime Marine Tracking...")

ser = serial.Serial('/dev/ttyACM0', 9600)

lastTemp = None
lastHumidity = None

while True:
    waterLevel = 0

    if ser.in_waiting > 0:
        try:
            waterLevel = int(ser.readline().decode('utf-8').rstrip())
        except Exception as e:
            print(e)

    humidity = -1
    temperature = -99999
    humidity, temperature = Adafruit_DHT.read(11, 4)

    if humidity is None and temperature is None and lastTemp is not None and lastHumidity is not None:
        humidity = lastHumidity
        temperature = lastTemp

    waterLevel = 1.1159 * (waterLevel) - 353

    # Real-time data
    dictionary = {
        "temp": temperature,
        "humidity": humidity,
        "waterLevel": waterLevel
    }

    # Insert real-time data into the 'realtimeData' table
    try:
        cursor.execute(
            "UPDATE realtimeData SET Temperature = ?, Humidity = ?, WaterLevel = ? WHERE id = 1",
            (temperature, humidity, waterLevel)
        )
        conn.commit()
        print("Real-time data updated successfully!")
    except mariadb.Error as e:
        print(f"Error updating real-time data: {e}")
        conn.rollback()

    # Hourly data
    now = datetime.now()
    current_time = now.strftime("%H:00")
    current_time_seconds = now.strftime("%S")

    if current_time_seconds == "20":
        # Fetching the largest 'id' from the 'sensordata' table
        cursor.execute("SELECT MAX(id) FROM sensordata")
        largest_id = cursor.fetchone()[0]
        new_id = largest_id + 1 if largest_id is not None else 1

        # Your existing code to load other data
        temp = dictionary.get('temp')
        humidity = dictionary.get('humidity')
        water_level = dictionary.get('waterLevel')

        print(f"Temperature: {temp}")
        print(f"Humidity: {humidity}")
        print(f"Water Level: {water_level}")
        print(f"Current Time: {current_time}")

        # Insert hourly data into the 'sensordata' table
        try:
            cursor.execute(
                "INSERT INTO sensordata (id, Temperature, Humidity, WaterLevel, CurrentTime) "
                "VALUES (?, ?, ?, ?, ?)",
                (new_id, temp, humidity, water_level, current_time)
            )
            conn.commit()
            print("Hourly data saved successfully!")
        except mariadb.Error as e:
            print(f"Error saving hourly data: {e}")
            conn.rollback()

    time.sleep(1)

# Close the database connection at the end
conn.close()
