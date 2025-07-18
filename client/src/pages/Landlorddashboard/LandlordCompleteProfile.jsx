import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import './LandlordCompleteProfile.css';
import API from '../../../api';

const LandlordCompleteProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    idNumber: '',
    location: '',
    nationalIdPhoto: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      console.log('📡 Fetching landlord profile...');
      try {
        const { data } = await API.get('/landlord/profile', {
        });
        console.log('✅ Profile fetched:', data);
        setFormData((prev) => ({
          ...prev,
          name: data.name || '',
          email: data.email || '',
        }));
      } catch (err) {
        console.error('❌ Failed to fetch profile:', err.message);
        setError('Failed to load profile. Please try again.');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'nationalIdPhoto') {
      setFormData((prev) => ({ ...prev, nationalIdPhoto: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const form = new FormData();
   Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
     form.append(key, value);
  }
});

  try {
    await API.put('/landlord/profile', form, {
     headers: {
    'Content-Type': 'multipart/form-data',
  },
});
    toast.success('Profile updated successfully');
    navigate('/landlord/dashboard');
  } catch (error) {
    console.error('❌ Error during profile update:', error);
    toast.error(error.response?.data?.message || 'Failed to update profile');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="landlord-profile-container">
      <div className="landlord-profile-card">
        <h2>Complete Your Profile</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="landlord-profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} disabled />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} disabled />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 07XX..."
              title="Phone number should start with 07 and be 10 digits"
              required
            />
          </div>

          <div className="form-group">
            <label>National ID Number</label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder="e.g. 12345678"
              title="ID number should be 8 digits"
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Thika Road, Nairobi"
              required
            />
          </div>

          <div className="form-group">
            <label>National ID Photo (optional)</label>
            <input
              type="file"
              name="nationalIdPhoto"
              accept="image/*"
              onChange={handleChange}
            />
            {formData.nationalIdPhoto && (
              <img
                src={URL.createObjectURL(formData.nationalIdPhoto)}
                alt="ID Preview"
                style={{ width: '150px', marginTop: '10px' }}
              />
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Finish Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandlordCompleteProfile;
