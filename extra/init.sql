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
  value FLOAT(8,4) NOT NULL,
  FOREIGN KEY (sensor_id) REFERENCES sensor(sensor_id)
);

CREATE TABLE project (
  project_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  DESCRIPTION TEXT
);

CREATE TABLE project_sensor (
  project_sensor_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  project_id BIGINT,
  sensor_id BIGINT,
  FOREIGN KEY (project_id) REFERENCES project(project_id),
  FOREIGN KEY (sensor_id) REFERENCES sensor(sensor_id)
);

CREATE TABLE user_project (
  user_project_id BIGINT AUTO_INCREMENT PRIMARY KEY ,
  project_id BIGINT,
  username VARCHAR(20),
  FOREIGN KEY (project_id) REFERENCES project(project_id),
  FOREIGN KEY (username) REFERENCES user(username)
);

CREATE TABLE admin (
  admin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(20)
);

INSERT INTO sensor_type (sensor_type_name) VALUES ('TEMP_C'),('CONSUMPTION_W'),('ON_OFF');