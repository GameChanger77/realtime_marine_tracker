import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineChart = ({ dataPoints, title, maxChartValue}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let myChart = null;

    const data = {
      labels: [
        'Point 1', 'Point 2', 'Point 3', 'Point 4', 'Point 5', 'Point 6', 'Point 7', 'Point 8'
      ],
      datasets: [
        {
          label: title,
          data: dataPoints,
          borderColor: 'blue',
          backgroundColor: 'transparent',
          borderWidth: 2, 
          pointRadius: 5, 
        },
      ],
    };

    if (chartRef && chartRef.current) {
      myChart = new Chart(chartRef.current, {
        type: 'line',
        data: data,
        options: {
          animation: false,
          responsive: true,
          scales: {
            x: {
              ticks: {
                font: {
                  size: 24,
                },
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)', 
                borderWidth: 20, 
              },
            },
            yAxisRange:[0,100],
            y: {
              ticks: {
                font: {
                  size: 24, 
                },

              },
              
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 20, 
              },
              beginAtZero: true,
                                steps: 10,
                                stepValue: 5,
                                max: maxChartValue
            },
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 36, 
                },
              },
              size:36
            },
            tooltip: {
              bodyFont: {
                size: 14, 
              },
            },
          },
        },
      });
    }

    return () => {
      // Cleanup
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [dataPoints]);

  return <canvas ref={chartRef} className="single-chart-container" />;
};

export default LineChart;
