import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Search } from 'react-feather';
import axios from 'axios';

export default function ViewDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [summary, setSummary] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorLocations, setDoctorLocations] = useState({}); // Store locations by doctor

  const fetchDoctors = async () => {
    const snap = await getDocs(collection(db, 'doctors'));
    const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setDoctors(docs);

    const specSummary = {};
    docs.forEach(doc => {
      const spec = doc.speciality || 'Unknown';
      specSummary[spec] = (specSummary[spec] || 0) + 1;
    });
    setSummary(specSummary);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch location for each doctor based on their coordinates (GeoPoint)
  const fetchLocation = async (latitude, longitude, doctorId) => {
    try {
      const apiKey = 'AIzaSyACxdztmSJ6MP_l6tNr24KvrbBbgzZBQ1g'; // Replace with your actual Google API key
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      
      if (response.data.status === 'OK') {
        const results = response.data.results;
        if (results.length > 0) {
          const addressComponents = results[0].address_components;
          let locality = '';
          let country = '';

          for (let i = 0; i < addressComponents.length; i++) {
            const component = addressComponents[i];
            if (component.types.includes('locality')) {
              locality = component.long_name; // This is the city
            }
            if (component.types.includes('country')) {
              country = component.long_name; // This is the country
            }
          }

          // Update the state with the location for this doctor
          setDoctorLocations(prevLocations => ({
            ...prevLocations,
            [doctorId]: `${locality}, ${country}`,
          }));
        } else {
          setDoctorLocations(prevLocations => ({
            ...prevLocations,
            [doctorId]: 'Location not found',
          }));
        }
      } else {
        console.error('Geocoding API Error:', response.data.status);
        setDoctorLocations(prevLocations => ({
          ...prevLocations,
          [doctorId]: 'Location not available',
        }));
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setDoctorLocations(prevLocations => ({
        ...prevLocations,
        [doctorId]: 'Location not available',
      }));
    }
  };

  useEffect(() => {
    doctors.forEach(doctor => {
      if (doctor.location && doctor.location._lat && doctor.location._long) {
        console.log('Fetching location for coordinates:', doctor.location._lat, doctor.location._long);
        fetchLocation(doctor.location._lat, doctor.location._long, doctor.id);
      }
    });
  }, [doctors]);

  // Function to handle updating the doctor's profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const ref = doc(db, 'doctors', selectedDoctor.id);
      await updateDoc(ref, selectedDoctor);
      toast.success('Doctor updated successfully');
      setSelectedDoctor(null);
      fetchDoctors();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'doctors', selectedDoctor.id));
      toast.success('Doctor deleted');
      setSelectedDoctor(null);
      fetchDoctors();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const filteredDoctors = doctors.filter((doc) =>
    doc.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.speciality?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black mb-4">View Doctors</h1>

      {/* 🔄 Top Row: Summary (left) + Search (right) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* 📊 Speciality Summary */}
        <div className="text-sm text-gray-700">
          <h2 className="font-semibold mb-1">Total by Speciality:</h2>
          <ul>
            {Object.entries(summary).map(([key, val]) => (
              <li key={key}>{key}: {val}</li>
            ))}
          </ul>
        </div>

        {/* 🔍 Search Bar */}
        <div className="flex items-center border rounded px-3 py-2 w-full md:max-w-sm bg-white shadow-sm">
          <Search className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by name, email, or speciality"
            className="w-full outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc, index) => (
          <motion.div
            key={doc.id}
            className="bg-white shadow rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3 className="font-semibold text-lg">{doc.fullName}</h3>
            <p className="text-sm text-gray-600">Email: {doc.email}</p>
            <p className="text-sm text-gray-600">Phone: {doc.phone}</p>
            <p className="text-sm text-gray-600">Speciality: {doc.speciality}</p>
            <p className="text-sm text-gray-600">Location: {doctorLocations[doc.id] || 'Location not available'}</p>

            <button
              className="mt-3 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              onClick={() => setSelectedDoctor(doc)}
            >
              Edit
            </button>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Doctor</h2>
            <form onSubmit={handleUpdate} className="space-y-3">
              {['fullName', 'email', 'phone', 'speciality'].map(field => (
                <input
                  key={field}
                  type="text"
                  value={selectedDoctor[field] || ''}
                  onChange={e => setSelectedDoctor({ ...selectedDoctor, [field]: e.target.value })}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full p-2 border rounded"
                />
              ))}
              {/* Non-editable Location */}
              <div className="flex justify-between pt-4">
                <button type="button" className="bg-gray-300 text-black px-4 py-2 rounded" disabled>
                  {doctorLocations[selectedDoctor.id] || 'Location not available'}
                </button>
                <button type="submit" className="bg-black text-white px-4 py-2 rounded">Save</button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </form>
            <button
              onClick={() => setSelectedDoctor(null)}
              className="mt-4 text-sm text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
