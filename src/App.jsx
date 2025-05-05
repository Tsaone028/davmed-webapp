import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminDashboard from "./Pages/admindashboard";
import AdminLogin from "./Pages/AdminLogin";
import AddDoctor from "./Pages/AddDoctor";
import ViewDoctors from "./Pages/ViewDoctors";
import Reports from "./Pages/Reports";
import AdminLayout from "./components/AdminLayout"; // 👈 Layout wrapper

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route
          path="/dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/add-doctor"
          element={
            <AdminLayout>
              <AddDoctor />
            </AdminLayout>
          }
        />
        <Route
          path="/view-doctors"
          element={
            <AdminLayout>
              <ViewDoctors />
            </AdminLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <AdminLayout>
              <Reports />
            </AdminLayout>
          }
        />
      </Routes>

      {/* ✅ Toast container should be outside Routes so it's global */}
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;
