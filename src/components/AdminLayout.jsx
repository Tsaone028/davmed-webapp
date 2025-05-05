// src/components/AdminLayout.jsx
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-[#f9f9f9]">
        <TopBar />
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
