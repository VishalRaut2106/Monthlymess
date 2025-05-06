# PRATICAL NO. 5


int led = 12;
void setup() {
  pinMode(led, OUTPUT);  // Set the LED pin as an output
}
void loop() {
  digitalWrite(led, HIGH);  // Turn the LED on
  delay(1000);  // Wait for 1000 milliseconds (1 second)
  digitalWrite(led, LOW);  // Turn the LED off
  delay(2000);  // Wait for 2000 milliseconds (2 seconds)
}

 # PRATICAL NO. 6

int counter;
void setup(){
  Serial.begin(9600);
  	pinMode(11,OUTPUT);
  	pinMode(12,OUTPUT);
  	pinMode(13,OUTPUT);
}
void loop(){
  if(counter==300)
  {
    counter=0;
  }
  if(counter>0&&counter<100)
  {
    digitalWrite(11,HIGH);
    digitalWrite(12,LOW);
    digitalWrite(13,LOW);
  }
  if(counter>101&&counter<200)
  {
    digitalWrite(12,HIGH);
    digitalWrite(11,LOW);
    digitalWrite(13,LOW);
  }
  if(counter>200&&counter<300)
  {
    digitalWrite(13,HIGH);
    digitalWrite(12,LOW);
    digitalWrite(11,LOW);
  }
  counter=counter+10;
  delay(500);
  Serial.println(counter);
}


# PRATICAL NO. 7

int mychar = 0;

void setup() {
  Serial.begin(9600);
  pinMode(11, OUTPUT);
  pinMode(6, OUTPUT);
  pinMode(2, OUTPUT);
}

void loop() {
  if (Serial.available() > 0) {
    mychar = Serial.read();

    Serial.print("I received: ");
    Serial.println((char)mychar);

    if (mychar == 'r') {
      digitalWrite(11, HIGH);
      digitalWrite(6, LOW);
      digitalWrite(2, LOW);
    }
    else if (mychar == 'y') {
      digitalWrite(11, LOW);
      digitalWrite(6, HIGH);
      digitalWrite(2, LOW);
    }
    else if (mychar == 'g') {
      digitalWrite(11, LOW);
      digitalWrite(6, LOW);
      digitalWrite(2, HIGH);
    }
    else if (mychar == 'b') {
      digitalWrite(11, LOW);
      digitalWrite(6, LOW);
      digitalWrite(2, HIGH);
      delay(1000);
      digitalWrite(2, LOW);
      delay(1000);
    }
  }
}


# PRATICAL NO. 8

int out;  
void setup() {  
  Serial.begin(9600);  
}  
  
void loop() {   
if (Serial.available() > 0) {    	
int num = Serial.parseInt();  
Serial.print("I received:");   	Serial.println(num);   
out = num * num;  
Serial.print("Enter the Number for Square: ");  
Serial.println(out);  
  }  
}    

# PRATICAL NO. 9
int redPin = 11;
int greenPin = 9;
int bluePin = 10;

int potRed = A0;
int potGreen = A1;
int potBlue = A2;

int redValue = 0;
int greenValue = 0;
int blueValue = 0;

void setup() {
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  redValue = analogRead(potRed);
  greenValue = analogRead(potGreen);
  blueValue = analogRead(potBlue);

  redValue = redValue / 4;
  greenValue = greenValue / 4;
  blueValue = blueValue / 4;

  analogWrite(redPin, redValue);
  analogWrite(greenPin, greenValue);
  analogWrite(bluePin, blueValue);

  Serial.print("Red:\t");
  Serial.print(redValue);
  Serial.print("\tGreen:\t");
  Serial.print(greenValue);
  Serial.print("\tBlue:\t");
  Serial.println(blueValue);

  delay(100);
} 

# PRATICAL NO. 10 

#include <dht11.h>

#define DHT11PIN A0

dht11 DHT11;

void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.println();
  
  int chk = DHT11.read(DHT11PIN);
  
  float h = DHT11.humidity;
  float t = DHT11.temperature;
  
  Serial.print("Humidity (%): ");
  Serial.println(h);

  Serial.print("Temperature (C): ");
  Serial.println(t);

  delay(2000);  // Wait for 2 seconds
}

# PRATICAL NO. 11 

float mintemp;
float maxtemp;
bool initialtemp = true;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(A0);
  float volt = raw * 4.88;    // Assuming 4.88 mV per step (for 5V/1023)
  float temp = volt / 10;     // LM35 sensor: 10mV per °C
  float fare = (temp * 1.8) + 32.0;

  Serial.println("Temperature in Fahrenheit:");
  Serial.println(fare);

  delay(1000);

  if (initialtemp) {
    mintemp = maxtemp = fare;
    initialtemp = false;
  }
  else {
    if (fare > maxtemp) {
      maxtemp = fare;
    }
    if (fare < mintemp) {
      mintemp = fare;
    }
  }

  Serial.println("MAXIMUM TEMPERATURE:");
  Serial.println(maxtemp);

  Serial.println("MINIMUM TEMPERATURE:");
  Serial.println(mintemp);
} 
# PRATICAL NO. 12

void setup() {
  Serial.begin(9600);
  pinMode(12, OUTPUT);
  pinMode(13, OUTPUT);
}

void loop() {
  int s1 = analogRead(A0); 
  Serial.println(s1);
  delay(200);

  if (s1 > 100) {
    digitalWrite(12, LOW);
    digitalWrite(13, LOW);
  }
  else {
    digitalWrite(12, HIGH);
    digitalWrite(13, HIGH);
  }
}

