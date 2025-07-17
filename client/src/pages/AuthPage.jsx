import React, { useState } from 'react';
import './AuthPage.css';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    <div className="auth-container">
      <div className="auth-left">
        {/* 🎞️ Your 3 animated background images here */}
        {/* Replace these divs with your <img src={...} /> */}
        <div className="slide-img img1">{/* 🖼️ Image 1 */}</div>
        <div className="slide-img img2">{/* 🖼️ Image 2 */}</div>
        <div className="slide-img img3">{/* 🖼️ Image 3 */}</div>
      </div>

      <div className="auth-card">
        <h2>{isLogin ? 'Welcome Back!' : 'Create an Account'}</h2>

        <form>
          {!isLogin && (
            <input type="text" name="name" placeholder="Full Name" required />
          )}
          <input type="email" name="email" placeholder="Email Address" required />
          <input type="password" name="password" placeholder="Password" required />

          {isLogin && (
            <div className="auth-forgot" onClick={() => navigate('/forgot-password')}>
              Forgot Password?
            </div>
          )}

          <button type="submit" className="auth-button">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <span onClick={toggleMode}>Register</span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span onClick={toggleMode}>Login</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
