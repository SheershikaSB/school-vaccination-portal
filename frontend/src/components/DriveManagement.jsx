import React, { useState, useEffect } from "react";
import axios from "axios";

// Inline styling for simplicity. You can move this to an external CSS or use styled-components
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  header: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: "20px",
    textAlign: "center",
    color: "#2c3e50",
  },
  section: {
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#ecf0f1",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    fontSize: "1rem",
  },
  buttonHover: {
    backgroundColor: "#2980b9",
  },
  input: {
    padding: "10px",
    margin: "10px 0",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "1rem",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    width: "30%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  cardHover: {
    transform: "scale(1.05)",
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
  },
  cardHeader: {
    fontSize: "1.5rem",
    color: "#34495e",
    marginBottom: "10px",
  },
  cardDetail: {
    fontSize: "1rem",
    color: "#7f8c8d",
    marginBottom: "10px",
  },
  cardButton: {
    padding: "8px 16px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  cardButtonHover: {
    backgroundColor: "#2980b9",
  },
};

const DriveManagement = () => {
  const [drives, setDrives] = useState([]);
  const [editingDrive, setEditingDrive] = useState(null);
  const [formData, setFormData] = useState({
    drive_name: "",
    vaccine_name: "",
    drive_date: "",
    available_doses: "",
    applicable_grades: "",
  });
  const [showForm, setShowForm] = useState(false);

  // Fetch all drives
  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/drives");
        setDrives(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDrives();
  }, []);

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Create a new drive
  const handleCreateDrive = async () => {
    try {
      await axios.post("http://localhost:5000/api/drives", formData);
      alert("Drive created successfully!");
      setShowForm(false); // Hide form after creation
      window.location.reload(); // Refresh to show new drive
    } catch (err) {
      console.error(err);
      alert("Error creating drive.");
    }
  };

  // Edit an existing drive
  const handleEditDrive = async () => {
    try {
      await axios.put(`http://localhost:5000/api/drives/${editingDrive}`, formData);
      alert("Drive updated successfully!");
      setEditingDrive(null);
      setFormData({
        drive_name: "",
        vaccine_name: "",
        drive_date: "",
        available_doses: "",
        applicable_grades: "",
      }); // Clear form data after editing
      setShowForm(false); // Hide form after editing
      window.location.reload(); // Refresh to show updated drive
    } catch (err) {
      console.error(err);
      alert("Error updating drive.");
    }
  };

  // Load drive details into the form for editing
  const loadDriveForEditing = (id) => {
    // Find the drive from the drives list by its id
    const drive = drives.find((drive) => drive.id === id);
    if (drive) {
      setFormData({
        drive_name: drive.drive_name,
        vaccine_name: drive.vaccine_name,
        drive_date: drive.drive_date,
        available_doses: drive.available_doses,
        applicable_grades: drive.applicable_grades,
      });
      setEditingDrive(id);  // Set the drive as being edited
      setShowForm(true); // Show form for editing
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Vaccination Drive Management</h1>

      {/* List of Drives - Cards */}
      <div style={styles.section}>
        <h2>Existing Drives</h2>
        <div style={styles.cardContainer}>
          {drives.map((drive) => (
            <div
              key={drive.id}
              style={styles.card}
              onMouseEnter={(e) => e.target.style.transform = styles.cardHover.transform}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              <div style={styles.cardHeader}>{drive.drive_name}</div>
              <div style={styles.cardDetail}>Vaccine: {drive.vaccine_name}</div>
              <div style={styles.cardDetail}>Date: {drive.drive_date}</div>
              <div style={styles.cardDetail}>Applicable Grades: {drive.applicable_grades}</div>
              <button
                onClick={() => loadDriveForEditing(drive.id)}
                style={styles.cardButton}
                onMouseOver={(e) => e.target.style.backgroundColor = styles.cardButtonHover.backgroundColor}
                onMouseOut={(e) => e.target.style.backgroundColor = styles.cardButton.backgroundColor}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Show form only when Create or Edit is clicked */}
      {showForm && (
        <div style={styles.section}>
          <h2>{editingDrive ? "Edit Drive" : "Create New Drive"}</h2>
          <input
            type="text"
            name="drive_name"
            placeholder="Drive Name"
            value={formData.drive_name || ""}
            onChange={handleFormChange}
            style={styles.input}
          />
          <input
            type="text"
            name="vaccine_name"
            placeholder="Vaccine Name"
            value={formData.vaccine_name || ""}
            onChange={handleFormChange}
            style={styles.input}
          />
          <input
            type="date"
            name="drive_date"
            value={formData.drive_date || ""}
            onChange={handleFormChange}
            style={styles.input}
          />
          <input
            type="number"
            name="available_doses"
            placeholder="Available Doses"
            value={formData.available_doses || ""}
            onChange={handleFormChange}
            style={styles.input}
          />
          <input
            type="text"
            name="applicable_grades"
            placeholder="Applicable Grades"
            value={formData.applicable_grades || ""}
            onChange={handleFormChange}
            style={styles.input}
          />
          <button
            onClick={editingDrive ? handleEditDrive : handleCreateDrive}
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          >
            {editingDrive ? "Update Drive" : "Create Drive"}
          </button>
        </div>
      )}

      {/* Button to create a new drive */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)} // Show the form
          style={styles.button}
        >
          Create New Drive
        </button>
      )}
    </div>
  );
};

export default DriveManagement;
