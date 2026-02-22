import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      const next = location.state?.from?.pathname || "/home";
      navigate(next);
    } catch (err) {
      setError(err?.message || "Invalid email or password");
    }
  };

  return (
    <main className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-blue-950 to-blue-900 p-4">
      <div className="card w-full max-w-md shrink-0 shadow-2xl bg-slate-800 rounded-2xl overflow-hidden">
        <div className="card-body p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-slate-400 mt-2">Sign in to your account</p>
          </div>

          {location.state?.fromSignup && (
            <p className="text-green-400 text-center mb-4">
              Account created successfully. Please log in.
            </p>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="label">
                <span className="label-text text-slate-300">Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full bg-slate-700 border-slate-600 text-white rounded-lg"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-slate-300">Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full bg-slate-700 border-slate-600 text-white rounded-lg"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="btn btn-primary w-full rounded-lg bg-blue-600 border-none hover:bg-blue-700 text-white py-3"
            >
              Sign In
            </button>

            <div className="divider text-slate-400 before:bg-slate-600 after:bg-slate-600">OR</div>

            <button
              type="button"
              onClick={loginWithGoogle}
              className="btn btn-outline w-full rounded-lg border-slate-600 hover:bg-slate-700 text-white"
            >
              Continue with Google
            </button>
            <div className="text-center mt-4">
              <span className="text-slate-400">Don't have an account? </span>
              <a
                href="/signup"
                className="text-blue-400 hover:underline font-medium"
              >
                Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}