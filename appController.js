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

router.get('/clientTable', async (req, res) => {
    const tableContent = await appService.fetchClientTableFromDb();
    res.json({data: tableContent});
});

router.get('/routeTable', async (req, res) => {
    const tableContent = await appService.fetchRoutesTableFromDb();
    res.json({data: tableContent});
});

router.get('/busRouteTable', async (req, res) => {
    const tableContent = await appService.fetchBusRouteTableFromDb();
    res.json({data: tableContent});
});

router.get('/groupBusStops', async (req, res) => {
    const tableContent = await appService.groupCountBusStops();
    res.json({data: tableContent});
});
router.get('/trainLineTable', async (req, res) => {
    const tableContent = await appService.fetchTrainLineTableFromDb();
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

router.post("/insert-clientTable", async (req, res) => {
    const { compass_id, dob } = req.body;
    const insertResult = await appService.insertClientTable(compass_id, dob);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-clientTable", async (req, res) => {
    const { compass_id, dob } = req.body;
    const insertResult = await appService.insertClientTable(compass_id, dob);
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

router.post('/query-select-BusRoute', async (req, res) => {
    const { routeNumbers } = req.body;
    const tableContent = await appService.querySelectBusRouteTable(routeNumbers);
    res.json({data: tableContent});
});

router.post('/query-select-TrainLine', async (req, res) => {
    const { lineNames } = req.body;
    const tableContent = await appService.querySelectTrainLineTable(lineNames);
    res.json({data: tableContent});
});


module.exports = router;