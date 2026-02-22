import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function getInitials(nameOrEmail) {
  if (!nameOrEmail) return "?";
  const parts = nameOrEmail.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Navbar() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const displayName = user?.name || user?.email || "Guest";
  const initials = getInitials(displayName);

  return (
    <nav className="bg-white shadow-sm">
      <div className="flex justify-between items-center h-16 px-6">
        <div className="flex items-center">
          <Link className="text-xl font-semibold text-blue-600" to="/home">
            AxiDent
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          {/* Search */}
          <button
            type="button"
            className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 relative"
            aria-label="Notifications"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User */}
          <Link to={"/account"}>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                {loading ? "…" : initials}
              </div>

              <span className="text-sm font-medium text-gray-700">
                {loading ? "Loading…" : displayName}
              </span>

            </div>
          </Link>
          
        </div>
      </div>
    </nav>
  );
}