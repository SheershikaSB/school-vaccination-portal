// src/components/StudentManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

// Inline styling
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to top right, #d0eaf5, #3a99d8)",
    padding: "2rem",
    position: "relative",
  },
  title: {
    fontSize: "2.5rem",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: "1rem",  // Reduced margin to avoid too much spacing
  },
  searchBarContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "2rem", // Added space between title and search bar
  },
  searchBar: {
    width: "250px",
    padding: "10px 15px",
    borderRadius: "25px",
    border: "1px solid #ddd",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#3498db",
    color: "#ffffff",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#2980b9",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  th: {
    backgroundColor: "#3498db",
    color: "#ffffff",
    padding: "10px",
    borderBottom: "2px solid #ddd",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    textAlign: "center",
  },
  fileInput: {
    marginBottom: "15px",
  },
  formContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  formSection: {
    width: "48%",
    marginBottom: "20px",
  },
};

const StudentManagement = () => {
  const { authToken } = useAuth();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", grade: "", dob: "", vaccinated: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [bulkFile, setBulkFile] = useState(null);
  const [message, setMessage] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBulkUploadForm, setShowBulkUploadForm] = useState(false);

  // Fetch students on load
  useEffect(() => {
    fetchStudents();
  }, [searchTerm]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/students?search=${searchTerm}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!bulkFile) return;

    const formData = new FormData();
    formData.append("file", bulkFile);

    try {
      await axios.post("http://localhost:5000/api/students/bulk-upload", formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Bulk upload successful!");
      setBulkFile(null);
      fetchStudents();
      setShowBulkUploadForm(false);
    } catch (error) {
      console.error("Failed to bulk upload students", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = form.id ? `http://localhost:5000/api/students/${form.id}` : "http://localhost:5000/api/students";
      const method = form.id ? "put" : "post";

      await axios[method](url, form, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setMessage(form.id ? "Student updated successfully!" : "Student added successfully!");
      fetchStudents();
      setForm({ id: null, name: "", grade: "", dob: "", vaccinated: false, vaccine_name: "", drive_name: "" });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to add/update student", error);
    }
  };

  const handleEditClick = (student) => {
    setForm(student);
    setShowCreateForm(true);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Student Management</h1>

      {/* Search Bar */}
      <div style={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Search by name, grade, or vaccination status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchBar}
        />
      </div>

      {/* Students List */}
      <div style={styles.card}>
        <h2>Students List</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Grade</th>
              <th style={styles.th}>DOB</th>
              <th style={styles.th}>Vaccination Status</th>
              <th style={styles.th}>Actions</th>
              {/* <th style={styles.th}>Drive</th> */}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td style={styles.td}>{student.id}</td>
                <td style={styles.td}>{student.name}</td>
                <td style={styles.td}>{student.grade}</td>
                <td style={styles.td}>{student.dob}</td>
                <td style={styles.td}>{student.vaccination_status}</td>
                <td style={styles.td}>{student.drive_name}</td>
                <td style={styles.td}>
                  <button style={styles.button} onClick={() => handleEditClick(student)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / Add Student Button */}
      {!showCreateForm && (
        <button
          style={styles.button}
          onClick={() => setShowCreateForm(true)}
        >
          Add Student
        </button>
      )}

      {/* Bulk Upload Button */}
      {!showBulkUploadForm && (
        <button
          style={styles.button}
          onClick={() => setShowBulkUploadForm(true)}
        >
          Bulk Upload Students
        </button>
      )}

      {/* Create / Edit Student Form */}
      {showCreateForm && (
        <div style={styles.formContainer}>
          <div style={styles.formSection}>
            <h2>Add / Edit Student</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Grade"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                style={styles.input}
              />
              <input
                type="date"
                placeholder="Date of Birth"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Vaccine Name"
                value={form.vaccine_name}
                onChange={(e) => setForm({ ...form, vaccine_name: e.target.value })}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Drive Name"
                value={form.drive_name}
                onChange={(e) => setForm({ ...form, drive_name: e.target.value })}
                style={styles.input}
              />
              <label>
                <input
                  type="checkbox"
                  checked={form.vaccinated}
                  onChange={() => setForm({ ...form, vaccinated: !form.vaccinated })}
                />
                Vaccinated
              </label>
              <button type="submit" style={styles.button}>
                Save Student
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Form */}
      {showBulkUploadForm && (
        <div style={styles.formContainer}>
          <div style={styles.formSection}>
            <h2>Bulk Upload Students</h2>
            <form onSubmit={handleFileUpload}>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setBulkFile(e.target.files[0])}
                style={styles.fileInput}
              />
              <button type="submit" style={styles.button}>
                Upload CSV
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Message */}
      {message && <div style={{ ...styles.card, backgroundColor: "#dff0d8", color: "#3c763d" }}>{message}</div>}
    </div>
  );
};

export default StudentManagement;