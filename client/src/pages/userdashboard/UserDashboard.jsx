import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Search, 
  Heart, 
  MessageSquare, 
  Star, 
  Flag, 
  User, 
  LogOut,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';
import UserListingsPage from './UserListingsPage';
import UserMessagesPage from './UserMessagesPage';
import UserSavedListings from './UserSavedListings';
import UserReportsPage from './UserReportsPage';
import UserProfilePage from './UserProfilePage';

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const navItems = [
    { name: 'Browse Listings', icon: <Search className="w-5 h-5" />, path: '/user/dashboard', exact: true },
    { name: 'Saved Listings', icon: <Heart className="w-5 h-5" />, path: '/user/dashboard/saved' },
    { name: 'Messages', icon: <MessageSquare className="w-5 h-5" />, path: '/user/dashboard/messages' },
    { name: 'My Reports', icon: <Flag className="w-5 h-5" />, path: '/user/dashboard/reports' },
    { name: 'Profile', icon: <User className="w-5 h-5" />, path: '/user/dashboard/profile' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2EFEF] via-[#FAF5FF] to-[#F5F3FF]">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#1C1D20] text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Home className="w-6 h-6 text-[#10B981]" />
          <h1 className="text-xl font-bold">RentRadar</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1C1D20] text-white transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            {/* Logo */}
            <div className="hidden lg:flex items-center gap-3 mb-8">
              <Home className="w-8 h-8 text-[#10B981]" />
              <h1 className="text-2xl font-bold">RentRadar</h1>
            </div>

            {/* User Info */}
            {user && (
              <div className="mb-8 p-4 bg-gray-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#10B981] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-400">Tenant</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive(item.path, item.exact)
                      ? 'bg-[#10B981] text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full mt-8 flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="p-6">
            <Routes>
              <Route path="/" element={<UserListingsPage />} />
              <Route path="/saved" element={<UserSavedListings />} />
              <Route path="/messages" element={<UserMessagesPage />} />
              <Route path="/reports" element={<UserReportsPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;