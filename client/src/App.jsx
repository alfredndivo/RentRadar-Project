import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import LandlordDashboard from './pages/Landlorddashboard/Landlorddashboard';

import UserListingsPage from './pages/userdashboard/UserListingsPage';
import UserMessagesPage from './pages/userDashboard/MessagesPage';
import UserReportsPage from './pages/userdashboard/ReportModal';
import UserProfile from './pages/userdashboard/UserProfileForm';

import LandlordListingsPage from './pages/Landlorddashboard/ListingsPage';
import LandlordMessagesPage from './pages/LandlordDashboard/LandlordMessagesPage';
import LandlordReportsPage from './pages/LandlordDashboard/LandlordReportsPage';
import LandlordCompleteProfile from './pages/Landlorddashboard/LandlordCompleteProfile';

import AdminReportsPage from './pages/AdminDashboard/AdminReportsPage';

import ListingDetailsModal from './pages/userdashboard/ListingDetailsModal';

import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Routes>
      {/* Default redirect to auth */}
      <Route path="/" element={<Navigate to="/auth" />} />

      {/* Auth route */}
      <Route path="/auth" element={<AuthPage />} />

      {/* User protected routes */}
      <Route element={<RequireAuth allowedRoles={['user']} />}>
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/listings" element={<UserListingsPage />} />
        <Route path="/user/messages" element={<UserMessagesPage />} />
        <Route path="/user/reports" element={<UserReportsPage />} />
        <Route path="/user/complete-profile" element={<UserProfile />} />
      </Route>

      {/* Landlord protected routes */}
      <Route element={<RequireAuth allowedRoles={['landlord']} />}>
        <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
        <Route path="/landlord/listings" element={<LandlordListingsPage />} />
        <Route path="/landlord/messages" element={<LandlordMessagesPage />} />
        <Route path="/landlord/reports" element={<LandlordReportsPage />} />
        <Route path="/landlord/profile" element={<LandlordCompleteProfile />} />
      </Route>

      {/* Admin protected routes */}
      <Route element={<RequireAuth allowedRoles={['admin', 'superadmin']} />}>
        <Route path="/admin/reports" element={<AdminReportsPage />} />
      </Route>

      {/* View listing details */}
      <Route path="/listing/:id" element={<ListingDetailsModal />} />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/auth" />} />
    </Routes>
  );
}

export default App;
