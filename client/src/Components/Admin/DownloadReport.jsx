import React, { useState, useEffect } from "react";

async function DownloadReport() {

  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    empID: "",
  });
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    console.log("filters ", filters);
  };

  try {
    const query = new URLSearchParams({
      startDate: filters.startDate,
      endDate: filters.endDate,
      status: filters.status,
      empID: filters.empID,
    }).toString();

    const token = localStorage.getItem("token"); // Replace with your token storage method

    const response = await fetch(
      `http://localhost:4000/api/ticket/download-report?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tickets_report.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error("Failed to download report:", error);
  }

  return (
    <div className="h-full flex justify-center">
      <div className="h-full w-[100%] pt-2 text-center mx-auto">
        <div className="filters flex flex-col md:flex-row items-center justify-around bg-indigo-500 text-white p-2 rounded-lg shadow-lg mb-2">
          <input
            type="text"
            name="empID"
            placeholder="Filter by Employee ID"
            value={filters.empID}
            onChange={handleFilterChange}
            className="filter-input bg-white text-gray-800 rounded-lg px-4 py-2 mb-2 md:mb-0 md:mr-2 shadow-md"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-select bg-white text-gray-800 rounded-lg px-4 py-2 mb-2 md:mb-0 md:mr-2 shadow-md"
          >
            <option value="Open">Open</option>
            <option value="Processing">Processing</option>
            <option value="Closed">Closed</option>
          </select>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="filter-input bg-white text-gray-800 rounded-lg px-4 py-2 mb-2 md:mb-0 md:mr-2 shadow-md"
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="filter-input bg-white text-gray-800 rounded-lg px-4 py-2 mb-2 md:mb-0 shadow-md"
          />
          <button
            onClick={DownloadReport}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
          >
            Download Report
          </button>
        </div>
        {/* existing tickets display and modal code */}
      </div>
    </div>
  );
}

export default DownloadReport;
