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
  sensor_type_name VARCHAR(20)
);

CREATE TABLE sensor_value (
  sensor_value_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  sensor_id       BIGINT,
  value           FLOAT(8,4) NOT NULL,
  date_insert     TIMESTAMP          DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sensor_id) REFERENCES sensor(sensor_id)
);

CREATE TABLE project (
  project_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  user_insert VARCHAR(20) NOT NULL
);

CREATE TABLE client (
  client_id   BIGINT PRIMARY KEY AUTO_INCREMENT,
  project_id  BIGINT,
  client_key  VARCHAR(255),
  client_name TEXT        NOT NULL,
  user_insert VARCHAR(20) NOT NULL,
  FOREIGN KEY (project_id) REFERENCES project (project_id)
);

CREATE TABLE project_user (
  project_user_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
  project_id           BIGINT,
  username             VARCHAR(20),
  project_user_role_id BIGINT,
  FOREIGN KEY (project_id) REFERENCES project(project_id),
  FOREIGN KEY (username) REFERENCES user (username),
  FOREIGN KEY (project_user_role_id) REFERENCES project_user_role (project_user_role_id)
);

CREATE TABLE project_user_role (
  project_user_role_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
  project_user_role_name VARCHAR(20)
);


CREATE TABLE sensor (
  sensor_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
  sensor_name    TEXT,
  client_id      BIGINT,
  can_read       TINYINT(1),
  can_write      TINYINT(1),
  sensor_type_id BIGINT,
  FOREIGN KEY (sensor_type_id) REFERENCES sensor_type (sensor_type_id),
  FOREIGN KEY (client_id) REFERENCES client (client_id),
  FOREIGN KEY (sensor_id) REFERENCES sensor (sensor_id)
);

CREATE TABLE admin (
  admin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(20)
);

INSERT INTO sensor_type (sensor_type_name) VALUES ('TEMP_C'),('CONSUMPTION_W'),('ON_OFF');
INSERT INTO project_user_role (project_user_role_name) VALUES ('OWNER'), ('SENSOR'), ('VISITOR');