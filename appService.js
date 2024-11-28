const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchClientTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT r1.compass_id,r1.dob, r2.rider_type FROM RIDER1 r1, RIDER2 r2 WHERE r1.dob = r2.dob');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchEveryScanerTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT r.compass_id FROM RIDER1 r WHERE NOT EXISTS (SELECT s.scan_id FROM ScannerHas s WHERE NOT EXISTS (SELECT v.compass_id FROM ValidateFare v WHERE v.compass_id = r.compass_id AND v.scan_id = s.scan_id))');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchPaymentTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT compass_id, SUM(price) FROM PaidFares1 p1, PaidFares2 p2 WHERE p1.fare_type = p2.fare_type GROUP BY compass_id HAVING count(*) > 1');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchFareTableFromDb(id, sel) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT ${sel} FROM PaidFares1 p1 JOIN ValidateFare v ON p1.compass_id = v.compass_id AND p1.date_time = v.date_time JOIN ScannerHas s ON v.scan_id = s.scan_id WHERE p1.compass_id = :id`, 
            [id], 
            { autoCommit: true });
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchRoutesTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM ROUTE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchBusRouteTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM BUSROUTE');
        return result.rows;
    }).catch((error) => {
        console.log(error.message);
        return [];
    });
}

async function fetchBusRouteStopsAtFromDb( route_id ) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT * FROM BUSROUTESTOPSAT WHERE rid =:route_id ORDER BY route_pos DESC`,
            [route_id],
            { autoCommit: true }
        );
        return result.rows;
    }).catch((error) => {
        console.log(error.message);
        return [];
    });
}

async function fetchTrainLineTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM TRAINLINE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}


async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertClientTable(compass_id, dob) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO RIDER1 (compass_id, dob) VALUES (:compass_id, :dob)`,
            [compass_id, dob],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function removeClient(id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`DELETE FROM Rider1 WHERE compass_id = :id`,
            [id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function fetchEmployeesVehicles() {
    return await withOracleDB(async (connection) => {
        console.log("in here");
        const result = await connection.execute('SELECT DISTINCT d.name AS employee_name, d.seniority, b.bus_id AS vehicle_id, b.bus_size AS vehicle_size FROM Driver d LEFT JOIN BusDriver bd ON d.staff_id = bd.staff_id LEFT JOIN DrivesBus db ON bd.staff_id = db.staff_id LEFT JOIN Bus b ON db.bus_id = b.bus_id where b.bus_id IS NOT NULL UNION SELECT DISTINCT d.name AS employee_name, d.seniority, t.train_id AS vehicle_id, t.train_size AS vehicle_size FROM Driver d LEFT JOIN TrainDriver td ON d.staff_id = td.staff_id LEFT JOIN DrivesTrain dt ON td.staff_id = dt.staff_id LEFT JOIN Train t ON dt.train_id = t.train_id WHERE t.train_id IS NOT NULL');
        return result.rows;
    }).catch(() => {
        return -1;
    });
}

async function fetchRoutes() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT rid, destination FROM Route');
        return result.rows;
    }).catch(() => {
        return -1;
    });
}

async function fetchDriver(routeNum) {
    let query = "SELECT d.name AS employee_name, d.seniority, r.rid, r.destination FROM Driver d JOIN BusDriver bd ON d.staff_id = bd.staff_id JOIN DrivesBus db ON bd.staff_id = db.staff_id JOIN BusAssigned ba ON db.bus_id = ba.bus_id JOIN Route r ON ba.route_id = r.rid WHERE r.rid = :routeNum UNION SELECT d.name AS employee_name, d.seniority, r.rid, r.destination FROM Driver d JOIN TrainDriver td ON d.staff_id = td.staff_id JOIN DrivesTrain dt ON td.staff_id = dt.staff_id JOIN TrainAssigned ta ON dt.train_id = ta.train_id JOIN Route r ON ta.route_id = r.rid WHERE r.rid = :routeNum"

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query, {routeNum}, { autoCommit: true });
        return result.rows;
    }).catch(() => {
        return -1;
    });
}

async function fetchMaxClientsScanner() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('WITH ScannerClientCounts AS ( SELECT scan_id, COUNT(DISTINCT compass_id) AS client_count FROM ValidateFare GROUP BY scan_id) SELECT scan_id, client_count FROM ScannerClientCounts WHERE client_count = (SELECT MAX(client_count) FROM ScannerClientCounts)');
        return result.rows;
    }).catch(() => {
        return -1;
   });
}

async function querySelectRouteTable(rid, dest) {
    console.log(rid, " in appService is type ", typeof(rid));
    console.log(dest, " in appService is type ", typeof(dest));

    let query = "SELECT * FROM ROUTE";
    const binds = {};

    if (rid[0] !== "All") {
        query += " WHERE (";
        const conditions = rid.map((num, index) => {
            const bindKey = `rid${index + 1}`; // Dynamic bind key
            binds[bindKey] = num; // Add to binds object
            return `rid = :${bindKey}`; // Add bind variable to condition
        });
        query += conditions.join(" OR ");
        query += ")";
    }

    if (dest !== "") {
        query += rid[0] !== "All" ? " AND " : " WHERE ";
        query += `destination = :dest`;
        binds["dest"] = dest; // Add destination to binds
    }

    console.log(query, "binds ", binds);

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query, binds);
        console.log("Result rows:", result.rows);
        return result.rows;
    }).catch((error) => {
        console.error("Error:", error.message);
        return [];
    });
}

async function querySelectTrainLineTable(lineNames) {
    let query = "SELECT * FROM TRAINLINE WHERE ";
    const binds = {};

    const conditions = lineNames.map((num, index) => {
        const bindKey = `line_name${index + 1}`; 
        binds[bindKey] = num; 
        return `LINE_NAME = :${bindKey}`; 
    });

    // Join conditions with OR
    query += conditions.join(" OR ");

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query, binds);
        console.log("train lines:", result.rows);
        return result.rows;
    }).catch((error) => {
        console.error("Error:", error.message);
        return [];
    });
}

async function groupCountBusStops() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT RID, COUNT(*) FROM BUSROUTESTOPSAT GROUP BY rid ORDER BY rid`
        );
        return result.rows;
    }).catch((error) => {
        console.error("Error:", error.message);
        return [];
    });
}

async function updateBusRoutePos(rid, pos) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`UPDATE BUSROUTESTOPSAT SET route_pos=:pos WHERE rid=:rid`,
            [pos, rid],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateBusTime(rid, old, time) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`UPDATE BUSROUTESTOPSAT SET sched_time=:time WHERE rid=:rid AND sched_time=:old`,
            [time, rid, old],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateBusPos(rid, old, pos) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`UPDATE BUSROUTESTOPSAT SET route_pos=:pos WHERE rid=:rid AND route_pos=:old`,
            [pos, rid, old],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    fetchClientTableFromDb,
    fetchRoutesTableFromDb,
    fetchBusRouteTableFromDb,
    fetchBusRouteStopsAtFromDb,
    fetchTrainLineTableFromDb,
    updateBusRoutePos,
    updateBusTime,
    updateBusPos,
    initiateDemotable, 
    insertDemotable,
    insertClientTable, 
    updateNameDemotable, 
    countDemotable,
    fetchEmployeesVehicles,
    fetchRoutes,
    fetchDriver,
    fetchMaxClientsScanner
    querySelectRouteTable,
    querySelectTrainLineTable,
    groupCountBusStops,
    removeClient,
    fetchFareTableFromDb,
    fetchPaymentTableFromDb,
    fetchEveryScanerTableFromDb
};