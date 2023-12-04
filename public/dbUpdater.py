from datetime import datetime
import time
import json
import mariadb
import sys

# MariaDB Connection Configuration
try:
    conn = mariadb.connect(
        user="root",
        password="root",
        host="localhost",
        port=3306,
        database="sensordata"
    )
except mariadb.Error as e:
    print(f"Error connecting to MariaDB: {e}")
    sys.exit(1)

cursor = conn.cursor()

while True:
    now = datetime.now()
    current_time = now.strftime("%H:00")
    current_time_seconds = now.strftime("%S")

    if current_time_seconds == "50":
        # Fetching the largest 'id' from the 'sensordata' table
        cursor.execute("SELECT MAX(id) FROM sensordata")
        largest_id = cursor.fetchone()[0]
        new_id = largest_id + 1 if largest_id is not None else 1

        # Your existing code to load other data from data.json
        with open('data.json', "r") as f:
            data = json.load(f)
            temp = data.get('temp')
            humidity = data.get('humidity')
            water_level = data.get('waterLevel')

            print(f"Temperature: {temp}")
            print(f"Humidity: {humidity}")
            print(f"Water Level: {water_level}")
            print(f"Current Time: {current_time}")

            # Insert new data into the 'sensordata' table
            try:
                cursor.execute(
                    "INSERT INTO sensordata (id, Temperature, Humidity, WaterLevel, CurrentTime) "
                    "VALUES (?, ?, ?, ?, ?)",
                    (new_id, temp, humidity, water_level, current_time)
                )
                conn.commit()
                print("Data saved successfully!")
            except mariadb.Error as e:
                print(f"Error: {e}")
                conn.rollback()

    time.sleep(1000)

# Close the database connection at the end
conn.close()
