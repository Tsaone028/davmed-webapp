import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2'; // Importing Bar chart from react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'; // Importing required Chart.js components

// Register the chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Reports() {
  const [appointments, setAppointments] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [doctorNames, setDoctorNames] = useState({});
  const [customerNames, setCustomerNames] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'appointments'));
      const data = snapshot.docs.map(doc => doc.data());
      setAppointments(data);

      // Count by doctorId and customerId
      const doctorCount = {};
      const customerCount = {};

      data.forEach(appt => {
        doctorCount[appt.doctorId] = (doctorCount[appt.doctorId] || 0) + 1;
        customerCount[appt.customerId] = (customerCount[appt.customerId] || 0) + 1;
      });

      // Get doctor names
      const doctorNamesTemp = {};
      for (const doctorId of Object.keys(doctorCount)) {
        const doctorDoc = await getDoc(doc(db, 'doctors', doctorId));
        if (doctorDoc.exists()) {
          doctorNamesTemp[doctorId] = doctorDoc.data().fullName;
        }
      }

      // Get customer names
      const customerNamesTemp = {};
      for (const customerId of Object.keys(customerCount)) {
        const customerDoc = await getDoc(doc(db, 'customers', customerId));
        if (customerDoc.exists()) {
          customerNamesTemp[customerId] = customerDoc.data().fullName;
        }
      }

      // Sort doctors and customers by their count
      const sortedDoctors = Object.entries(doctorCount)
        .sort((a, b) => b[1] - a[1])
        .map(([id, count]) => ({ id, count }));
      const sortedCustomers = Object.entries(customerCount)
        .sort((a, b) => b[1] - a[1])
        .map(([id, count]) => ({ id, count }));

      setTopDoctors(sortedDoctors);
      setTopCustomers(sortedCustomers);
      setDoctorNames(doctorNamesTemp);
      setCustomerNames(customerNamesTemp);
    };

    fetchData();
  }, []);

  // Chart Data for Doctors
  const doctorChartData = {
    labels: topDoctors.map(doc => doctorNames[doc.id] || 'Unknown Doctor'),
    datasets: [
      {
        label: 'Appointments',
        data: topDoctors.map(doc => doc.count),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 1
      }
    ]
  };

  // Chart Data for Customers
  const customerChartData = {
    labels: topCustomers.map(cust => customerNames[cust.id] || 'Unknown Customer'),
    datasets: [
      {
        label: 'Appointments',
        data: topCustomers.map(cust => cust.count),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Reports & Insights</h1>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow p-4 rounded-xl mb-6"
      >
        <h2 className="text-lg font-semibold text-black mb-2">Top Performing Doctors</h2>
        <Bar data={doctorChartData} options={{ responsive: true }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow p-4 rounded-xl"
      >
        <h2 className="text-lg font-semibold text-black mb-2">Most Active Customers</h2>
        <Bar data={customerChartData} options={{ responsive: true }} />
      </motion.div>
    </div>
  );
}
