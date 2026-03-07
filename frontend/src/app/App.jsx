import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../auth/Login";
import ProtectedRoute from "../auth/ProtectedRoute"

import AdminLayout from "../admin/layout/AdminLayout";
import StudentLayout from "../student/layout/StudentLayout";

import AdminDashboard from "../admin/pages/AdminDashboard";
import LeaveApprovals from "../admin/pages/LeaveApprovals";
import ManageComplaints from "../admin/pages/ManageComplaints";
import RebateApprovals from "../admin/pages/RebateApprovals";
import RegisterStudent from "../admin/pages/RegisterStudent";
import UpdateStudent from "../admin/pages/UpdateStudent";
import ManageRooms from "../admin/pages/ManageRooms";

import StudentDashboard from "../student/pages/StudentDashboard";
import ApplyLeave from "../student/pages/ApplyLeave";
import ApplyRebate from "../student/pages/ApplyRebate";
import Complaints from "../student/pages/Complaints";
import Profile from "../student/pages/Profile";

export default function App() {

  const user = JSON.parse(localStorage.getItem("user"))
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login/>}/>

      {/* Protected Routes */}
      <Route path="/admin/*"
        element={
          <ProtectedRoute user={user} role="ADMIN">
            <AdminLayout/>
          </ProtectedRoute>
        }
      >
          <Route path="" element={<AdminDashboard />} />
          <Route path="manage-rooms" element={<ManageRooms />} />
          <Route path="leave-approvals" element={<LeaveApprovals />} />
          <Route path="manage-complaints" element={<ManageComplaints />} />
          <Route path="rebate-approvals" element={<RebateApprovals />} />
          <Route path="register-student" element={<RegisterStudent />} />
          <Route path="update-student" element={<UpdateStudent />} />
      </Route>

      <Route path="/student/*"
        element={
          <ProtectedRoute user={user} role="STUDENT">
            <StudentLayout/>
          </ProtectedRoute>
        }
      >
        <Route path="" element={<StudentDashboard />} />
        <Route path="leave" element={<ApplyLeave/>} />
        <Route path="complaint" element={<Complaints/>} />
        <Route path="rebate" element={<ApplyRebate />} />
        <Route path="profile" element={<Profile />} />          
      </Route>

      {/* Default route */}
      <Route path="/"
        element={
          user ? (
            user.role==="ADMIN" ? (
              <Navigate to="/admin"/>
            ) : (
              <Navigate to="/student"/>
            )
          ) : (
            <Navigate to="/login"/>
          )
        }/>
    </Routes>
  );
}