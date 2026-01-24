import Layout from "../../components/layout";

// Demo data (înlocuiești cu date reale din user/auth)
const user = {
  name: "John Smith",
  email: "john.smith@email.com",
  role: "Doctor", // "Technician"
  organization: "AxiDent Clinic",
  lab: "SmileLab",
  lastLogin: "Today, 14:10",
};

export default function Account() {
  return (
    <Layout>
      <div className="min-h-full bg-base-200 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-base-content">Account</h1>
          <p className="mt-1 text-sm text-base-content/70">
            Profil, securitate și notificări.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile */}
          <div className="card bg-base-100 border border-base-300 shadow">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <h2 className="card-title text-base-content">Profile</h2>
                <div className="badge badge-primary">{user.role}</div>
              </div>

              <div className="mt-3 space-y-3">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text text-base-content/80">
                      Name
                    </span>
                  </div>
                  <input
                    type="text"
                    defaultValue={user.name}
                    placeholder="Your name"
                    className="input input-bordered w-full bg-base-200/40"
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text text-base-content/80">
                      Email
                    </span>
                  </div>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="input input-bordered w-full bg-base-200/30 opacity-80 cursor-not-allowed"
                  />
                </label>

                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="badge badge-outline">
                    Org: {user.organization}
                  </span>
                  <span className="badge badge-outline">Lab: {user.lab}</span>
                </div>
              </div>

              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary btn-sm">Save</button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="card bg-base-100 border border-base-300 shadow">
            <div className="card-body">
              <h2 className="card-title text-base-content">Security</h2>

              <div className="mt-3 text-sm text-base-content/70">
                Last login:{" "}
                <span className="text-base-content">{user.lastLogin}</span>
              </div>

              <div className="mt-4 space-y-2">
                <button className="btn btn-outline btn-sm w-full">
                  Change password
                </button>
                <button className="btn btn-ghost btn-sm w-full">Logout</button>
              </div>

              <div className="mt-3 text-[11px] text-base-content/60">
                Pentru schimbarea email-ului, contactează administratorul.
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card bg-base-100 border border-base-300 shadow">
            <div className="card-body">
              <h2 className="card-title text-base-content">Notifications</h2>

              <div className="mt-2 form-control">
                <label className="label cursor-pointer justify-between">
                  <span className="label-text text-base-content/80">
                    Email notifications
                  </span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    defaultChecked
                  />
                </label>
              </div>

              <div className="divider my-2" />

              <div className="space-y-1">
                <label className="label cursor-pointer justify-between">
                  <span className="label-text text-base-content/80">
                    New case
                  </span>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    defaultChecked
                  />
                </label>

                <label className="label cursor-pointer justify-between">
                  <span className="label-text text-base-content/80">
                    Status changes
                  </span>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    defaultChecked
                  />
                </label>

                <label className="label cursor-pointer justify-between">
                  <span className="label-text text-base-content/80">
                    New messages
                  </span>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    defaultChecked
                  />
                </label>
              </div>

              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary btn-sm">Save</button>
              </div>
            </div>
          </div>
        </div>

        {/* Optional: Feedback (mic, discret) */}
        <div className="mt-6">
          <div className="card bg-base-100 border border-base-300 shadow">
            <div className="card-body">
              <h2 className="card-title text-base-content">Help</h2>
              <p className="text-sm text-base-content/70">
                Pentru sugestii sau raportare erori, lasă un email de contact.
              </p>

              <div className="mt-3 max-w-md">
                <input
                  type="email"
                  placeholder="Email pentru feedback"
                  required
                  title="Introdu un email valid (ex: nume@domeniu.com)"
                  className="input input-bordered w-full bg-base-200/40"
                />
                <p className="mt-1 text-[11px] text-base-content/60">
                  Opțional • doar pentru contact.
                </p>
              </div>

              <div className="card-actions justify-end mt-4">
                <button className="btn btn-outline btn-sm">Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
