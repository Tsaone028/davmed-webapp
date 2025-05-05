import { Link } from 'react-router-dom';
import { Home, UserPlus, Users, FileText } from 'react-feather';
import { motion } from 'framer-motion';
import avatar from '../assets/admin_avatar.jpg'; // Make sure this image exists or replace it

const Sidebar = () => {
  return (
    <div className="bg-[#111827] text-white w-64 min-h-screen p-4 flex flex-col justify-between rounded-r-2xl shadow-xl">
      <div>
        {/* Branding */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="bg-gradient-to-br from-pink-500 to-orange-500 text-white font-bold text-xl px-3 py-1 rounded-md">
            DV
          </div>
          <span className="text-lg font-semibold">DavMed</span>
        </div>

        {/* Admin Info */}
        <div className="bg-gray-800 p-3 rounded-xl mb-6 flex items-center space-x-3">
          <img src={avatar} alt="Admin Avatar" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="font-medium">Mr. Elton</p>
            <p className="text-sm text-gray-400">Admin</p>
          </div>
        </div>

        {/* Nav Sections */}
        <div>
          <p className="text-gray-400 uppercase text-xs mb-3 tracking-wide">Navigation</p>
          <ul className="space-y-2">
            <motion.li whileHover={{ scale: 1.05 }}>
              <Link to="/dashboard" className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg">
                <Home size={18} />
                <span>Dashboard</span>
              </Link>
            </motion.li>

            <motion.li whileHover={{ scale: 1.05 }}>
              <Link to="/add-doctor" className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg">
                <UserPlus size={18} />
                <span>Add Doctor</span>
              </Link>
            </motion.li>

            <motion.li whileHover={{ scale: 1.05 }}>
              <Link to="/view-doctors" className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg">
                <Users size={18} />
                <span>View Doctors</span>
              </Link>
            </motion.li>

            <motion.li whileHover={{ scale: 1.05 }}>
              <Link to="/reports" className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg">
                <FileText size={18} />
                <span>Reports</span>
              </Link>
            </motion.li>
          </ul>
        </div>
      </div>

      <p className="text-gray-600 text-xs text-center mt-6">DavMed Admin Panel © 2025</p>
    </div>
  );
};

export default Sidebar;
