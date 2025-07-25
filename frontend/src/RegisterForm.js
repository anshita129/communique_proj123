import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm({ onRegister }) {
  const [form, setForm] = useState({ username: '', password: '', email: '', communiqueCode: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check communique code before proceeding
    if (form.communiqueCode !== '12345') {
      alert('Invalid communique code. Please enter the correct code to register.');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting registration with:', {
        username: form.username,
        email: form.email
      });
      
      const response = await axios.post('/api/register', {
        username: form.username,
        password: form.password,
        email: form.email
      });
      
      console.log('Registration successful:', response.data);
      onRegister(); // Show success message or proceed
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed!';
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
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
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
      <input
        name="communiqueCode"
        placeholder="Communique Code"
        value={form.communiqueCode}
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
          background: 'linear-gradient(90deg, #ffb75e 0%, #ed2f6a 100%)',
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
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}

export default RegisterForm;
