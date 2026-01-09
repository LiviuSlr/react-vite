export default function Login() {
  return (
    <main className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-blue-950 to-blue-900 p-4">
      <div className="card w-full max-w-md shrink-0 shadow-2xl bg-slate-800 rounded-2xl overflow-hidden">
        <div className="card-body p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-slate-400 mt-2">Sign in to your account</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="label">
                <span className="label-text text-slate-300">Email Address</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full bg-slate-700 border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-slate-300">Password</span>
                <a
                  href="/forgot-password"
                  className="label-text-alt text-blue-400 hover:underline"
                >
                  Forgot password?
                </a>
              </label>
              <input
                type="password"
                className="input input-bordered w-full bg-slate-700 border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="checkbox checkbox-primary bg-slate-700 border-slate-600"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-300">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full rounded-lg bg-blue-600 border-none hover:bg-blue-700 text-white py-3"
            >
              Sign In
            </button>

            <div className="divider text-slate-400 before:bg-slate-600 after:bg-slate-600">
              OR
            </div>

            <button
              type="button"
              className="btn btn-outline w-full rounded-lg border-slate-600 hover:bg-slate-700 hover:border-slate-500 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.786-1.664-4.153-2.675-6.735-2.675-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.524 10-10 0-0.668-0.068-1.325-0.182-1.961h-9.818z" />
              </svg>
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
