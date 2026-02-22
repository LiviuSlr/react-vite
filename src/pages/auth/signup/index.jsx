import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [lab, setLab] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signup({
        email,
        password,
        name: `${firstName} ${lastName}`.trim(),
        role,
        organization,
        lab,
        phone,
      });

      // Option A: redirect to login page
      navigate("/account");

      // Option B (better UX): auto-login and go to account
      // navigate("/account");

    } catch (err) {
      setError(err?.message || "Signup failed");
    }
  };

  return (
    <main className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-950 to-blue-900 p-4">
      <div className="card w-full max-w-md shadow-2xl bg-slate-800 rounded-2xl">
        <div className="card-body p-8">
          <h2 className="text-3xl font-bold text-white text-center">
            Create Account
          </h2>

          {error && (
            <p className="text-red-400 text-center text-sm mt-2">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">

            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input input-bordered w-full bg-slate-700 text-white"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input input-bordered w-full bg-slate-700 text-white"
                required
              />
            </div>

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full bg-slate-700 text-white"
              required
            />

            {/* Phone */}
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input input-bordered w-full bg-slate-700 text-white"
            />

            {/* Organization */}
            <input
              type="text"
              placeholder="Clinic / Laboratory Name"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="input input-bordered w-full bg-slate-700 text-white"
            />

            {/* Role */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="select select-bordered w-full bg-slate-700 text-white"
              required
            >
              <option value="">Select Role</option>
              <option value="Doctor">Doctor</option>
              <option value="Lab Technician">Lab Technician</option>
            </select>

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-slate-700 text-white"
              required
              minLength={8}
            />

            <button
              type="submit"
              className="btn btn-primary w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Account
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-slate-400">
              Already have an account?{" "}
            </span>
            <a
              href="/login"
              className="text-blue-400 hover:underline"
            >
              Sign in
            </a>
          </div>

        </div>
      </div>
    </main>
  );
}