'use client';
import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function SkillRadar({ data }: { data: any }) {
  // Fallback data if user has no subjects yet
  const safeData = data && Object.keys(data).length > 0 ? data : { "Algebra": 10, "Physics": 10, "Coding": 10, "Literature": 10 };

  const chartData = {
    labels: Object.keys(safeData),
    datasets: [{
      label: 'Your Proficiency',
      data: Object.values(safeData),
      backgroundColor: 'rgba(37, 99, 235, 0.15)', // Tailwind Blue-600 transparent
      borderColor: 'rgba(37, 99, 235, 0.8)',
      pointBackgroundColor: '#ffffff',
      pointBorderColor: 'rgba(37, 99, 235, 1)',
      pointHoverBackgroundColor: 'rgba(37, 99, 235, 1)',
      pointHoverBorderColor: '#ffffff',
      borderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // CRITICAL: This stops the graph from becoming huge
    scales: {
      r: {
        angleLines: { color: 'rgba(0, 0, 0, 0.05)' },
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        pointLabels: { font: { size: 12, family: "'Inter', sans-serif" }, color: '#475569' },
        ticks: { display: false, min: 0, max: 100 },
      },
    },
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: '#475569', usePointStyle: true } },
    },
  };

  // The wrapper div with strictly defined height is what makes the graph behave
  return (
    <div className="relative h-64 w-full flex items-center justify-center">
      <Radar data={chartData} options={options} />
    </div>
  );
}