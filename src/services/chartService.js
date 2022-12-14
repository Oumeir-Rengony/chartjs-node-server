const { getMinMax } = require('../utils/utils.js');
const { CanvasRenderService   } = require('chartjs-node-canvas');


//draw stripped horizontal band
const drawBands = (chart) => {
    let ctx = chart.chart.ctx;
    let chartArea = chart.chartArea;
    let meta = chart.getDatasetMeta(0);
    const len = meta.data.length - 1;
    let left = meta.data[0]._model.x;
    let right = meta.data[len]._model.x;
    const spaceV = (chartArea.bottom - chartArea.top) / 7;
    const spaceH = right - left;
    
    ctx.fillStyle = chart.config.options.BandConfig.backgroundColor;
    ctx.fillRect(left, chartArea.top, spaceH, spaceV);
    ctx.fillRect(left, chartArea.top + spaceV * 2, spaceH, spaceV);
    ctx.fillRect(left, chartArea.top + spaceV * 4, spaceH, spaceV);
    ctx.fillRect(left, chartArea.top+ spaceV * 6, spaceH, spaceV);
}

const drawInterline = (chart) => {
    let ctx = chart.chart.ctx;
    let chartArea = chart.chartArea;
    let meta = chart.getDatasetMeta(0);
    const len = meta.data.length - 1;

    for (let i = 0; i < len; i++) {
        if (i % 2 !== 0) {
            ctx.beginPath();
            ctx.strokeStyle = chart.config.options.BandConfig.interlineColor;
            ctx.moveTo(meta.data[i]._model.x, chartArea.top);
            ctx.lineTo(meta.data[i]._model.x, chartArea.bottom + 10);
            ctx.stroke();
        }
    }
}

const drawLabels = (chart) => {

    let ctx = chart.chart.ctx;
    let meta = chart.getDatasetMeta(0);
    const len = meta.data.length - 1;
    const datasets = chart.config.data.datasets;
    const padding = chart.config.options.BandConfig.labelPadding;

    ctx.fillStyle = chart.options?.labelFontColor;
    ctx.textBaseline = 'middle';
    // ctx.font = `600 12px ${chart.config.options.BandConfig.fontFamily}`

    datasets.forEach((data, index) => {
        if (index !== 3) {
            const metadata = chart.controller.getDatasetMeta(index)
            const label = data?.label || ''
            const xOffset = metadata.data[len]._model.x + padding;
            const yOffset = metadata.data[len]._model.y;
            ctx.fillText(label, xOffset, yOffset);
        }
    })
}

const drawAxes = (chart) => {

    let ctx = chart.chart.ctx;
    let chartArea = chart.chartArea;
    let meta = chart.getDatasetMeta(0);
    const len = meta.data.length - 1;
    let left = meta.data[0]._model.x;
    let right = meta.data[len]._model.x;
    
    //y axis base line
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = chart.config.options.BandConfig.baseColor;
    ctx.moveTo(meta.data[0]._model.x, chartArea.top);
    ctx.lineTo(meta.data[0]._model.x, chartArea.bottom + 10);
    ctx.stroke();
    
    //x axis base line
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = chart.config.options.BandConfig.baseColor;
    ctx.moveTo(left - 10, chartArea.bottom);
    ctx.lineTo(right, chartArea.bottom);
    ctx.stroke();
}

const drawTooltip = (ChartJS, pluginTooltips) => {
    ChartJS.helpers.each(pluginTooltips, function (tooltip) {
        tooltip.initialize();
        tooltip.update();
        tooltip.pivot();
        tooltip.draw();
    });
}
  
const chartCallback = (ChartJS) => {
    ChartJS.defaults.global.defaultFontSize = 12;
    // ChartJS.defaults.global.defaultFontFamily = "Harmonia Sans Std Regular";
    ChartJS.defaults.global.defaultFontColor = "#1e647d";

    ChartJS.plugins.register({
        beforeRender: function (chart) {
            if (chart.config.options.showAllTooltips) {
                chart.pluginTooltips = [];
                chart.config.data.datasets.forEach((dataset, i) => {
                if (
                    dataset &&
                    (i === 3 ||
                    i === chart.config.data.datasets.length - 1)
                ) {
                    chart.getDatasetMeta(i).data.forEach((sector) => {
                        chart.pluginTooltips.push(new (ChartJS).Tooltip({
                                _chart: chart.chart,
                                _chartInstance: chart,
                                _data: chart.data,
                                _options: chart.options.tooltips,
                                _active: [sector]
                            }, chart));
                        });
                    }   
        
                });
                // turn off normal tooltips
                chart.options.tooltips.enabled = false;
            }
        },
        beforeDraw: function (chart) {
            let ctx = chart.chart.ctx;
            
            if (chart.config.options.BandConfig) {
                ctx.save();
                drawBands(chart);
                ctx.save();
            }

            drawInterline(chart);
            ctx.save();

            drawLabels(chart);
            ctx.save();
        },
        afterDraw: function (chart) {
            if (chart.config.options.showAllTooltips) {
                // turn on tooltips
                chart.options.tooltips.enabled = true;
                drawTooltip(ChartJS, chart.pluginTooltips);
                chart.options.tooltips.enabled = false;
            }

            drawAxes(chart);
        }
       
    });
}

const getOptions = (chartConfig, minMaxValue) => {

  return  {
    responsive: true,
    labelFontColor: chartConfig.colors.teal,
    showAllTooltips: true,
    tooltips: {
      caretPadding: 5,
      backgroundColor: chartConfig.colors.indigo,
      opacity: 1,
      displayColors: false,
      cornerRadius: 3,
      bodyFontSize: 12,
      callbacks: {
        title() {
          return '';
        },
        label(tooltipItem) {
          return `${tooltipItem.yLabel} ${chartConfig.unit}`;
        }
      }
    },
    events: [],
    BandConfig: {
      backgroundColor: chartConfig.colors.bgTeal,
      interlineColor: chartConfig.enableAccessibleFeatures ? chartConfig.colors.lightGray : chartConfig.colors.lightTeal,
      baseColor: chartConfig.colors.baseColor,
      labelPadding: chartConfig.isMobile ? 9 : 15,
      // fontFamily: colors.fontFamily
    },
    legend: {
      display: false
    },
    layout: {
      padding: {
        left: 0,
        right: 50,
        top: 20,
        bottom: 0
      }
    },
    scales: {
      yAxes: [
        {
          gridLines: {
            color: chartConfig.enableAccessibleFeatures ? chartConfig.colors.indigoTransparent : chartConfig.colors.lightTeal
          },
          ticks: {
            beginAtZero: false,
            stepSize: chartConfig.stepVerticalValue || 5,
            min: chartConfig.minVerticalValue || minMaxValue?.min,
            max: minMaxValue?.max,
            padding: chartConfig.isMobile ? 4 : 8
          }
        }
      ],
      xAxes: [
        {
          scaleFontSize: 12,
          gridLines: {
            color: chartConfig.enableAccessibleFeatures ? chartConfig.colors.lightGray : chartConfig.colors.lightTeal
          },
          ticks: {
            beginAtZero: true,
            maxRotation: 0,
            minRotation: 0,
            stepSize: 1,
            min: 0,
            max: 24,
            padding: 4,
            callback(labelValue) {
              return labelValue % 2 === 0 ? labelValue : '';
            }
          }
        }
      ]
    }
  };
}

const getData = (chartConfig) => {

  return {
    labels: [...Array(25).keys()],
    datasets: [
      {
        data: chartConfig.datapoints ? chartConfig.datapoints.first.data : [],
        borderDash: [5, 5],
        backgroundColor: chartConfig.colors.bgTealTransparent,
        borderColor: chartConfig.colors.teal,
        borderWidth: 1,
        fill: '1',
        radius: 0,
        label: chartConfig.datapoints.first.label,
        steppedLine: false
      },
      {
        data: chartConfig.datapoints ? chartConfig.datapoints.second.data : [],
        borderDash: [5, 5],
        backgroundColor: chartConfig.colors.bgTealTransparent,
        borderColor: chartConfig.colors.teal,
        borderWidth: 1,
        fill: '1',
        radius: 0,
        label: chartConfig.datapoints.second.label,
        steppedLine: false
      },
      {
        data: chartConfig.datapoints ? chartConfig.datapoints.third.data : [],
        borderDash: [5, 5],
        backgroundColor: chartConfig.colors.bgTealTransparent,
        borderColor: chartConfig.colors.teal,
        borderWidth: 1,
        fill: '1',
        radius: 0,
        label: chartConfig.datapoints.third.label,
        steppedLine: false
      },
      {
        data: [{ x: chartConfig.age, y: chartConfig.value }],
        radius: 4,
        pointBackgroundColor: chartConfig.enableAccessibleFeatures ? "" : chartConfig.colors.yellow,
        pointBorderWidth: chartConfig.enableAccessibleFeatures ? 2 : 1,
        pointBorderColor: chartConfig.colors.indigo
      }
    ]
  };
}

/*  This is a safe check to remove whitespaces from colors.
    whitespaces are added when object is Stringify
*/
const sanitizeColors = (colors) => {
  let updatedColors = {};
  for (const key in colors) {
    const value = colors[key].trim();
    updatedColors = {...updatedColors, [key]:value}
  }

  return updatedColors;
}


 /**
 * chartConfig is an object containing the following properties:
 * 
 * @param { Object } resultUiString     Object containing UiStrings used on result page
 * @param { string } tabTitle           Title of the tab activated
 * @param { number } width              canvas width override
 * @param { number } height             canvas height override
 * @param { string } xLabel             X axis label
 * @param { string } yLabel             Y axis Label
 * @param { string } zLabel             Z axis Label
 * @param { string } unit               data uniti for chart
 * @param { number } value              Value point
 * @param { number } age                Baby age
 * @param { Array } datapoints          Datapoints references
 * @param { boolean } isMobile          check if on mobile device
 * @param { number } minVerticalValue   Vertical axis minimum value
 * @param { number } stepVerticalValue  Vertical axis step Value
 * @param { string } chartAltText       title of the chart
 * @param { Object } colors             colors for the chart

 */

const createChartImage = async (chartConfig) => {

  chartConfig = {... chartConfig, colors: sanitizeColors(chartConfig.colors)};

  const canvasRenderService = new CanvasRenderService(chartConfig.width, chartConfig.height, chartCallback);

  // canvasRenderService.registerFont('./testData/VTKS UNAMOUR.ttf', { family: 'VTKS UNAMOUR' });

  // vertical axis min max
  const minMaxValue = getMinMax(chartConfig.value, chartConfig.datapoints);

  // define options
  const options = getOptions(chartConfig, minMaxValue);

  // define data
  const data = getData(chartConfig);

  const base64Image = await canvasRenderService.renderToDataURL({
    type: 'line',
    data,
    options
  });

  
  return base64Image;
};

module.exports = {
    createChartImage
}