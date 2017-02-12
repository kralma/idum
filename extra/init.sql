CREATE TABLE user (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(10) NOT NULL UNIQUE KEY,
    email TEXT,
    name TEXT,
    pass VARCHAR(255)
)

CREATE TABLE sensor (
  sensor_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  sensor_name TEXT
)

CREATE TABLE sensor_value (
  sensor_value_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  sensor_id BIGINT FOREIGN KEY REFERENCES sensor.sensor_id NOT NULL,
  value FLOAT(10,4) NOT NULL
)