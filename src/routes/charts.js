const express = require("express");
const router = express.Router();

const ChartController = require('../controllers/ChartController');

router.get('/ping', async (req,res) => {
    const data = await new ChartController().pingServer();
    const response = { data };
    res.send(response);
});


router.post('/createChart', async (req,res) => {
    const data = await new ChartController().createChart(req.body);
    const response = { data };
    res.send(response);
});

module.exports = router;