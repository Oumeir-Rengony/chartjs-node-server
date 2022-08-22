class ChartController {

    async pingServer() {
      console.log('Server is up an running');
      return "Server is up an running";
    }
  
    async createChart(data) {
      console.log("createChart");
      return data;
    }
  }
  
  module.exports = ChartController;