import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import './ResultsView.css'; 

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const ResultsView = ({ analysis, onTryAgain }) => {
  const chartData = {
    labels: ['Positivity (Valence)', 'Intensity (Energy)'],
    datasets: [{
      label: 'Mood Analysis',
      data: [analysis.avgValence, analysis.avgEnergy],
      fill: true,
      backgroundColor: 'rgba(29, 185, 84, 0.2)',
      borderColor: 'rgb(29, 185, 84)',
      pointBackgroundColor: 'rgb(29, 185, 84)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(29, 185, 84)'
    }]
  };
  
  const chartOptions = {
    elements: { line: { borderWidth: 3 } },
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
        pointLabels: { color: '#ffffff', font: { size: 14 } },
        ticks: { display: false, stepSize: 0.25 },
        min: 0,
        max: 1
      }
    },
    plugins: { legend: { display: false } }
  };

  return (
    <div className="results-view">
      <div className="card">
        <h1>Recent Listening Analysis</h1>
        <p>Predominant Mood Profile:</p>
        <strong>{analysis.moodDescription}</strong>
        <div className="chart-container">
          <Radar data={chartData} options={chartOptions} />
        </div>
        <button className="try-again-button" onClick={onTryAgain}>Analyze Again</button>
      </div>
    </div>
  );
};

export default ResultsView;