import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import {
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const ConversationsByDateBarPlot = () => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const chartRef = useRef(null);

  const getDaysInMonth = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month - 1, i + 1));
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const updateChart = () => {
    console.log("DATA 2",data)
    if (chartRef.current && chartRef.current !== null) {
      const chartInstance = window.conversationChartInstance;
      chartInstance.data.labels = data.map((entry) => entry._id);
      chartInstance.data.datasets[0].data = data.map((entry) => entry.count);
      chartInstance.update();
    }
  };

  const fetchData = async () => {
    try {
      let url = 'http://localhost:4000/api/v1/conversations/conversationsByDate';

      if (selectedMonth && selectedYear) {
        url += `?month=${selectedMonth}&year=${selectedYear}`;
        console.log(url);
      }

      const response = await axios.get(url);
      console.log("RESPONSE.DATA",response.data)
      const completeDatesArray = getDaysInMonth(parseInt(selectedYear), parseInt(selectedMonth));
      const updatedData = completeDatesArray.map((date) => {
        const formattedDate = formatDate(date);
        const existingEntry = response.data.find((entry) => entry._id === formattedDate);
        return existingEntry || { _id: formattedDate, count: 0 };
      });
      console.log("UPDATED DATA",updatedData)
      setData(updatedData);
      console.log("DATA 1",data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    createChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateChart();
  }, [data]);

  const createChart = () => {
    const ctx = chartRef.current.getContext('2d');
  
    // Destroy existing chart instance if it exists
    if (window.conversationChartInstance) {
      window.conversationChartInstance.destroy();
    }
  
    window.conversationChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Number of Conversations',
          data: [],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };
  

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };
  

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  // Generate year options dynamically
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(5), (val, index) => currentYear - index);

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="month-label">Select Month</InputLabel>
            <Select
              labelId="month-label"
              id="month-select"
              value={selectedMonth}
              label="Select Month"
              onChange={handleMonthChange}
            >
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="year-label">Select Year</InputLabel>
            <Select
              labelId="year-label"
              id="year-select"
              value={selectedYear}
              label="Select Year"
              onChange={handleYearChange}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <canvas id="conversationChart" width="400" height="200" ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default ConversationsByDateBarPlot;