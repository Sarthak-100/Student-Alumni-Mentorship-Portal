import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ChartComponent = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/v1/users/getBatchwiseCounts")
      .then((response) => {
        const { alumniCounts, studentCounts } = response.data;

        // Ensure the API data is correctly structured
        console.log("API data:", alumniCounts, studentCounts);

        // Transform alumniCounts and studentCounts data into a format suitable for the chart
        const transformedData = [
          {
            name: "Alumni",
            data: sortDataByYear(alumniCounts),
          },
          {
            name: "Students",
            data: sortDataByYear(studentCounts),
          },
        ];

        // Ensure the transformed data is correctly structured
        console.log("Transformed data:", transformedData);

        setChartData(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching chart data:", error);
      });
  }, []);

  // Function to sort data by year
  const sortDataByYear = (data) => {
    return data
      .slice()
      .sort((a, b) => a._id - b._id)
      .map((item) => ({ year: item._id, count: item.count }));
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2>Alumni Statistics</h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData[0]?.data || []}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }} // Increased bottom margin for X-axis labels
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2>Student Statistics</h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData[1]?.data || []}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }} // Increased bottom margin for X-axis labels
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;