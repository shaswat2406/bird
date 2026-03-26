const int sensor = 2;
const int relay = 3;

void setup() {
  pinMode(sensor, INPUT);
  pinMode(relay, OUTPUT);
  digitalWrite(relay, HIGH); // Relay OFF
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(sensor) == HIGH) {
    Serial.println("INTRUDER! SCARING AWAY...");
    
    // 10 rapid, random pulses
    for(int i = 0; i < 10; i++) {
      digitalWrite(relay, LOW);  // ON
      delay(random(40, 150));    // Random fast flash
      digitalWrite(relay, HIGH); // OFF
      delay(random(40, 150));
    }
    
    delay(5000); // 5 second quiet time
  }
}
