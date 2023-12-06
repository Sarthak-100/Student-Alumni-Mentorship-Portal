import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const ConversationsByDateBarPlot = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/conversations/conversationsByDate');
        setData(response.data);
        createChart(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const createChart = (data) => {
    const dates = data.map(entry => entry._id);
    const counts = data.map(entry => entry.count);

    const ctx = document.getElementById('conversationChart');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [{
          label: 'Number of Conversations',
          data: counts,
          backgroundColor: 'rgba(54, 162, 235, 0.5)', // Adjust color as needed
          borderColor: 'rgba(54, 162, 235, 1)', // Adjust color as needed
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
      
    });
  };

  return (
    <div style={{ width: '50%', margin: '0 auto' }}> {/* Adjust the width and margin */}
      <canvas id="conversationChart" width="400" height="200"></canvas> {/* Adjust the canvas dimensions */}
    </div>
  );
};

export default ConversationsByDateBarPlot;
