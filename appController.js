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

router.get('/everyScannerTable', async (req, res) => {
    const tableContent = await appService.fetchEveryScannerTableFromDb();
    res.json({data: tableContent});
});

router.get('/paymentTable', async (req, res) => {
    const tableContent = await appService.fetchPaymentTableFromDb();
    res.json({data: tableContent});
});

router.post('/fareTable', async (req, res) => {
    const { compass_id, selected } = req.body;
    const tableContent = await appService.fetchFareTableFromDb(compass_id, selected);
    res.json({data: tableContent});
});

router.post('/removeClient', async (req, res) => {
    const { compass_id } = req.body;
    const tableContent = await appService.removeClient(compass_id);
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

router.get('/countBusStops', async (req, res) => {
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

router.post('/query-select-Route', async (req, res) => {
    const { rid, destination } = req.body;
    const tableContent = await appService.querySelectRouteTable(rid, destination);
    res.json({data: tableContent});
});

router.post('/query-select-TrainLine', async (req, res) => {
    const { lineNames } = req.body;
    const tableContent = await appService.querySelectTrainLineTable(lineNames);
    res.json({data: tableContent});
});

router.post('/busRouteStopsAtTable', async (req, res) => {
    const {rid} = req.body;
    const tableContent = await appService.fetchBusRouteStopsAtFromDb(rid);
    res.json({data: tableContent});
});

router.post("/update-bus-time", async (req, res) => {
    const { rid, old, time } = req.body;
    const updateResult = await appService.updateBusTime(rid, old, time);
    if (updateResult) {
        res.json({ success: true });

router.get('/max-clients', async (req, res) => {
    const clients = await appService.fetchMaxClientsScanner();
    if (clients) {
        res.json({ data: clients });
    } else {
        res.status(500).json({ success: false });
    }
});
router.post("/update-bus-pos", async (req, res) => {
    const { rid, old, pos } = req.body;
    const updateResult = await appService.updateBusPos(rid, old, pos);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

module.exports = router;