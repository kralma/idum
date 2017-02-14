CREATE TABLE user (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL UNIQUE KEY,
    email TEXT NOT NULL,
    name TEXT,
    pass VARCHAR(255) NOT NULL,
    date_insert TIMESTAMP
);

CREATE TABLE sensor_type (
  sensor_type_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  sensor_type_name VARCHAR(25)
);

CREATE TABLE sensor (
  sensor_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  sensor_name TEXT,
  sensor_type_id BIGINT,
  FOREIGN KEY (sensor_type_id) REFERENCES sensor_type(sensor_type_id)
);

CREATE TABLE sensor_value (
  sensor_value_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  sensor_id BIGINT,
  value FLOAT(10,4) NOT NULL,
  FOREIGN KEY (sensor_id) REFERENCES sensor(sensor_id)
);

CREATE TABLE user_sensor (
  user_sensor_id BIGINT AUTO_INCREMENT PRIMARY KEY ,
  sensor_id BIGINT,
  username VARCHAR(20),
  FOREIGN KEY (sensor_id) REFERENCES sensor(sensor_id),
  FOREIGN KEY (username) REFERENCES user(username)
);

INSERT INTO sensor_type (sensor_type_name) VALUES ('TEMP_C'),('CONSUMPTION_W'),('ON_OFF');