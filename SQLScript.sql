DROP TABLE ValidateFare;
DROP TABLE ScannerHas;
DROP TABLE PaidFares1;
DROP TABLE PaidFares2;
DROP TABLE RIDER1;
DROP TABLE RIDER2;
DROP TABLE BusAssigned;
DROP TABLE TrainAssigned;
DROP TABLE DrivesTrain;
DROP TABLE DrivesBus;
DROP TABLE BusRouteStopsAt;
DROP TABLE TrainLineStopsAt;
DROP TABLE BusRoute;
DROP TABLE TrainStation;
DROP TABLE BusStop;
DROP TABLE TrainLine;
DROP TABLE Train;
DROP TABLE Bus;
DROP TABLE TrainDriver;
DROP TABLE BusDriver;
DROP TABLE Driver;
DROP TABLE Route;


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
	sched_time VARCHAR(255) NOT NULL UNIQUE,
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

DELETE FROM Route;

INSERT INTO Route (rid, destination) VALUES (10, 'Downtown');
INSERT INTO Route (rid, destination) VALUES (20, 'UBC');
INSERT INTO Route (rid, destination) VALUES (30, 'Downtown');
INSERT INTO Route (rid, destination) VALUES (40, 'Broadway');
INSERT INTO Route (rid, destination) VALUES (50, 'Broadway');
INSERT INTO Route (rid, destination) VALUES (101, 'Downtown');
INSERT INTO Route (rid, destination) VALUES (201, 'UBC');
INSERT INTO Route (rid, destination) VALUES (301, 'Airport');
INSERT INTO Route (rid, destination) VALUES (401, 'Waterfront');
INSERT INTO Route (rid, destination) VALUES (501, 'Broadway');

INSERT INTO TrainLine (rid, line_name) VALUES (101, 'Green Line');
INSERT INTO TrainLine (rid, line_name) VALUES (201, 'Red Line');
INSERT INTO TrainLine (rid, line_name) VALUES (301, 'Blue Line');
INSERT INTO TrainLine (rid, line_name) VALUES (401, 'Yellow Line');
INSERT INTO TrainLine (rid, line_name) VALUES (501, 'Purple Line');

INSERT INTO TrainStation (stat_id, stat_name) VALUES (1, 'Waterfront');
INSERT INTO TrainStation (stat_id, stat_name) VALUES (2, 'City Centre');
INSERT INTO TrainStation (stat_id, stat_name) VALUES (3, 'Broadway - City Hall');
INSERT INTO TrainStation (stat_id, stat_name) VALUES (4, 'Marine Dr');
INSERT INTO TrainStation (stat_id, stat_name) VALUES (5, 'University Loop');
INSERT INTO TrainStation (stat_id, stat_name) VALUES (6, 'Airport');
INSERT INTO TrainStation (stat_id, stat_name) VALUES (7, 'East Downtown');

INSERT INTO TrainLineStopsAt (stat_id, rid, line_pos) VALUES (1, 101, 1);
INSERT INTO TrainLineStopsAt (stat_id, rid, line_pos) VALUES (3, 101, 2);
INSERT INTO TrainLineStopsAt (stat_id, rid, line_pos) VALUES (6, 101, 3);
INSERT INTO TrainLineStopsAt (stat_id, rid, line_pos) VALUES (1, 301, 3);
INSERT INTO TrainLineStopsAt (stat_id, rid, line_pos) VALUES (5, 301, 2);
INSERT INTO TrainLineStopsAt (stat_id, rid, line_pos) VALUES (7, 301, 1);
INSERT INTO TrainLineStopsAt (stat_id, rid, line_pos) VALUES (2, 201, 1);
INSERT INTO TrainLineStopsAt (stat_id, rid, line_pos) VALUES (6, 201, 2);
INSERT INTO TrainLineStopsAt (stat_id, rid, line_pos) VALUES (7, 201, 3);
INSERT INTO TrainLineStopsAt (stat_id, rid, line_pos) VALUES (4, 401, 1);
INSERT INTO TrainLineStopsAt (stat_id, rid, line_pos) VALUES (4, 501, 1);
INSERT INTO TrainLineStopsAt (stat_id, rid, line_pos) VALUES (2, 401, 2);
INSERT INTO TrainLineStopsAt (stat_id, rid, line_pos) VALUES (6, 501, 2);

INSERT INTO BusRoute (rid, route_num) VALUES (10, 22);
INSERT INTO BusRoute (rid, route_num) VALUES (20, 84);
INSERT INTO BusRoute (rid, route_num) VALUES (30, 5);
INSERT INTO BusRoute (rid, route_num) VALUES (40, 9);
INSERT INTO BusRoute (rid, route_num) VALUES (50, 99);

INSERT INTO BusStop (stop_id, address) VALUES (1, 'Blanca St @ W 4th Ave');
INSERT INTO BusStop (stop_id, address) VALUES (2, 'W 4th Ave @ NW Marine Dr');
INSERT INTO BusStop (stop_id, address) VALUES (3, 'W 4th Ave @ Macdonald St');
INSERT INTO BusStop (stop_id, address) VALUES (4, 'Howe St @ W Robson St');
INSERT INTO BusStop (stop_id, address) VALUES (5, 'W Pender St @ W Granville St');
INSERT INTO BusStop (stop_id, address) VALUES (6, 'Powell St @ Commercial Dr');
INSERT INTO BusStop (stop_id, address) VALUES (7, 'E Broadway @ Clark Dr');

INSERT INTO BusRouteStopsAt (stop_id, rid, sched_time, route_pos) VALUES (1, 10, '08:01', 1);
INSERT INTO BusRouteStopsAt (stop_id, rid, sched_time, route_pos) VALUES (2, 10, '08:09', 2);
INSERT INTO BusRouteStopsAt (stop_id, rid, sched_time, route_pos) VALUES (3, 10, '08:15', 3);
INSERT INTO BusRouteStopsAt (stop_id, rid, sched_time, route_pos) VALUES (1, 20, '10:01', 3);
INSERT INTO BusRouteStopsAt (stop_id, rid, sched_time, route_pos) VALUES (6, 20, '09:51', 2);
INSERT INTO BusRouteStopsAt (stop_id, rid, sched_time, route_pos) VALUES (7, 20, '09:45', 1);
INSERT INTO BusRouteStopsAt (stop_id, rid, sched_time, route_pos) VALUES (4, 30, '16:21', 1);
INSERT INTO BusRouteStopsAt (stop_id, rid, sched_time, route_pos) VALUES (5, 30, '16:41', 2);
INSERT INTO BusRouteStopsAt (stop_id, rid, sched_time, route_pos) VALUES (3, 40, '16:35', 1);
INSERT INTO BusRouteStopsAt (stop_id, rid, sched_time, route_pos) VALUES (2, 40, '16:52', 2);
INSERT INTO BusRouteStopsAt (stop_id, rid, sched_time, route_pos) VALUES (1, 50, '20:01', 3);
INSERT INTO BusRouteStopsAt (stop_id, rid, sched_time, route_pos) VALUES (6, 50, '20:17', 2);
INSERT INTO BusRouteStopsAt (stop_id, rid, sched_time, route_pos) VALUES (4, 50, '20:37', 1);


INSERT INTO RIDER2 (rider_type,dob) VALUES ('child','2024');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('child','2023');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('child','2022');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('child','2021');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('child','2020');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('child','2019');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('child','2018');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('child','2017');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('child','2016');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('child','2015');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('child','2014');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('child','2013');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('child','2012');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('teen','2011');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('teen','2010');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('teen','2009');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('teen','2008');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('teen','2007');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('teen','2006');
INSERT INTO RIDER2 (rider_type,dob) VALUES ('teen','2005');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '2004');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '2003');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '2002');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '2001');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '2000');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1999');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1998');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1997');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1996');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1995');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1994');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1993');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1992');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1991');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1990');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1989');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1988');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1987');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1986');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1985');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1984');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1983');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1982');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1981');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1980');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1979');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1978');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1977');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1976');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1975');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1974');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1973');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1972');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1971');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1970');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1969');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1968');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1967');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1966');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1965');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1964');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1963');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1962');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1961');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1960');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1959');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1958');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1957');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1956');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1955');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('adult', '1954');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1953');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1952');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1951');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1950');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1949');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1948');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1947');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1946');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1945');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1944');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1943');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1942');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1941');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1940');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1939');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1938');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1937');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1936');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1935');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1934');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1933');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1932');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1931');
INSERT INTO RIDER2 (rider_type, dob) VALUES ('senior', '1930');

INSERT INTO RIDER1 (compass_id,dob) VALUES (1, '1990');
INSERT INTO RIDER1 (compass_id,dob) VALUES (2, '2022');
INSERT INTO RIDER1 (compass_id,dob) VALUES (3, '1950');
INSERT INTO RIDER1 (compass_id,dob) VALUES (4, '1989');
INSERT INTO RIDER1 (compass_id,dob) VALUES (5, '2000');
INSERT INTO RIDER1 (compass_id,dob) VALUES (6, '2006');

INSERT INTO PaidFares2(fare_type, price) VALUES ('zone 1', 2.00);
INSERT INTO PaidFares2(fare_type, price) VALUES ('zone 2', 1.50);
INSERT INTO PaidFares2(fare_type, price) VALUES ('zone 3', 1.25);
INSERT INTO PaidFares2(fare_type, price) VALUES ('zone 4', 1.00);
INSERT INTO PaidFares2(fare_type, price) VALUES ('multi zone', 3.00);


INSERT INTO PaidFares1(compass_id,date_time,fare_type) VALUES (1,'01/01/2024 12:00','zone 1');
INSERT INTO PaidFares1(compass_id,date_time,fare_type) VALUES (1,'01/01/2024 13:00','zone 1');
INSERT INTO PaidFares1(compass_id,date_time,fare_type) VALUES (2,'02/01/2024 11:00','zone 2');
INSERT INTO PaidFares1(compass_id,date_time,fare_type) VALUES (3,'01/05/2024 08:00','zone 3');
INSERT INTO PaidFares1(compass_id,date_time,fare_type) VALUES (4,'01/06/2024 12:00','zone 4');
INSERT INTO PaidFares1(compass_id,date_time,fare_type) VALUES (5,'02/03/2024 12:50','multi zone');
INSERT INTO PaidFares1(compass_id,date_time,fare_type) VALUES (6,'01/01/2024 12:01','zone 1');

INSERT INTO Bus (bus_id, bus_size) VALUES (1, 47);
INSERT INTO Bus (bus_id, bus_size) VALUES (2, 47);
INSERT INTO Bus (bus_id, bus_size) VALUES (3, 47);
INSERT INTO Bus (bus_id, bus_size) VALUES (4, 47);

INSERT INTO ScannerHas(scan_id, stat_id,bus_id) VALUES (1,null,1);
INSERT INTO ScannerHas(scan_id, stat_id,bus_id) VALUES (2,null,1);
INSERT INTO ScannerHas(scan_id, stat_id,bus_id) VALUES (3,null,2);
INSERT INTO ScannerHas(scan_id, stat_id,bus_id) VALUES (4,null,3);
INSERT INTO ScannerHas(scan_id, stat_id,bus_id) VALUES (5,null,4);
INSERT INTO ScannerHas(scan_id, stat_id,bus_id) VALUES (6,null,null);
INSERT INTO ScannerHas(scan_id, stat_id,bus_id) VALUES (7,1,null);
INSERT INTO ScannerHas(scan_id, stat_id,bus_id) VALUES (8,1,null);
INSERT INTO ScannerHas(scan_id, stat_id,bus_id) VALUES (9,2,null);
INSERT INTO ScannerHas(scan_id, stat_id,bus_id) VALUES (10,3,null);
INSERT INTO ScannerHas(scan_id, stat_id,bus_id) VALUES (11,4,null);
INSERT INTO ScannerHas(scan_id, stat_id,bus_id) VALUES (12,5,null);
INSERT INTO ScannerHas(scan_id, stat_id,bus_id) VALUES (13,6,null);
INSERT INTO ScannerHas(scan_id, stat_id,bus_id) VALUES (14,7,null);


INSERT INTO ValidateFare(scan_id,compass_id,date_time) VALUES (1, 1,'01/01/2024 12:00');
INSERT INTO ValidateFare(scan_id,compass_id,date_time) VALUES (1, 1,'01/01/2024 13:00');
INSERT INTO ValidateFare(scan_id,compass_id,date_time) VALUES (2, 2,'02/01/2024 11:00');
INSERT INTO ValidateFare(scan_id,compass_id,date_time) VALUES (4, 3,'01/05/2024 08:00');
INSERT INTO ValidateFare(scan_id,compass_id,date_time) VALUES (2, 4,'01/06/2024 12:00');
INSERT INTO ValidateFare(scan_id,compass_id,date_time) VALUES (2, 5,'02/03/2024 12:50');
INSERT INTO ValidateFare(scan_id,compass_id,date_time) VALUES (1, 6,'01/01/2024 12:01');