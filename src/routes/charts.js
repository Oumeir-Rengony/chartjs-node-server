const express = require("express");
const router = express.Router();

const ChartController = require('../controllers/ChartController');

router.get('/ping', async (req,res) => {
    const response = await new ChartController().pingServer();
    res.send(response);
});


router.post('/createChart', async (req,res) => {
    const response = await new ChartController().createChart(req.body);
    res.send(response);
});

module.exports = router;