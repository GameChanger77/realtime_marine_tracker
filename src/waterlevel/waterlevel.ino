// This is the code to be ran on the arduino in order to gather the water level sensor data and send it to the 
// raspberry pi via usb.

int adc_id = 0;
char printBuffer[128];

void setup()
{
  Serial.begin(9600);
}

void loop()
{
    int value = analogRead(adc_id); // get adc value

    sprintf(printBuffer,"%d\n", value);
    Serial.print(printBuffer);
    delay(600);
}
