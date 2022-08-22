const isDivisible = (value) => value % 5 === 0;


const checkMinMax = (value) => {
    // round value
    const val = Math.round(value);
    // set default;
    let min = 5;
    let max = 40;
    if (val <= 5) {
      return {
        min: 0,
        max: 35
      }
    }
    else if (val <= 35) {
      return {
        min,
        max
      }
    }
    else {
      for (let i = val; i > (val - 10); i--) {
        if (isDivisible(i)) {
          min = i - 15;
          max = min + (5 * 7)
          break;
        }
      }
      return {
        min,
        max
      }
    }
}

const getMinMax = (value, datapoints) => {
    // set vertical axis min max
    const minMaxValue = checkMinMax(value);

    const lastData = datapoints.third?.data || datapoints.second?.data || datapoints.first?.data || []
    const maxDataPoints = lastData[lastData.length - 1]

    if (maxDataPoints && maxDataPoints > minMaxValue.max) {
        minMaxValue.max = Math.floor(maxDataPoints / 10) * 10 + 10;
    }

    if (datapoints.first?.data && datapoints.first.data[0] < minMaxValue.min) {
        minMaxValue.min = Math.floor(datapoints.first.data[0] / 10) * 10;
    }

    return minMaxValue;
}

module.exports = {
    getMinMax
}