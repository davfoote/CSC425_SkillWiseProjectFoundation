import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';

// Zod validation schema for login
const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(1, 'Password is required'),
});

const LoginForm = ({ onLoginSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', data);

      console.log('Login successful:', response.data);

      // Store JWT token in localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      // Call success callback (for navigation)
      if (onLoginSuccess) {
        onLoginSuccess(response.data);
      }

      reset(); // Clear form on success

    } catch (error) {
      console.error('Login error:', error);

      if (error.response) {
        // Server responded with error status
        setSubmitError(error.response.data.message || 'Login failed. Please check your credentials.');
      } else if (error.request) {
        // Request was made but no response received
        setSubmitError('Network error. Please check your connection and try again.');
      } else {
        // Something else happened
        setSubmitError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #38bdf8 0%, #60a5fa 50%, #93c5fd 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: 'white',
        borderRadius: '32px',
        padding: '48px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        border: '4px solid #fbbf24'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          padding: '24px',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
          borderRadius: '24px',
          border: '3px solid #f59e0b'
        }}>
          <div style={{fontSize: '64px', marginBottom: '12px'}}>👋</div>
          <h2 style={{fontSize: '32px', fontWeight: '900', color: '#1e3a8a', marginBottom: '8px'}}>
            Welcome Back!
          </h2>
          <p style={{fontSize: '16px', color: '#6b7280', fontWeight: '600'}}>
            Ready to continue your learning journey?
          </p>
        </div>

        {submitError && (
          <div style={{
            marginBottom: '24px',
            padding: '20px',
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            border: '3px solid #ef4444',
            borderRadius: '20px',
            color: '#991b1b',
            fontSize: '15px',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            ⚠️ {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{marginBottom: '32px'}}>
          {/* Email */}
          <div style={{marginBottom: '24px'}}>
            <label htmlFor="email" style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '700',
              color: '#374151',
              marginBottom: '10px'
            }}>
              📧 Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              style={{
                width: '100%',
                padding: '16px 20px',
                fontSize: '16px',
                border: errors.email ? '3px solid #ef4444' : '3px solid #e5e7eb',
                borderRadius: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                if (!errors.email) {
                  e.target.style.border = '3px solid #60a5fa';
                  e.target.style.boxShadow = '0 0 0 4px rgba(96, 165, 250, 0.1)';
                }
              }}
              onBlur={(e) => {
                if (!errors.email) {
                  e.target.style.border = '3px solid #e5e7eb';
                  e.target.style.boxShadow = 'none';
                }
              }}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p style={{marginTop: '8px', fontSize: '14px', color: '#ef4444', fontWeight: '600'}}>
                ⚠️ {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div style={{marginBottom: '32px'}}>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '700',
              color: '#374151',
              marginBottom: '10px'
            }}>
              🔒 Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              style={{
                width: '100%',
                padding: '16px 20px',
                fontSize: '16px',
                border: errors.password ? '3px solid #ef4444' : '3px solid #e5e7eb',
                borderRadius: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                if (!errors.password) {
                  e.target.style.border = '3px solid #60a5fa';
                  e.target.style.boxShadow = '0 0 0 4px rgba(96, 165, 250, 0.1)';
                }
              }}
              onBlur={(e) => {
                if (!errors.password) {
                  e.target.style.border = '3px solid #e5e7eb';
                  e.target.style.boxShadow = 'none';
                }
              }}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p style={{marginTop: '8px', fontSize: '14px', color: '#ef4444', fontWeight: '600'}}>
                ⚠️ {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '18px',
              fontSize: '18px',
              fontWeight: '900',
              color: 'white',
              background: isSubmitting 
                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                : 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
              border: 'none',
              borderRadius: '20px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }
            }}
          >
            {isSubmitting ? '⏳ Signing In...' : '🚀 Sign In'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          padding: '20px',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          borderRadius: '20px',
          border: '2px solid #bae6fd'
        }}>
          <p style={{fontSize: '15px', color: '#475569', fontWeight: '600', marginBottom: '8px'}}>
            Don't have an account?
          </p>
          <a 
            href="/signup" 
            style={{
              fontSize: '16px',
              color: '#0ea5e9',
              fontWeight: '900',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#0284c7';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#0ea5e9';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ✨ Sign up here
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
