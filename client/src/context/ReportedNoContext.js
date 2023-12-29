import { createContext, useContext, useState } from "react";

const ReportedNo = createContext();

export const ReportedNoProvider = ({ children }) => {
  const [reportedNo, setReportedNo] = useState(0);

  const increment = () => {
    // Perform login logic, set user data, etc.
    setReportedNo((prevReportedNo) => prevReportedNo + 1);
  };

  const decrement = () => {
    // Perform logout logic, clear user data, etc.
    if (reportedNo > 0) {
      setReportedNo((prevReportedNo) => prevReportedNo - 1);
    }
  };

  const setReportedNoValue = (value) => {
    setReportedNo(value);
  };

  return (
    <ReportedNo.Provider
      value={{
        reportedNo,
        increment,
        decrement,
        setReportedNoValue,
      }}
    >
      {children}
    </ReportedNo.Provider>
  );
};

export const useReportedNoContext = () => {
  return useContext(ReportedNo);
};