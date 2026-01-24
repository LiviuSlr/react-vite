import { useState } from "react";
import { useNavigate } from "react-router";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({ email, password })
    );

    navigate("/login", {
      state: { fromSignup: true },
    });
  }; 


  return (
    <main className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-blue-950 to-blue-900 p-4">
      <div className="card w-full max-w-md shrink-0 shadow-2xl bg-slate-800 rounded-2xl overflow-hidden">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            {error && (
              <p className="text-red-400 text-center text-sm">{error}</p>
            )}
            <p className="text-slate-400 mt-2">Join our platform today</p>
          </div>

          <form className="space-y-4"  onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text text-slate-300">First Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-slate-700 border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-slate-300">Last Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-slate-700 border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text text-slate-300">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full bg-slate-700 border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-slate-300">Phone Number</span>
              </label>
              <input
                type="tel"
                className="input input-bordered w-full bg-slate-700 border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+1 234 567 890"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-slate-300">
                  Clinic/Laboratory
                </span>
              </label>
              <input
                className="input input-bordered w-full bg-slate-700 border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Clinic\laboratory"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-slate-300">Role</span>
              </label>
              <select className="select select-bordered w-full bg-slate-700 border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500">
                <option disabled selected>
                  Select your role
                </option>
                <option>Doctor</option>
                <option>Lab Technician</option>
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text text-slate-300">Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full bg-slate-700 border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                minLength="8"
                required
              />
              <div className="label">
                <span className="label-text-alt text-slate-400">
                  Minimum 8 characters
                </span>
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text text-slate-300">
                  Confirm Password
                </span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full bg-slate-700 border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="checkbox checkbox-primary bg-slate-700 border-slate-600"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-slate-300">
                  I agree to the{" "}
                  <a href="#" className="text-blue-400 hover:underline">
                    Terms
                  </a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-6 rounded-lg bg-blue-600 border-none hover:bg-blue-700 text-white"
            >
              Create Account
            </button>

            <div className="text-center mt-4">
              <span className="text-slate-400">Already have an account? </span>
              <a
                href="./login"
                className="text-blue-400 hover:underline font-medium"
              >
                Sign in
              </a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
