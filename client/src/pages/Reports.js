import { React, useState, useEffect } from "react";
import axios from "axios";
import Report from "../components/Report";
import { useReportedNoContext } from "../context/ReportedNoContext";

const Reports = ({ reloadReportNotificationPage }) => {
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
        const reportsTemp = response.data;
        reportsTemp.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReports(reportsTemp);
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    getReports();
  }, [reloadReportNotificationPage]);

  const handleReportResolved = (resolvedReportId) => {
    setReports((prevReports) =>
      prevReports.filter((report) => report._id !== resolvedReportId)
    );
    decrement();
  };

  return (
    <div>
      <h1>Reports</h1>

      {reports.length !== 0 ? (
        <>
          {reports.map((report) => (
            <Report
              key={report._id}
              report={report}
              onReportResolved={handleReportResolved}
            />
          ))}
        </>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "10vh",
          }}
        >
          <p
            style={{
              fontStyle: "italic",
              color: "#808080",
              fontSize: "24px",
            }}
          >
            All reports resolved!
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;