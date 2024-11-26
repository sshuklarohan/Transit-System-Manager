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
        const result = await connection.execute('SELECT :sel FROM PaidFares1 p1 NATURAL LEFT OUTER JOIN ValidateFare v, ScannerHas s WHERE compass_id = :id AND s.scan_id = v.scan_id ',
            [id,sel],
            { autoCommit: true });
        return result.rows;
    }).catch(() => {
        return [];
    });
}



async function fetchClientTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT compass_id, dob, rider_type FROM RIDER1 r1, RIDER2 r2 WHERE r1.dob = r2.dob');
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
            `INSERT INTO RIDER1 (compass_id, dob) VALUES (:compass_id, :dob);`,
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
        const result = await connection.execute(
            `DELETE FROM Rider1 WHERE compass_id = :id`,
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


async function querySelectBusRouteTable(routeNumbers) {
    console.log(routeNumbers, " in appService is type ", typeof(routeNumbers));

    let query = "SELECT * FROM BUSROUTE WHERE ";
    const binds = {};

    const conditions = routeNumbers.map((num, index) => {
        const bindKey = `route_num${index + 1}`; 
        binds[bindKey] = num; 
        return `ROUTE_NUM = :${bindKey}`; 
    });

    // Join conditions with OR
    query += conditions.join(" OR ");

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
        const result = await connection.execute(`SELECT COUNT(*) FROM BUSROUTESTOPSAT GROUP BY rid`,
        );
        return result.rows;
    }).catch((error) => {
        console.error("Error:", error.message);
        return [];
    });
}

module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    fetchClientTableFromDb,
    fetchFareTableFromDb,
    fetchClientTableFromDb,
    fetchRoutesTableFromDb,
    fetchBusRouteTableFromDb,
    fetchTrainLineTableFromDb,
    initiateDemotable, 
    insertDemotable, 
    updateNameDemotable, 
    countDemotable,
    querySelectBusRouteTable,
    querySelectTrainLineTable,
    groupCountBusStops
};