CREATE TABLE RIDER1(
	compass_id INTEGER,
	dob VARCHAR(255),
	PRIMARY KEY(compass_id)
);

CREATE TABLE RIDER2(
	rider_type VARCHAR(255),
	dob VARCHAR(255),
	PRIMARY KEY (dob)
);

CREATE TABLE PaidFares1(
	compass_id INTEGER,
	date_time VARCHAR(255),
	fare_type VARCHAR(255),
	PRIMARY KEY(compass_id, date_time),
	FOREIGN KEY(compass_id) REFERENCES Rider1 ON DELETE CASCADE,
	FOREIGN KEY(fare_type) REFERENCES PaidFares2 ON DELETE CASCADE
);

CREATE TABLE PaidFares2(
	fare_type VARCHAR(255),
	price DECIMAL(5,2),
	PRIMARY KEY(fare_type)
);

CREATE TABLE ValidateFare(
	scan_id INTEGER,
	compass_id INTEGER,
	date_time VARCHAR(255),
	PRIMARY KEY(scan_id,compass_id,date_time),
	FOREIGN KEY(scan_id) REFERENCES Scanner ON DELETE CASCADE,
	FOREIGN KEY(compass_id,date_time) REFERENCES PaidFares1(compass_id,date_time) ON DELETE CASCADE
);

CREATE TABLE ScannerHas(
	scan_id INTEGER,
	stat_id INTEGER,
	bus_id INTEGER,
	PRIMARY KEY(scan_id),
	FOREIGN KEY(stat_id) REFERENCES TrainStation ON DELETE CASCADE,
	FOREIGN KEY(bus_id) REFERENCES Bus ON DELETE CASCADE
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

CREATE TABLE Route (
    rid INTEGER,
    destination VARCHAR(255),
    PRIMARY KEY (rid)
);

CREATE TABLE TrainLineStopsAt (
    stat_id INTEGER,
    rid INTEGER,
    line_pos INTEGER NOT NULL,
    PRIMARY KEY (stat_id, rid),
    FOREIGN KEY (rid) REFERENCES Route(rid) ON DELETE CASCADE,
    FOREIGN KEY (stat_id) REFERENCES TrainStation(stat_id) ON DELETE CASCADE
);

CREATE TABLE TrainLine (
    rid INTEGER,
    line_name VARCHAR(255) NOT NULL UNIQUE,
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

CREATE TABLE BusRoute (
    rid INTEGER,
    route_num INTEGER NOT NULL UNIQUE,
    PRIMARY KEY (rid),
    FOREIGN KEY (rid) REFERENCES Route(rid) ON DELETE CASCADE
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

CREATE TABLE DrivesBus (
	bus_id INTEGER,
	staff_id INTEGER,
	PRIMARY KEY (bus_id),
	FOREIGN KEY (bus_id) REFERENCES Bus(bus_id)
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
	FOREIGN KEY (bus_id), REFERENCES Bus(bus_id)
	FOREIGN KEY (route_id), REFERENCES Route(route_id)
);

CREATE TABLE TrainAssigned (
	train_id INTEGER,
	route_id INTEGER,
	PRIMARY KEY (train_id),
	FOREIGN KEY (train_id), REFERENCES Train(train_id)
	FOREIGN KEY (route_id), REFERENCES Route(route_id)
);
