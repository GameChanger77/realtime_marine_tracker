from datetime import datetime
import time
import json
from pymongo import MongoClient

# Establish a connection to MongoDB
client = MongoClient('10.26.49.19', 27017)  # Update with your MongoDB connection details
db = client.SensorData  # Assuming SensorData is your database name
collection = db.timeData  # Assuming timeData is your collection name

while True:
    now = datetime.now()
    current_time = now.strftime("%H:00")
    current_time_seconds = now.strftime("%S")

    if current_time_seconds == "50":
        # Get the largest 'id' from the 'timeData' collection
        largest_id_doc = collection.find_one(sort=[("id", -1)])  # Sort by 'id' descending
        if largest_id_doc:
            biggestID = largest_id_doc.get('id')
            new_id = biggestID + 1 if biggestID is not None else 1

            # Your existing code to load other data from test.json
            with open('data.json', "r") as f:
                data = json.load(f)

                temp = data.get('temp')
                humidity = data.get('humidity')
                water_level = data.get('waterLevel')

                print(f"Temperature: {temp}")
                print(f"Humidity: {humidity}")
                print(f"Water Level: {water_level}")
                print(f"Current Time: {current_time}")

                # Create a new document and insert it into the collection
                new_document = {
                    'id': new_id,
                    'Temperature': temp,
                    'Humidity': humidity,
                    'WaterLevel': water_level,
                    'CurrentTime': current_time
                }
                collection.insert_one(new_document)
                print("Data saved successfully!")

        time.sleep(1000)
