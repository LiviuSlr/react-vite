import Navbar from "./navbar/navbar";
import Sidebar from "./sidebar/sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen w-full flex bg-base-200">
      {/* Sidebar column */}
      <aside className="shrink-0">
        <Sidebar />
      </aside>

      {/* Content column */}
      <div className="flex-1 min-w-0">
        <Navbar />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}