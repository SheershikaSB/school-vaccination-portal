import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";

// Inline styling
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to top right, #d0eaf5, #3a99d8)",
    padding: "2rem",
    position: "relative",
  },
  logoutButton: {
    position: "absolute",
    top: "20px",
    right: "20px",
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s ease",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    fontSize: "18px",
  },
  statCard: {
    backgroundColor: "#ecf9ff",
    color: "#3498db",
    fontSize: "24px",
    fontWeight: "bold",
  },
  percentageCard: {
    backgroundColor: "#f1f7c2",
    color: "#f39c12",
    fontSize: "24px",
    fontWeight: "bold",
  },
  drivesDeck: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },
  driveCard: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  button: {
    backgroundColor: "#3498db",
    color: "#ffffff",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "30px",
  },
};

const Dashboard = () => {
  const { authToken, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authToken) {
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/dashboard/overview", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setDashboardData(response.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      }
    };

    fetchDashboardData();
  }, [authToken]);

  if (!authToken) {
    return <Navigate to="/" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-50 to-gray-200">
        <div className="p-8 bg-white rounded-lg shadow-xl text-center">
          <h2 className="text-3xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={logout}
            className="px-6 py-3 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-50 to-gray-200">
        <div className="p-8 bg-white rounded-lg shadow-xl text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Loading...</h2>
          <p className="text-gray-600">Fetching your dashboard data, please wait...</p>
        </div>
      </div>
    );
  }

  const { totalStudents, vaccinatedStudents, vaccinationPercentage, upcomingDrives } = dashboardData;

  return (
    <div style={styles.container}>
      <button style={styles.logoutButton} onClick={logout}>Logout</button>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-t-3xl">
          <h2 className="text-4xl font-bold text-center mb-4">Dashboard Overview</h2>
          <div className="flex flex-wrap justify-between gap-4">
            <Link to="/manage-students" className="flex-1">
              <button className="w-full py-3 bg-blue-700 rounded-lg shadow-lg text-white font-semibold hover:bg-blue-800 transition-all">
                Manage Students
              </button>
            </Link>
            <Link to="/vaccination-drives" className="flex-1">
              <button className="w-full py-3 bg-green-600 rounded-lg shadow-lg text-white font-semibold hover:bg-green-700 transition-all">
                Vaccination Drives
              </button>
            </Link>
            <Link to="/reports" className="flex-1">
              <button className="w-full py-3 bg-yellow-500 rounded-lg shadow-lg text-white font-semibold hover:bg-yellow-600 transition-all">
                Reports
              </button>
            </Link>
          </div>
        </div>

        <div className="p-8 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl shadow-md">
              <p className="text-lg font-semibold">Total Students</p>
              <p className="text-3xl font-bold text-blue-700">{totalStudents}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl shadow-md">
              <p className="text-lg font-semibold">Vaccinated Students</p>
              <p className="text-3xl font-bold text-green-700">{vaccinatedStudents}</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-xl shadow-md">
              <p className="text-lg font-semibold">Vaccination Percentage</p>
              <p className="text-3xl font-bold text-yellow-700">{vaccinationPercentage}%</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Upcoming Vaccination Drives</h3>
          {upcomingDrives.length > 0 ? (
            <ul className="space-y-4">
              {upcomingDrives.map((drive) => (
                <li key={drive.id} className="p-4 bg-blue-50 rounded-lg shadow-md">
                  <strong>{drive.drive_name}</strong> - {drive.drive_date}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No vaccination drives scheduled in the next 30 days.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


