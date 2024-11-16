CREATE TABLE RIDER1(
	compass_id INTEGER,
	dob VARCHAR,
	PRIMARY KEY(compass_id)
)

CREATE TABLE RIDER2(
	rider_type VARCHAR,
	dob VARCHAR,
	PRIMARY KEY (dob)
)

CREATE TABLE PaidFares1(
	compass_id INTEGER
	date_time VARCHAR
	fare_type VARCHAR
	PRIMARY KEY(compass_id,date_time)
	FOREIGN KEY(compass_id) REFERENCES Rider1 ON DELETE CASCADE
	FOREIGN KEY(fare_type) REFERENCES PaidFares2 ON DELETE CASCADE
)

CREATE TABLE PaidFares2(
	fare_type VARCHAR,
	price DECIMAL(5,2),
	PRIMARY KEY(fare_type)
)

CREATE TABLE ValidateFare(
	scan_id INTEGER,
	compass_id INTEGER,
	date_time VARCHAR,
	PRIMARY KEY(scan_id,compass_id,date_time)
	FOREIGN KEY(scan_id) REFERENCES Scanner ON DELETE CASCADE
	FOREIGN KEY(compass_id,date_time) REFERENCES PaidFares1(compass_id,date_time) ON DELETE CASCADE
)

CREATE TABLE ScannerHas(
	scan_id INTEGER
	stat_id INTEGER
	bus_id INTEGER
	PRIMARY KEY(scan_id)
	FOREIGN KEY(stat_id) REFERENCES TrainStation ON DELETE CASCADE
	FOREIGN KEY(bus_id) REFERENCES Bus ON DELETE CASCADE
)



