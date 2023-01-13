import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Space } from 'antd';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import ApplyDoctor from './pages/ApplyDoctor';
import './index.css'
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import  PublicRoute  from './components/PublicRoute';
import Notification from './pages/Notification';
import DoctorsList from './pages/admin/DoctorsList'
import UsersList from './pages/admin/UsersList';
import Profile from './pages/doctor/Profile';
import BookAppoinment from './pages/BookAppoinment';
import Appointments from './pages/Appointments';
import DoctorAppointments from './pages/doctor/DoctorAppointments';

function App() {
  const { loading } = useSelector((state) => state.alerts)
  return (
    <BrowserRouter>
      {loading && (
        <div className="spinner-parent">
          <div class="spinner-border" role="status">
          </div>
        </div>
      )}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Routes>
        <Route path='/Login' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/Register' element={<PublicRoute><Register /></PublicRoute>} />
        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/apply-doctor' element={<ProtectedRoute><ApplyDoctor /></ProtectedRoute>} />
        <Route path='/notification' element={<ProtectedRoute><Notification /></ProtectedRoute>} />
        <Route path='/doctors' element={<ProtectedRoute><DoctorsList /></ProtectedRoute>} />
        <Route path='/users' element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
        <Route path='/doctors/profile/:userId' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/booking-appointment/:doctorId' element={<ProtectedRoute><BookAppoinment /></ProtectedRoute>} />
        <Route path='/appointments' element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path='/doctor-appointments' element={<ProtectedRoute><DoctorAppointments/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
