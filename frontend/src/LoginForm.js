import React, { useState } from 'react';
import axios from 'axios';

function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Attempting login with:', form);
      const res = await axios.post('/api/login', form);
      console.log('Login successful:', res.data);
      
      localStorage.setItem('token', res.data.token);
      onLogin(); // Navigate to list page
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed! Please check your credentials.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
        style={{
          padding: '16px 18px',
          border: '1px solid #d0d0d0',
          borderRadius: '6px',
          fontSize: '1.1rem',
          outline: 'none',
          background: '#e6f7f7'
        }}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        style={{
          padding: '16px 18px',
          border: '1px solid #d0d0d0',
          borderRadius: '6px',
          fontSize: '1.1rem',
          outline: 'none',
          background: '#e6f7f7'
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '12px 40px',
          background: 'linear-gradient(90deg, #4CAF50 0%, #45a049 100%)',
          color: '#fff',
          fontSize: '1rem',
          fontWeight: '600',
          border: 'none',
          borderRadius: '999px',
          cursor: 'pointer',
          minHeight: '44px',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default LoginForm;
