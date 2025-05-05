import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Lottie from "lottie-react";
import loader from "../assets/lottie/loader.json";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-2xl shadow-xl border">
        <div className="flex flex-col items-center mb-6">
          {/* Logo */}
          <img
            src="/assets/dave_medlogo.png"
            alt="DavMed Logo"
            className="h-24 mb-2"
          />
          <h1 className="text-3xl font-bold text-black">DavMed</h1>
          <p className="text-gray-500 mt-2 text-sm text-center">
            Welcome back, Admin. Please log in to continue.
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-xl border focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 rounded-xl border focus:outline-none"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white font-medium py-3 rounded-xl hover:bg-gray-900 transition flex justify-center items-center"
        >
          {loading ? (
            <Lottie animationData={loader} className="h-6" />
          ) : (
            "Login"
          )}
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
