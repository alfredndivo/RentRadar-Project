import React, { useState } from 'react';
import './AuthPage.css';
import { useNavigate } from 'react-router-dom';
import {registerUser,
  loginUser,
  registerLandlord,
  loginLandlord} from '../../api';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setFormData({});
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleAuthMode = () => {
    setIsLogin(prev => !prev);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) return alert('Please select a role first');

    if (role === 'admin' || role === 'superadmin') {
      return alert('This role is not available for login or registration.');
    }

    setLoading(true);
    try {
    let data;

    if (isLogin) {
      if (role === 'user') {
      const res = await loginUser(formData);
      data = res.data;
    } else if (role === 'landlord') {
      const res = await loginLandlord(formData);
      data = res.data;
    }
     } else {
    if (role === 'user') {
      const res = await registerUser(formData);
      data = res.data;
    } else if (role === 'landlord') {
      const res = await registerLandlord(formData);
      data = res.data;
    }
  }


     if (role === 'user') navigate('/user/complete-profile');
     else if (role === 'landlord') navigate('/landlord/profile');

    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred');
   } finally {
    setLoading(false);
    }
  };


  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="slide-img img1"></div>
        <div className="slide-img img2"></div>
        <div className="slide-img img3"></div>
      </div>

      <div className="auth-card">
        <h2>Welcome to RentRadar</h2>

        <select value={role} onChange={handleRoleChange} className="auth-select">
          <option value="">-- Select Role --</option>
          <option value="user">Tenant</option>
          <option value="landlord">Landlord</option>
        </select>

        {role && (
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  required
                  onChange={handleInputChange}
                />
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleInputChange}
            />

            {isLogin && <div className="auth-forgot">Forgot password?</div>}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>
        )}

        <div className="auth-toggle">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <span onClick={toggleAuthMode}>
            {isLogin ? ' Register' : ' Login'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
