
CREATE TABLE Route (
    rid INTEGER,
    destination VARCHAR(255),
    PRIMARY KEY (rid)
);

CREATE TABLE Driver (
    staff_id INTEGER PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	seniority VARCHAR(255) NOT NULL
);

CREATE TABLE BusDriver (
	staff_id INTEGER PRIMARY KEY,
	FOREIGN KEY (staff_id) REFERENCES Driver(staff_id)
);

CREATE TABLE TrainDriver (
	staff_id INTEGER PRIMARY KEY,
	FOREIGN KEY (staff_id) REFERENCES Driver(staff_id)
);

CREATE TABLE Bus (
	bus_id INTEGER PRIMARY KEY,
	bus_size INTEGER NOT NULL
);

CREATE TABLE Train (
	train_id INTEGER PRIMARY KEY,
	train_size INTEGER NOT NULL
);

CREATE TABLE TrainLine (
    rid INTEGER,
    line_name VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (rid),
    FOREIGN KEY (rid) REFERENCES Route(rid) ON DELETE CASCADE
);

CREATE TABLE TrainStation (
    stat_id INTEGER,
    stat_name VARCHAR(255) UNIQUE,
    PRIMARY KEY (stat_id)
);

CREATE TABLE BusStop (
    stop_id INTEGER,
    address VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (stop_id)
);

CREATE TABLE TrainLineStopsAt (
    stat_id INTEGER,
    rid INTEGER,
    line_pos INTEGER NOT NULL,
    PRIMARY KEY (stat_id, rid),
    FOREIGN KEY (rid) REFERENCES Route(rid) ON DELETE CASCADE,
    FOREIGN KEY (stat_id) REFERENCES TrainStation(stat_id) ON DELETE CASCADE
);

CREATE TABLE BusRoute (
    rid INTEGER,
    route_num INTEGER NOT NULL UNIQUE,
    PRIMARY KEY (rid),
    FOREIGN KEY (rid) REFERENCES Route(rid) ON DELETE CASCADE
);

CREATE TABLE BusRouteStopsAt (
    stop_id INTEGER,
    rid INTEGER,
    route_pos INTEGER NOT NULL,
    PRIMARY KEY (stop_id, rid),
    FOREIGN KEY (rid) REFERENCES Route(rid) ON DELETE CASCADE,
    FOREIGN KEY (stop_id) REFERENCES BusStop(stop_id) ON DELETE CASCADE
);


CREATE TABLE DrivesBus (
	bus_id INTEGER,
	staff_id INTEGER,
	PRIMARY KEY (bus_id),
	FOREIGN KEY (bus_id) REFERENCES Bus(bus_id),
	FOREIGN KEY (staff_id) REFERENCES BusDriver(staff_id)
);

CREATE TABLE DrivesTrain (
	train_id INTEGER,
	staff_id INTEGER,
	PRIMARY KEY (train_id),
	FOREIGN KEY (train_id) REFERENCES Train(train_id),
	FOREIGN KEY (staff_id) REFERENCES TrainDriver(staff_id)
);

CREATE TABLE BusAssigned (
	bus_id INTEGER,
	route_id INTEGER,
	PRIMARY KEY (bus_id),
	FOREIGN KEY (bus_id) REFERENCES Bus(bus_id),
	FOREIGN KEY (route_id) REFERENCES Route(rid)
);

CREATE TABLE TrainAssigned (
	train_id INTEGER,
	route_id INTEGER,
	PRIMARY KEY (train_id),
	FOREIGN KEY (train_id) REFERENCES Train(train_id),
	FOREIGN KEY (route_id) REFERENCES Route(rid)
);

CREATE TABLE RIDER2(
	rider_type VARCHAR(255),
	dob VARCHAR(255),
	PRIMARY KEY (dob)
);

CREATE TABLE RIDER1(
	compass_id INTEGER,
	dob VARCHAR(255),
	PRIMARY KEY(compass_id),
	FOREIGN KEY(dob) REFERENCES RIDER2
);


CREATE TABLE PaidFares2(
	fare_type VARCHAR(255),
	price DECIMAL(5,2),
	PRIMARY KEY(fare_type)
);

CREATE TABLE PaidFares1(
	compass_id INTEGER,
	date_time VARCHAR(255),
	fare_type VARCHAR(255),
	PRIMARY KEY(compass_id, date_time),
	FOREIGN KEY(compass_id) REFERENCES Rider1 ON DELETE CASCADE,
	FOREIGN KEY(fare_type) REFERENCES PaidFares2 ON DELETE CASCADE
);

CREATE TABLE ScannerHas(
	scan_id INTEGER,
	stat_id INTEGER,
	bus_id INTEGER,
	PRIMARY KEY(scan_id),
	FOREIGN KEY(stat_id) REFERENCES TrainStation ON DELETE CASCADE,
	FOREIGN KEY(bus_id) REFERENCES Bus ON DELETE CASCADE
);

CREATE TABLE ValidateFare(
	scan_id INTEGER,
	compass_id INTEGER,
	date_time VARCHAR(255),
	PRIMARY KEY(scan_id,compass_id,date_time),
	FOREIGN KEY(scan_id) REFERENCES ScannerHas ON DELETE CASCADE,
	FOREIGN KEY(compass_id,date_time) REFERENCES PaidFares1(compass_id,date_time) ON DELETE CASCADE
);

INSERT INTO Route (rid, destination) VALUES (10, 'Downtown - Pender');
INSERT INTO Route (rid, destination) VALUES (20, 'UBC - Bus Loop');
INSERT INTO Route (rid, destination) VALUES (30, 'Downtown - Robson');
INSERT INTO Route (rid, destination) VALUES (40, 'Broadway - MacDonald');
INSERT INTO Route (rid, destination) VALUES (50, 'Broadway - Main');
INSERT INTO Route (rid, destination) VALUES (101, 'Downtown');
INSERT INTO Route (rid, destination) VALUES (201, 'UBC');
INSERT INTO Route (rid, destination) VALUES (301, 'Airport');
INSERT INTO Route (rid, destination) VALUES (401, 'Waterfront');
INSERT INTO Route (rid, destination) VALUES (501, 'Boundary');

INSERT INTO TrainLine (rid, line_name) VALUES (101, 'Green Line');
INSERT INTO TrainLine (rid, line_name) VALUES (201, 'Red Line');
INSERT INTO TrainLine (rid, line_name) VALUES (301, 'Blue Line');
INSERT INTO TrainLine (rid, line_name) VALUES (401, 'Yellow Line');
INSERT INTO TrainLine (rid, line_name) VALUES (501, 'Purple Line');

INSERT INTO BusRoute (rid, route_num) VALUES (10, 22);
INSERT INTO BusRoute (rid, route_num) VALUES (20, 84);
INSERT INTO BusRoute (rid, route_num) VALUES (30, 5);
INSERT INTO BusRoute (rid, route_num) VALUES (40, 9);
INSERT INTO BusRoute (rid, route_num) VALUES (50, 99);

