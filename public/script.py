#!/usr/bin/python

# This is the code that should be ran on the raspberry pi to update the data.json file with the data from the two sensors.
# Below are some commands to help get the necessary libraries installed but it may not be comprehensive. 
#
# sudo apt-get install git-core

# git clone https://github.com/adafruit/Adafruit_Python_DHT.git

# sudo apt-get install build-essential python-dev

# sudo python setup.py install
#
#
import sys
import Adafruit_DHT
import json
import serial

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
    
    dictionary = {
    "temp" : temperature,
    "humidity" : humidity,
    "waterLevel" : waterLevel
    }
    
    with open("data.json", "w") as outfile:
        json.dump(dictionary, outfile)
    
    # print('Temp: {0:0.1f} C  Humidity: {1:0.1f} % Water Level:{0:0.1f}'.format(temperature, humidity, waterLevel))
    print(f'Temp: {temperature} C  Humidity: {humidity} % Water Level:{waterLevel}')
    lastTemp = temperature
    lastHumidity = humidity
    
