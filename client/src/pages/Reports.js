import { React, useState, useEffect } from "react";
import axios from "axios";
import Report from "../components/Report";
import { format } from "timeago.js";
import { useReportedNoContext } from "../context/ReportedNoContext";

const Reports = () => {
  const [reports, setReports] = useState([]);

  const { reportedNo, setReportedNoValue, decrement } = useReportedNoContext();

  useEffect(() => {
    const getReports = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/reports/getReports`,
          {
            withCredentials: true,
          }
        );
        console.log(response);
        setReports(response.data);
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    getReports();
  }, []);

  const handleReportResolved = (resolvedReportId) => {
    setReports((prevReports) =>
      prevReports.filter((report) => report._id !== resolvedReportId)
    );
    decrement();
  };

  return (
    <div>
      <h1>Reports</h1>
      {reports.map((report) => (
        <Report
          key={report._id}
          report={report}
          onReportResolved={handleReportResolved}
        />
      ))}
    </div>
  );
};

export default Reports;
