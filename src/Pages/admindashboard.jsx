import { motion } from "framer-motion";
import { Users, UserCheck, FileText } from "react-feather";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // ✅ For navigation

export default function AdminDashboard() {
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [topDoctor, setTopDoctor] = useState(""); // Top Doctor
  const [topCustomer, setTopCustomer] = useState(""); // Top Customer
  const [topDoctorAppointments, setTopDoctorAppointments] = useState(0); // Top Doctor's appointments
  const [topCustomerAppointments, setTopCustomerAppointments] = useState(0); // Top Customer's appointments
  const navigate = useNavigate(); // ✅ For navigation

  useEffect(() => {
    const fetchData = async () => {
      const doctorSnapshot = await getDocs(collection(db, "doctors"));
      const patientSnapshot = await getDocs(collection(db, "customers"));
      const appointmentsSnapshot = await getDocs(collection(db, "appointments"));

      setTotalDoctors(doctorSnapshot.size);
      setTotalPatients(patientSnapshot.size);

      const doctorCount = {};
      const customerCount = {};

      // Count the appointments for each doctor and customer
      appointmentsSnapshot.forEach((appt) => {
        const { doctorId, customerId } = appt.data();
        doctorCount[doctorId] = (doctorCount[doctorId] || 0) + 1;
        customerCount[customerId] = (customerCount[customerId] || 0) + 1;
      });

      // Find the doctor with the most appointments
      const topDoctorId = Object.keys(doctorCount).reduce((a, b) =>
        doctorCount[a] > doctorCount[b] ? a : b
      );

      // Fetch the top doctor by doctorId
      const doctorDoc = await getDoc(doc(db, "doctors", topDoctorId));
      const topDoctorName = doctorDoc.exists() ? doctorDoc.data().fullName : "Unknown Doctor";
      const topDoctorAppointments = doctorCount[topDoctorId] || 0;

      setTopDoctor(`${topDoctorName}: ${topDoctorAppointments} Appointments`);
      setTopDoctorAppointments(topDoctorAppointments);

      // Find the customer with the most appointments
      const topCustomerId = Object.keys(customerCount).reduce((a, b) =>
        customerCount[a] > customerCount[b] ? a : b
      );

      // Fetch the top customer by customerId
      const customerDoc = await getDoc(doc(db, "customers", topCustomerId));
      const topCustomerName = customerDoc.exists() ? customerDoc.data().fullName : "Unknown Customer";
      const topCustomerAppointments = customerCount[topCustomerId] || 0;

      setTopCustomer(`${topCustomerName}: ${topCustomerAppointments} Appointments`);
      setTopCustomerAppointments(topCustomerAppointments);
    };

    fetchData();
  }, []);

  const stats = [
    {
      icon: <Users className="w-10 h-10 mb-3 text-black" />,
      title: "Total Patients",
      value: `${totalPatients} registered users`,
    },
    {
      icon: <UserCheck className="w-10 h-10 mb-3 text-black" />,
      title: "Doctors",
      value: `${totalDoctors} doctors available`,
    },
    {
      icon: <FileText className="w-10 h-10 mb-3 text-black" />,
      title: "Top Doctor",
      value: topDoctor || "Loading...",
    },
    {
      icon: <FileText className="w-10 h-10 mb-3 text-black" />,
      title: "Top Customer",
      value: topCustomer || "Loading...",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-center text-black mb-10">
        Welcome Mr. Elton....
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <div className="rounded-2xl shadow p-6 flex flex-col items-center bg-gray-100 hover:shadow-lg transition-all">
              {stat.icon}
              <h2 className="text-lg font-semibold text-black">{stat.title}</h2>
              <p className="text-gray-700 text-sm text-center">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => navigate("/add-doctor")} // ✅ Navigate to add doctor
          className="bg-black text-white py-3 px-6 rounded-xl shadow hover:bg-gray-900 transition-all"
        >
          Add New Doctor
        </button>
      </div>
    </div>
  );
}
