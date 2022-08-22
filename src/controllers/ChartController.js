const { createChartImage } = require('../services/chartService');

class ChartController {

    async pingServer() {
      return "Server is up an running";
    }
  
    async createChart(chartConfig) {
      return createChartImage(chartConfig);
    }
  }
  
  module.exports = ChartController;


