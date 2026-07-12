import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FinancialForecast = ({ predictionData }) => {
  // If vectors are missing, fallback to single inputs if available
  if (!predictionData?.financial_forecast_realistic) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Overview (Baseline)</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-500 block">Year 1 Revenue</span>
            <span className="text-xl font-bold text-gray-800">${predictionData?.revenue_y1 || 0}</span>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-500 block">Year 2 Revenue</span>
            <span className="text-xl font-bold text-gray-800">${predictionData?.revenue_y2 || 0}</span>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-500 block">Year 3 Revenue</span>
            <span className="text-xl font-bold text-gray-800">${predictionData?.revenue_y3 || 0}</span>
          </div>
        </div>
      </div>
    );
  }

  // Parse arrays securely from database strings
  const parseVector = (str) => {
    try { return typeof str === 'string' ? JSON.parse(str) : str; }
    catch(e) { return []; }
  };

  const optimistic = parseVector(predictionData.financial_forecast_optimistic);
  const realistic = parseVector(predictionData.financial_forecast_realistic);
  const pessimistic = parseVector(predictionData.financial_forecast_pessimistic);

  // Labels for 36 months horizon
  const labels = Array.from({ length: 36 }, (_, i) => `Month ${i + 1}`);

  const data = {
    labels,
    datasets: [
      {
        label: 'Optimistic Scale (8% MoM)',
        data: optimistic,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.2,
      },
      {
        label: 'Realistic Projection (5% MoM)',
        data: realistic,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.2,
      },
      {
        label: 'Pessimistic Floor (2% MoM)',
        data: pessimistic,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.2,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: $${context.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        ticks: { callback: (value) => '$' + value.toLocaleString() },
        title: { display: true, text: 'Monthly Gross Revenue ($)' }
      }
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">36-Month Compounding Financial Trajectory</h3>
        <p className="text-sm text-gray-500 mt-1">
          Simulated predictive modeling tracking user acquisition run-rates and dynamic marketing conversion scales.
        </p>
      </div>

      <div className="h-96">
        <Line data={data} options={options} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-50">
        <div className="border border-emerald-100 bg-emerald-50/30 p-4 rounded-xl">
          <span className="text-sm font-semibold text-emerald-800">Optimistic Cumulative</span>
          <span className="text-2xl font-black text-emerald-700 block mt-1">
            ${optimistic.reduce((a, b) => a + b, 0).toLocaleString(undefined, {maximumFractionDigits:0})}
          </span>
        </div>
        <div className="border border-blue-100 bg-blue-50/30 p-4 rounded-xl">
          <span className="text-sm font-semibold text-blue-800">Realistic Cumulative</span>
          <span className="text-2xl font-black text-blue-700 block mt-1">
            ${realistic.reduce((a, b) => a + b, 0).toLocaleString(undefined, {maximumFractionDigits:0})}
          </span>
        </div>
        <div className="border border-red-100 bg-red-50/30 p-4 rounded-xl">
          <span className="text-sm font-semibold text-red-800">Pessimistic Floor Total</span>
          <span className="text-2xl font-black text-red-700 block mt-1">
            ${pessimistic.reduce((a, b) => a + b, 0).toLocaleString(undefined, {maximumFractionDigits:0})}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FinancialForecast;