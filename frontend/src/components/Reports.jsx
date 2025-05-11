import React, { useEffect, useState } from "react";
import axios from "axios";

// Inline styling for simplicity
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 20px",
    backgroundColor: "#f4f6f9",
  },
  header: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
    color: "#2c3e50",
  },
  input: {
    padding: "12px 20px",
    margin: "20px 0",
    width: "100%",
    maxWidth: "350px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  recordsList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
  },
  record: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr 1fr",  // Creates a table-like grid
    alignItems: "center",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
  },
  recordHover: {
    transform: "scale(1.02)",
    boxShadow: "0 6px 10px rgba(0, 0, 0, 0.15)",
  },
  recordTitle: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#34495e",
  },
  recordDetails: {
    fontSize: "1rem",
    color: "#7f8c8d",
  },
  recordFooter: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    padding: "8px 16px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s",
  },
  actionButtonHover: {
    backgroundColor: "#2980b9",
  },
  pagination: {
    textAlign: "center",
    marginTop: "30px",
  },
  loading: {
    textAlign: "center",
    fontSize: "1.5rem",
    color: "#e74c3c",
  },
  noRecords: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#95a5a6",
  },
  // Adding some spacing between columns and rows to give a cleaner look
  columnHeader: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#34495e",
    padding: "10px 0",
    borderBottom: "2px solid #ecf0f1",
  },
  columnData: {
    padding: "10px 0",
    borderBottom: "1px solid #ecf0f1",
  }
};

const Reports = () => {
  const [records, setRecords] = useState([]);
  const [vaccineFilter, setVaccineFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [vaccineFilter, currentPage]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/reports", {
        params: {
          vaccine_name: vaccineFilter,
          page: currentPage,
          limit: 10,
        },
      });
      setRecords(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
      alert("Error fetching records.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reports/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "vaccination_report.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
      alert("Error exporting records.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Vaccination Reports</h1>

      {/* Filter Input */}
      <input
        type="text"
        placeholder="Filter by vaccine name"
        value={vaccineFilter}
        onChange={(e) => setVaccineFilter(e.target.value)}
        style={styles.input}
      />

      {/* Records Grid */}
      <div style={styles.recordsList}>
        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : records.length === 0 ? (
          <div style={styles.noRecords}>No records found</div>
        ) : (
          <>
            {/* Column headers */}
            <div style={styles.record}>
              <div style={styles.columnHeader}>Student ID</div>
              <div style={styles.columnHeader}>Name</div>
              <div style={styles.columnHeader}>Class</div>
              <div style={styles.columnHeader}>Vaccine Name</div>
              <div style={styles.columnHeader}>Vaccination Date</div>
              <div style={styles.columnHeader}>Vaccinated</div>
            </div>

            {/* Records */}
            {records.map((record, index) => (
              <div
                key={record.student_id}
                style={styles.record}
                onMouseEnter={(e) => e.target.style.transform = styles.recordHover.transform}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              >
                <div style={styles.columnData}>{record.student_id}</div>
                <div style={styles.columnData}>{record.student_name}</div>
                <div style={styles.columnData}>{record.student_class}</div>
                <div style={styles.columnData}>{record.vaccine_name || "N/A"}</div>
                <div style={styles.columnData}>{record.vaccination_date || "N/A"}</div>
                <div style={styles.columnData}>{record.vaccinated ? "Yes" : "No"}</div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          style={styles.actionButton}
        >
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          style={styles.actionButton}
        >
          Next
        </button>
      </div>

      {/* Export Button */}
      <div style={styles.pagination}>
        <button onClick={handleExport} style={styles.actionButton}>Download CSV</button>
      </div>
    </div>
  );
};

export default Reports;
