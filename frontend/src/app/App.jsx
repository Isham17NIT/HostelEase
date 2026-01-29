import { Routes, Route } from "react-router-dom";
// import Login from "../auth/Login";
// import ProtectedRoute from "../auth/ProtectedRoute"
// import RootRedirect from "./RootRedirect"

import AdminLayout from "../admin/layout/AdminLayout";
import StudentLayout from "../student/layout/StudentLayout";

import AdminDashboard from "../admin/pages/AdminDashboard";
import LeaveApprovals from "../admin/pages/LeaveApprovals";
import ManageComplaints from "../admin/pages/ManageComplaints";
import RebateApprovals from "../admin/pages/RebateApprovals";
import RegisterStudent from "../admin/pages/RegisterStudent";
import UpdateStudent from "../admin/pages/UpdateStudent";
import ManageRooms from "../admin/pages/ManageRooms";

import Dashboard from "../student/pages/Dashboard";
import ApplyLeave from "../student/pages/ApplyLeave";
import ApplyRebate from "../student/pages/ApplyRebate";
import Complaints from "../student/pages/Complaints";
import Profile from "../student/pages/Profile";

export default function App() {
  return (
    // student testing
    // <Routes>
    //   <Route
    //       path="/student"
    //       element={
    //           <StudentLayout />
    //       }>
    //     <Route index element={<Dashboard />} />
    //     <Route path="leave" element={<ApplyLeave />} />
    //     <Route path="rebate" element={<ApplyRebate />} />
    //     <Route path="complaints" element={<Complaints />} />
    //     <Route path="profile" element={<Profile />} />
    //   </Route>
    // </Routes>

    // admin testing
    <Routes>
      <Route
          path="/admin"
          element={
              <AdminLayout />
          }>
        <Route index element={<AdminDashboard />} />
        <Route path="leave" element={<LeaveApprovals />} />
        <Route path="rebate" element={<RebateApprovals />} />
        <Route path="complaints" element={<ManageComplaints />} />
        <Route path="register_student" element={<RegisterStudent />} />
        <Route path="update_student" element={<UpdateStudent />} />
        <Route path="rooms" element={<ManageRooms />} />
      </Route>
    </Routes>
      // <Routes>
      //   <Route path="/" element={<RootRedirect/>}/>

      //   <Route path="/login" element={<Login />} />

      //   {/* STUDENT */}
      //   <Route
      //     path="/student"
      //     element={
      //       <ProtectedRoute role="student">
              // <StudentLayout />
      //       </ProtectedRoute>
      //     }
      //   >
            // <Route index element={<Dashboard />} />
            // <Route path="leave" element={<ApplyLeave />} />
            // <Route path="rebate" element={<ApplyRebate />} />
            // <Route path="complaints" element={<Complaints />} />
            // <Route path="profile" element={<Profile />} />
          
      //   </Route>

      //   {/* ADMIN */}
      //   <Route
      //     path="/admin"
      //     element={
      //       <ProtectedRoute role="admin">
      //         <AdminLayout />
      //       </ProtectedRoute>
      //     }
      //   >
          // <Route index element={<AdminDashboard />} />
          // <Route path="leave" element={<LeaveApprovals />} />
          // <Route path="rebate" element={<RebateApprovals />} />
          // <Route path="complaints" element={<ManageComplaints />} />
          // <Route path="register_student" element={<RegisterStudent />} />
          // <Route path="update_student" element={<UpdateStudent />} />
          // <Route path="rooms" element={<ManageRooms />} />

      //   </Route>
      // </Routes>
  );
}