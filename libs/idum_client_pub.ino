#include <Ethernet.h>
#include <SPI.h>
#include <OneWire.h> 
#include <DallasTemperature.h>

#define ONE_WIRE_INPUT 2
#define TIMEOUT 10
#define PERIOD 1800

OneWire oneWire(ONE_WIRE_INPUT);
DallasTemperature sensors(&oneWire);
EthernetClient client;

byte mac[] = { 0xDE, 0xAD, 0xBE, 0x7F, 0xFE, 0xED };
int TimeOut = TIMEOUT * 1000;

String float2string(float f, int precision) {
  int n = (int) ceil(pow(10, precision));
  int fA = (int) f;
  int fB = (int) (f * n) - (int) f * n;
  return String(String(fA) + "." + String(fB));
}

String createJSONData(int sensorId, float sensorValue) {
  return String("{\"sensorId\": \"" + String(sensorId) + "\",\"value\":\"" + float2string(sensorValue, 3) + "\"}");
}

void setup() {
  Serial.begin(9600);
  Serial.println("initialization...");
  sensors.begin();
  Ethernet.begin(mac);
  Serial.println("connecting...");
}

void loop() {
  sensors.requestTemperatures();
  float temp = sensors.getTempCByIndex(0);
  Serial.println(float2string(temp, 2));
//{"clientId": "1", "clientKey": "asdf", "sensorValues": [{"sensorId":"10","value":"10"},{"sensorId":"2","value":"2.5"}]}
  String dataString = String("{\"clientId\": \"1\", \"clientKey\": \"asdf\",\"sensorValues\":[" + createJSONData(1, temp) + "]}");

  if (client.connect("http://idum.wz.cz", 80)) {
    Serial.println("sending...");

    client.println("POST /api/values.php HTTP/1.1");
    client.println("Host: www.idum.wz.cz");
    client.println("User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36");
    client.println("Connection: close");

    client.println("Content-Type: application/x-www-form-urlencoded ; charset=UTF-8");
    client.print("Content-Length: ");
    client.print(dataString.length());
    client.println();
    client.println();
    client.println(dataString);

    int timeout = TimeOut;
    while ((!client.available()) && (timeout > 0))
    {
      delay(1);
      timeout = timeout - 1;
    }
    if (timeout != 0) {
      Serial.println("OK");
    } else {
      Serial.println("server is not responding :(");
    }

    client.stop();
    client.flush();
    Serial.println("\ndisconnected");
  } else {
    Serial.println("connection failed");
  }

  unsigned long startMillis = millis();
  while (millis() - startMillis < PERIOD * 1000.0);
}



