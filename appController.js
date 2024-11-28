const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({ 
            success: true,  
            count: tableCount
        });
    } else {
        res.status(500).json({ 
            success: false, 
            count: tableCount
        });
    }
});

router.get('/employees-vehicles', async (req, res) => {
    const tableContent = await appService.fetchEmployeesVehicles();
    if (tableContent) {
        res.json({ data: tableContent });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/routes', async (req, res) => {
    const routes = await appService.fetchRoutes();
    if (routes) {
        res.json({ data: routes });
    } else {
        res.status(500).json({ success: false });
    }
})

router.post('/drivers-routes', async (req, res) => {
    const { routeNum } = req.body;
    const driver = await appService.fetchDriver(routeNum);
    console.log(driver)
    if (driver) {
        res.json({ data: driver });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/max-clients', async (req, res) => {
    const clients = await appService.fetchMaxClientsScanner();
    if (clients) {
        res.json({ data: clients });
    } else {
        res.status(500).json({ success: false });
    }
})

module.exports = router;