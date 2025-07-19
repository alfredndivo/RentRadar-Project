import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css'; // styling here

const UserProfile = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    preferences: '',
    photo: null,
  });

  useEffect(() => {
    // You can use actual auth context or token fetch
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserData((prev) => ({
        ...prev,
        name: storedUser.name || '',
        email: storedUser.email || '',
        phone: storedUser.phone || '',
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setUserData((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in userData) {
      form.append(key, userData[key]);
    }

    try {
      await axios.post('/api/users/complete-profile', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      navigate('/userdashboard');
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Complete Your Profile</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          <input
            type="text"
            name="name"
            value={userData.name}
            disabled
            className="profile-input disabled"
          />
          <input
            type="email"
            name="email"
            value={userData.email}
            disabled
            className="profile-input disabled"
          />
          <input
            type="text"
            name="phone"
            value={userData.phone}
            disabled
            className="profile-input disabled"
          />

          <input
            type="text"
            name="location"
            value={userData.location}
            onChange={handleChange}
            placeholder="Location"
            required
            className="profile-input"
          />

          <textarea
            name="preferences"
            value={userData.preferences}
            onChange={handleChange}
            placeholder="Your preferences (optional)"
            rows="4"
            className="profile-textarea"
          />

          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="profile-input"
          />

          <button type="submit" className="profile-btn">
            Submit Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
