import { useState } from "react";
import { Menu, X, User, Home, Star, FileWarning, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Profile", icon: <User className="w-4 h-4" />, to: "/user/dashboard/profile" },
  { name: "My Listings", icon: <Home className="w-4 h-4" />, to: "/user/dashboard/listings" },
  { name: "Reviews", icon: <Star className="w-4 h-4" />, to: "/user/dashboard/reviews" },
  { name: "Reports", icon: <FileWarning className="w-4 h-4" />, to: "/user/dashboard/reports" },
  { name: "Logout", icon: <LogOut className="w-4 h-4" />, to: "/logout" },
];

export default function UserDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-white text-gray-800">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-br from-blue-500 to-green-500 text-white p-4">
        <h1 className="text-2xl font-bold mb-6">RentRadar</h1>
        <nav className="space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="flex items-center gap-2 hover:bg-white/20 px-3 py-2 rounded"
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-br from-blue-500 to-green-500 text-white p-4 z-20 flex justify-between items-center">
        <h1 className="text-lg font-semibold">RentRadar</h1>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white shadow z-10 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 py-2 border-b text-gray-700 hover:bg-gray-100"
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Main content area */}
      <main className="flex-1 p-6 mt-16 md:mt-0 overflow-y-auto bg-gray-50">
        {/* Replace this with a <Routes> if you're using nested routing */}
        <div className="border rounded-xl p-6 bg-white shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Welcome to your Dashboard!</h2>
          <p className="text-gray-600">Select a section from the menu to get started.</p>
        </div>
      </main>
    </div>
  );
}
