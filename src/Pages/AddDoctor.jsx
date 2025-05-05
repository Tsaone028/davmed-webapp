import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import Lottie from "lottie-react";
import loader from "../assets/lottie/loader.json";
import { toast } from "react-toastify";
import { GeoPoint } from "firebase/firestore"; // Import GeoPoint for Firebase

const AddDoctor = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "Male",
    speciality: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    const { fullName, email, phone, gender, speciality } = form;

    if (!fullName || !email || !phone || !speciality) {
      toast.warn("Please fill in all fields");
      return;
    }

    setLoading(true);
    const defaultPassword = "doctor1234";
    const defaultLocation = new GeoPoint(-21.22973464677921, 27.49268542536097); // Default GeoPoint location

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        defaultPassword
      );

      const uid = userCredential.user.uid;

      await setDoc(doc(db, "doctors", uid), {
        fullName,
        email,
        phone,
        gender,
        speciality,
        location: defaultLocation, // Store GeoPoint in Firestore
        uid,
        createdAt: new Date()
      });

      toast.success("Doctor added successfully");

      // Clear form
      setForm({
        fullName: "",
        email: "",
        phone: "",
        gender: "Male",
        speciality: ""
      });
    } catch (error) {
      toast.error(error.message || "Failed to add doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-black text-center">Add New Doctor</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          className="p-3 border rounded-lg"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="p-3 border rounded-lg"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="p-3 border rounded-lg"
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="p-3 border rounded-lg"
        >
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input
          type="text"
          name="speciality"
          placeholder="Speciality"
          value={form.speciality}
          onChange={handleChange}
          className="p-3 border rounded-lg"
        />
        {/* No need for location input field anymore */}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white py-3 px-8 rounded-lg shadow hover:bg-gray-900 transition"
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <Lottie animationData={loader} loop className="w-8 h-8" />
            </div>
          ) : (
            "Create Doctor"
          )}
        </button>
      </div>
    </div>
  );
};

export default AddDoctor;
