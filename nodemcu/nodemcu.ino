// ############# LIBRERIAS ############### //

#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <EEPROM.h>

// ############# VARIABLES ############### //

// defines variables-constantes
const int trigPin = 2;  //D4
const int echoPin = 0;  //D3

long duration;

int distance = 0;

String id = "AAAAAAAA";
String auth;
char authArray[] = "";

char ssid[] = "DAVIDSPINOZZIWIFI-2.4G"; // Wi-Fi
char pass[] = "h3in3k3n"; // Contraseña


// ############# FUNCIONES ############### //

void initSerial(); // inicia conexion Serial
void initWiFi(); // inicia conexion WiFi
void initConnection(); // envia un HTTP-GET y registra el modulo en la base de datos

void handleAuth(); // evalua si existe un codigo de auth salvado en el flash y lo asigna a la variable auth
bool clearFlash(); // zera los valores en las 512 posiciones del flash y Retorna True si el server ya habia sido inicializado
String readFlash(); // retorna el Auth que fue guardado en el flash
void storeFlash(char value[]);// Guarda en el Flash el auth

void getDistance(); // recibe la Distancia calculada con el sensor de ultrasonido
void sendDistance(); // envia la Distancia recibida en un HTTP-POST al servidor.

void reboot(); // si el codigo llegar aca significa que el Auth se borro de la base de datos, zera el auth y reinicializa la connexion.

// ############# SETUP ############### //

void setup() {
  initSerial();
  initWiFi();
  handleAuth();
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input

}

// ############# LOOP ############### //
void loop() {
  sendDistance();
  delay(5000);  //Actualiza la distancia enviando un HTTP-POST a cada 10sec
}

// ############# FUNCIONES ############### //
void initSerial() {
  Serial.begin(74880);                 //Conexion Serial
  Serial.println("[Serial] Connection Iniciated!");
}

void initWiFi() {

  WiFi.begin(ssid, pass);   //Conectar a WiFi
  while (WiFi.status() != WL_CONNECTED) {  //Aguardar la conexion Wi-Fi
  delay(500);
  Serial.println("[WiFi] Waiting for connection...");
  }
  Serial.println("");
  Serial.print("[WiFi] Connection Iniciated!");
  Serial.print(" IP address: ");
  Serial.println(WiFi.localIP());
}


void handleAuth() {
  bool con = clearFlash();
  if (con) {
    auth = readFlash();
  } else {
    initConnection();
  }
}
// Inicia conexion con el servidor y recibe la clave de autenticacion
void initConnection() {
  if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
    HTTPClient http;
    int httpCode = 0;
    // intentar conexion
    if (http.begin("http://192.168.1.37:3333/modules")) {
      Serial.println("");
      Serial.println("[HTTP] Trying to send GET request...");
      http.addHeader("Content-Type", "text/plain");  //defino el header
      http.addHeader("authorizations", id);
      httpCode = http.GET();
      
      if (httpCode > 0) { // caso el status sea un valor negativo salta error.
        Serial.printf("[HTTP-GET] code: %d\n", httpCode);
        Serial.println(httpCode);

        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String payload = http.getString(); //Recibe la respuesta y asigno el auth a la variable temporal
          int pay_length = payload.length();
          char copy[pay_length];
          Serial.println(pay_length);

          if (pay_length) {
            
            //Convierto el string a char array
            payload.toCharArray(copy, pay_length);
            Serial.println(copy);
          }

          if (payload.length() > 0) {

            // Guardo el auth en el flash
            storeFlash(copy);
            // Asigno el auth a la variable local
            auth = readFlash();

            Serial.print("[HTTP-GET] Registration Success... auth: ");
            Serial.println(auth);

          } else {
            auth = readFlash();

            Serial.println("[HTTP-GET] Module already registered.");
            Serial.print("[HTTP-GET] Auth retrived: ");
            Serial.println(auth);
          }
        }
      } else {
        Serial.printf("[HTTP-GET] Failed, error: %s\n", http.errorToString(httpCode).c_str());
      }
    } else {
      Serial.printf("[HTTP] Error in Server connection.");
    }
    http.end();
  } else {
    Serial.println("[WiFi] Error in WiFi connection.");
  }
}

bool clearFlash() { // zera todos los bytes del EEPROM y Retorna True 
                    //si el server ya habia sido inicializado

  EEPROM.begin(512);
  byte storedSize = EEPROM.read(0);
  bool resp = false;

  if (storedSize == 255 || storedSize == 0) { //Si el valor guardado en la posicion 0 es el valor inicial, 
                                              //zerar todas las posiciones y iniciar 
                                              //la conexion con el server ( Valor inicial = 255 ),
    Serial.println("[EEPROM] Initiating Connection and Changing all flash positions to 0.");
    for (int i = 0; i < 512; i++) {
      EEPROM.write(i, 0);
    }
    initConnection();
  } else {
    resp = true;
    Serial.println("[EEPROM] There is a Auth code in store.");
  }

  EEPROM.end();
  return resp;
}

String readFlash() { // retorna el Auth que fue guardado en el flash
  EEPROM.begin(512);
  int storedSize = EEPROM.read(0);
  String storedAuth = "";

  Serial.println(storedSize);
  Serial.println("[EEPROM] Retriving Authorization Code from Flash.");
  Serial.println("");

  for (int i = 1; i <= storedSize; i++) {
    char value = EEPROM.read(i);
    storedAuth = storedAuth + value;

    Serial.print("Flash position ");
    Serial.print(i);
    Serial.print(": ");
    Serial.println(value);
  }
  EEPROM.end();

  return storedAuth;
}

void storeFlash(char value[]) { // Guarda en el Flash el value[]

  int sizeArray = strlen(value) - 1;
  EEPROM.begin(512);

  Serial.println("");
  Serial.print("[EEPROM] Storing Authorization Code: ");
  Serial.println(value);
  Serial.print("[EEPROM] Authorization Code Size: ");
  Serial.println(sizeArray);

  EEPROM.write(0, sizeArray); //Guarda en la posicion 0 el tamaño del auth

  for (int i = 1; i <= sizeArray; i++) {

    EEPROM.write(i, value[i]);

    Serial.print("[EEPROM] position ");
    Serial.print(i);
    Serial.print(" , storing: ");
    Serial.println(value[i]);
  }

  EEPROM.end();
}





void getDistance() {

  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);

  // Calculating the distance
  distance = duration / 58.2;
}

void sendDistance() {

  if (WiFi.status() == WL_CONNECTED) { //Check WiFi

    WiFiClient client;
    HTTPClient http;
    int httpCode = 0;

    // intentar conexion
    if (http.begin(client, "http://192.168.1.37:3333/details")) {
      Serial.println("");
      Serial.println("[HTTP] Trying to send POST request...");
      http.addHeader("Content-Type", "application/json"); //defino el header

      Serial.print("> Auth: ");
      Serial.println(auth);

      http.addHeader("authorizations", auth); //agrego el auth ao header

      getDistance();

      Serial.print("> Distance: ");
      Serial.println(distance);

      httpCode = http.POST("{\"distance\":" + String(distance) + "}");  //envio el POST

      if (httpCode > 0) { // caso el status sea un valor negativo salta error.

        Serial.printf("[HTTP-POST] code: %d\n", httpCode);

        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {

          String payload = http.getString();  //Recibe la respuesta

          //Evalua la respuesta del servidor al guardar la distancia
          if (payload.length() <= 0) { //Payload vazio significa que el dato 
                                        //no se guardor y que el codigo de authenticacion es invalido

            Serial.println("[HTTP-POST] Detail Creation Failed, Invalid Authentication. Rebooting Flash.");
            reboot();
          } else {
            Serial.println("");
            Serial.print("[HTTP-POST] Detail Creation Success, Detail Id: ");
            Serial.println(payload);
          }
        }
      } else {
        Serial.printf("[HTTP-POST] Failed, error: %s\n", http.errorToString(httpCode).c_str());
      }
    } else {
      Serial.printf("[HTTP] Failed, error: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();  //Close connection

  } else {
    Serial.println("[WiFi] Error in WiFi connection");
  }
}

void reboot() { // si el codigo llegar aca significa que el 
                //Auth se borro de la base de datos, zera el auth y reinicializa la connexion

  EEPROM.begin(512);

  Serial.println("[EEPROM] Rebooting...");
  for (int i = 0; i < 512; i++) {
    EEPROM.write(i, 0);
  }
  initConnection();

  EEPROM.end();
}
