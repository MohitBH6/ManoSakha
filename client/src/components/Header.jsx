import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Flame } from "lucide-react";
import logo from "/logo.jpg";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const userRole = localStorage.getItem("user_role");
  const userId = localStorage.getItem("user_id");

  // Hide header after login
  if (userRole && userId) return null;

  return (
    <>
      {/* Header */}
      <header className="bg-[#52a173] text-white shadow-md fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          {/* Logo + Brand */}
          <div className="flex items-center space-x-2">
            <img
              src={logo}
              alt="ManoSakha Logo"
              className="h-10 w-10 rounded-full"
            />
            <h1 className="text-xl font-bold tracking-wide">ManoSakha</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-gray-200">Home</Link>
            <Link to="/appointments" className="hover:text-gray-200">Appointments</Link>
            <Link to="/resources" className="hover:text-gray-200">Resources</Link>
            <Link to="/blogs" className="hover:text-gray-200">Blogs</Link>
            <Link to="/login" className="hover:text-gray-200">Login</Link>
            <Link to="/admin" className="hover:text-gray-200">Admin Login</Link>

            {/* Complete Streak Icon */}
            <button
              onClick={() => navigate("/resilience")}
              className="flex items-center gap-1 bg-white text-[#52a173] px-3 py-1 rounded-lg hover:bg-gray-100 transition"
            >
              <Flame size={20} />
              Streak
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden focus:outline-none"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-blue-600">Menu</h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-4 text-gray-800 font-medium">
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link to="/appointments" onClick={() => setIsOpen(false)}>Appointments</Link>
          <Link to="/resources" onClick={() => setIsOpen(false)}>Resources</Link>
          <Link to="/blogs" onClick={() => setIsOpen(false)}>Blogs</Link>
          <Link to="/login" className="hover:text-gray-200">Login</Link>
          <Link to="/admin" className="hover:text-gray-200">Admin Login</Link>

          <button
            onClick={() => { navigate("/resilience"); setIsOpen(false); }}
            className="flex items-center gap-1 bg-[#52a173] text-white px-3 py-1 rounded-lg hover:bg-[#469361] transition"
          >
            <Flame size={18} />
            Streak
          </button>
        </nav>
      </div>
    </>
  );
}
