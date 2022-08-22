const { createChartImage } = require('../services/chartService');

class ChartController {

    async pingServer() {
      return "Server is up an running";
    }
  
    async createChart(data) {
      createChartImage(data)
      // return data;
    }
  }
  
  module.exports = ChartController;


