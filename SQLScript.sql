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

INSERT INTO Driver (staff_id, name, seniority) VALUES (1, 'Sabrina Lou', 'Junior');
INSERT INTO Driver (staff_id, name, seniority) VALUES (2, 'Freddi Li','Junior');
INSERT INTO Driver (staff_id, name, seniority) VALUES (3, 'Rohan Shukla', 'Junior');
INSERT INTO Driver (staff_id, name, seniority) VALUES (4, 'Rachel Pottinger', 'Senior');
INSERT INTO Driver (staff_id, name, seniority) VALUES (5, 'Steve Wolfman', 'Senior');
INSERT INTO Driver (staff_id, name, seniority) VALUES (6, 'Alan Turing', 'Junior');
INSERT INTO Driver (staff_id, name, seniority) VALUES (7, 'Edgar Codd', 'Junior');
INSERT INTO Driver (staff_id, name, seniority) VALUES (8, 'John von Neumann', 'Junior');
INSERT INTO Driver (staff_id, name, seniority) VALUES (9, 'Taylor Swift', 'Senior');
INSERT INTO Driver (staff_id, name, seniority) VALUES (10, 'Porter Robinson', 'Senior');

INSERT INTO BusDriver (staff_id) VALUES (1);
INSERT INTO BusDriver (staff_id) VALUES (2);
INSERT INTO BusDriver (staff_id) VALUES (3);
INSERT INTO BusDriver (staff_id) VALUES (4);
INSERT INTO BusDriver (staff_id) VALUES (5);

INSERT INTO TrainDriver (staff_id) VALUES (6);
INSERT INTO TrainDriver (staff_id) VALUES (7);
INSERT INTO TrainDriver (staff_id) VALUES (8);
INSERT INTO TrainDriver (staff_id) VALUES (9);
INSERT INTO TrainDriver (staff_id) VALUES (10);

INSERT INTO Bus (bus_id, bus_size) VALUES (1, 47);
INSERT INTO Bus (bus_id, bus_size) VALUES (2, 70);
INSERT INTO Bus (bus_id, bus_size) VALUES (3, 50);
INSERT INTO Bus (bus_id, bus_size) VALUES (4, 64);
INSERT INTO Bus (bus_id, bus_size) VALUES (5, 24);

INSERT INTO Train (train_id, train_size) VALUES (1, 200);
INSERT INTO Train (train_id, train_size) VALUES (2, 250);
INSERT INTO Train (train_id, train_size) VALUES (3, 300);
INSERT INTO Train (train_id, train_size) VALUES (4, 350);
INSERT INTO Train (train_id, train_size) VALUES (5, 400);

INSERT INTO DrivesBus (bus_id, staff_id) VALUES (1, 1);
INSERT INTO DrivesBus (bus_id, staff_id) VALUES (2, 2);
INSERT INTO DrivesBus (bus_id, staff_id) VALUES (3, 3);
INSERT INTO DrivesBus (bus_id, staff_id) VALUES (4, 4);
INSERT INTO DrivesBus (bus_id, staff_id) VALUES (5, 5);

INSERT INTO DrivesTrain (train_id, staff_id) VALUES (1, 6);
INSERT INTO DrivesTrain (train_id, staff_id) VALUES (2, 7);
INSERT INTO DrivesTrain (train_id, staff_id) VALUES (3, 8);
INSERT INTO DrivesTrain (train_id, staff_id) VALUES (4, 9);
INSERT INTO DrivesTrain (train_id, staff_id) VALUES (5, 10);

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

INSERT INTO BusAssigned (bus_id, route_id) VALUES (1, 10);
INSERT INTO BusAssigned (bus_id, route_id) VALUES (2, 20);
INSERT INTO BusAssigned (bus_id, route_id) VALUES (3, 30);
INSERT INTO BusAssigned (bus_id, route_id) VALUES (4, 40);
INSERT INTO BusAssigned (bus_id, route_id) VALUES (5, 50);

INSERT INTO TrainAssigned (train_id, route_id) VALUES (1, 101);
INSERT INTO TrainAssigned (train_id, route_id) VALUES (2, 201);
INSERT INTO TrainAssigned (train_id, route_id) VALUES (3, 301);
INSERT INTO TrainAssigned (train_id, route_id) VALUES (4, 401);
INSERT INTO TrainAssigned (train_id, route_id) VALUES (5, 501);

INSERT INTO BusRoute (rid, route_num) VALUES (10, 22);
INSERT INTO BusRoute (rid, route_num) VALUES (20, 84);
INSERT INTO BusRoute (rid, route_num) VALUES (30, 5);
INSERT INTO BusRoute (rid, route_num) VALUES (40, 9);
INSERT INTO BusRoute (rid, route_num) VALUES (50, 99);

INSERT INTO TrainLine (rid, line_name) VALUES (101, 'Green Line');
INSERT INTO TrainLine (rid, line_name) VALUES (201, 'Red Line');
INSERT INTO TrainLine (rid, line_name) VALUES (301, 'Blue Line');
INSERT INTO TrainLine (rid, line_name) VALUES (401, 'Yellow Line');
INSERT INTO TrainLine (rid, line_name) VALUES (501, 'Purple Line');