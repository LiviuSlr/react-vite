import Navbar from "./navbar/navbar";
import Sidebar from "./sidebar/sidebar";

export default function Layout({ children }) {
  return (
    <main className="w-screen h-screen flex">
      {/* aside component */}
      <div className="h-full border-transparent">
        <Sidebar />
      </div>

      <div className="w-full h-screen">
        {/* <Navbar /> */}
        <div className="w-full border-transparent">
          <Navbar />
        </div>
        {children}
      </div>
    </main>
  );
}
