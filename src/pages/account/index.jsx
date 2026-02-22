import Layout from "../../components/layout";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function getInitials(nameOrEmail) {
  if (!nameOrEmail) return "?";
  const parts = nameOrEmail.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Account() {
  const navigate = useNavigate();
  const { user, profile, loading, updateName, updateProfile, logout } = useAuth();

  // Editable fields
  const [name, setName] = useState("");
  const [role, setRole] = useState("User");
  const [organization, setOrganization] = useState("");
  const [lab, setLab] = useState("");
  const [phone, setPhone] = useState("");

  // UX state
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [error, setError] = useState("");

  // Populate form when user/profile arrive
  useEffect(() => {
    setName(user?.name || "");
  }, [user]);

  useEffect(() => {
    setRole(profile?.role || "User");
    setOrganization(profile?.organization || "");
    setLab(profile?.lab || "");
    setPhone(profile?.phone || "");
  }, [profile]);

  const email = user?.email || "—";
  const displayName = user?.name || user?.email || "User";
  const initials = useMemo(() => getInitials(displayName), [displayName]);

  const createdAt = user?.$createdAt
    ? new Date(user.$createdAt).toLocaleString()
    : "—";

  const provider = user?.accessedAt ? "Appwrite" : "—";

  if (loading) {
    return (
      <Layout>
        <div className="p-6">Loading…</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="p-6 space-y-3">
          <div className="text-lg font-semibold">Not logged in</div>
          <p className="text-sm opacity-80">Please sign in to view your account.</p>
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </Layout>
    );
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaveMsg("");

    try {
      // Update Appwrite auth name
      if ((user.name || "") !== name.trim()) {
        await updateName(name.trim());
      }

      // Update profile doc fields (db)
      await updateProfile({
        role,
        organization: organization.trim(),
        lab: lab.trim(),
        phone: phone.trim(),
      });

      setSaveMsg("Saved successfully.");
      setTimeout(() => setSaveMsg(""), 2500);
    } catch (e) {
      setError(e?.message || "Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch {
      // ignore
    }
  }

  return (
    <Layout>
      <div className="min-h-full bg-base-200 p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-base-content">Account</h1>
            <p className="mt-1 text-sm text-base-content/70">
              Profile, security, and notifications.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className={`btn btn-primary ${saving ? "btn-disabled" : ""}`}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Save changes"
              )}
            </button>

            <button
              className="btn btn-outline"
              onClick={() => {
                // Reset back to stored values
                setName(user?.name || "");
                setRole(profile?.role || "User");
                setOrganization(profile?.organization || "");
                setLab(profile?.lab || "");
                setPhone(profile?.phone || "");
                setError("");
                setSaveMsg("");
              }}
              disabled={saving}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Alerts */}
        {(error || saveMsg) && (
          <div className="mb-6">
            {error ? (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            ) : (
              <div className="alert alert-success">
                <span>{saveMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile card */}
          <div className="card bg-base-100 border border-base-300 shadow lg:col-span-2">
            <div className="card-body">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {initials}
                  </div>

                  <div>
                    <h2 className="card-title text-base-content">Profile</h2>
                    <div className="text-sm text-base-content/70">{email}</div>
                  </div>
                </div>

                <div className="badge badge-primary badge-outline">{role}</div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Name */}
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text text-base-content/80">Name</span>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered w-full bg-base-200/40"
                    placeholder="Your name"
                  />
                </label>

                {/* Email (read only) */}
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text text-base-content/80">Email</span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="input input-bordered w-full bg-base-200/30 opacity-80 cursor-not-allowed"
                  />
                </label>

                {/* Role */}
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text text-base-content/80">Role</span>
                  </div>
                  <select
                    className="select select-bordered w-full bg-base-200/40"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="User">User</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Lab Technician">Lab Technician</option>
                    <option value="Technician">Technician</option>
                    <option value="Admin">Admin</option>
                  </select>
                </label>

                {/* Phone */}
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text text-base-content/80">Phone</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input input-bordered w-full bg-base-200/40"
                    placeholder="+373 ..."
                  />
                </label>

                {/* Organization */}
                <label className="form-control w-full md:col-span-2">
                  <div className="label">
                    <span className="label-text text-base-content/80">Organization</span>
                  </div>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="input input-bordered w-full bg-base-200/40"
                    placeholder="Clinic / Organization"
                  />
                </label>

                {/* Lab */}
                <label className="form-control w-full md:col-span-2">
                  <div className="label">
                    <span className="label-text text-base-content/80">Lab</span>
                  </div>
                  <input
                    type="text"
                    value={lab}
                    onChange={(e) => setLab(e.target.value)}
                    className="input input-bordered w-full bg-base-200/40"
                    placeholder="Lab name"
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {organization ? (
                  <span className="badge badge-outline">Org: {organization}</span>
                ) : (
                  <span className="badge badge-ghost">Org: —</span>
                )}
                {lab ? (
                  <span className="badge badge-outline">Lab: {lab}</span>
                ) : (
                  <span className="badge badge-ghost">Lab: —</span>
                )}
                {phone ? (
                  <span className="badge badge-outline">Phone: {phone}</span>
                ) : (
                  <span className="badge badge-ghost">Phone: —</span>
                )}
              </div>
            </div>
          </div>

          {/* Security card */}
          <div className="card bg-base-100 border border-base-300 shadow">
            <div className="card-body">
              <h2 className="card-title text-base-content">Security</h2>

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base-content/70">Created</span>
                  <span className="text-base-content">{createdAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base-content/70">Provider</span>
                  <span className="text-base-content">{provider}</span>
                </div>
              </div>

              <div className="divider my-4" />

              <button
                className="btn btn-error btn-outline w-full"
                onClick={handleLogout}
              >
                <span className="inline-flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16 13v-2H7V8l-5 4 5 4v-3h9z" />
                    <path d="M20 3h-8a2 2 0 0 0-2 2v4h2V5h8v14h-8v-4h-2v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
                  </svg>
                  Logout
                </span>
              </button>

              <div className="mt-3 text-[11px] text-base-content/60">
                For changing email, contact an administrator. Password changes can be implemented later (Appwrite supports it).
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card bg-base-100 border border-base-300 shadow lg:col-span-3">
            <div className="card-body">
              <h2 className="card-title text-base-content">Notifications</h2>

              <div className="mt-2 form-control">
                <label className="label cursor-pointer justify-between">
                  <span className="label-text text-base-content/80">
                    Email notifications
                  </span>
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </label>
              </div>

              <div className="divider my-2" />

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <label className="label cursor-pointer justify-between border border-base-300 rounded-lg px-3 py-2">
                  <span className="label-text text-base-content/80">New case</span>
                  <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
                </label>

                <label className="label cursor-pointer justify-between border border-base-300 rounded-lg px-3 py-2">
                  <span className="label-text text-base-content/80">Status changes</span>
                  <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
                </label>

                <label className="label cursor-pointer justify-between border border-base-300 rounded-lg px-3 py-2">
                  <span className="label-text text-base-content/80">New messages</span>
                  <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
                </label>
              </div>

              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary btn-sm" onClick={() => {}}>
                  Save notification settings
                </button>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="card bg-base-100 border border-base-300 shadow lg:col-span-3">
            <div className="card-body">
              <h2 className="card-title text-base-content">Help</h2>
              <p className="text-sm text-base-content/70">
                For suggestions or bug reports, leave a contact email.
              </p>

              <div className="mt-3 max-w-xl">
                <input
                  type="email"
                  placeholder="Email for feedback"
                  className="input input-bordered w-full bg-base-200/40"
                />
                <p className="mt-1 text-[11px] text-base-content/60">
                  Optional • only for contact.
                </p>
              </div>

              <div className="card-actions justify-end mt-4">
                <button className="btn btn-outline btn-sm">Send</button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sticky save bar */}
        <div className="fixed bottom-4 left-0 right-0 px-4 sm:hidden">
          <div className="max-w-md mx-auto">
            <div className="card bg-base-100 border border-base-300 shadow">
              <div className="card-body p-3 flex flex-row items-center justify-between gap-2">
                <div className="text-sm">
                  {saving ? "Saving…" : "Edit your profile and save"}
                </div>
                <button
                  className={`btn btn-primary btn-sm ${saving ? "btn-disabled" : ""}`}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? <span className="loading loading-spinner loading-xs" /> : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}