import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login'; 
import Dashboard from './components/Dashboard';
import ManageStudents from './components/StudentManagement';
import VaccinationDrives from './components/DriveManagement';
import Reports from "./components/Reports";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manage-students" element={<ManageStudents />} />
        <Route path="/vaccination-drives" element={<VaccinationDrives />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
  );
}

export default App;
