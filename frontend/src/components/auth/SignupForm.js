import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';

// Zod validation schema
const signupSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword'],
});

const SignupForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...submitData } = data;

      const response = await axios.post('http://localhost:3001/api/auth/signup', submitData);

      console.log('Signup successful:', response.data);
      setSubmitSuccess(true);
      reset(); // Clear form on success

    } catch (error) {
      console.error('Signup error:', error);

      if (error.response) {
        // Server responded with error status
        setSubmitError(error.response.data.message || 'Signup failed. Please try again.');
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
      maxWidth: '520px',
      width: '100%',
      margin: '0 auto',
      background: 'white',
      borderRadius: '32px',
      padding: '48px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      border: '4px solid #a78bfa'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '32px',
        padding: '24px',
        background: 'linear-gradient(135deg, #e9d5ff 0%, #c084fc 100%)',
        borderRadius: '24px',
        border: '3px solid #9333ea'
      }}>
        <div style={{fontSize: '64px', marginBottom: '12px'}}>🚀</div>
        <h2 style={{fontSize: '32px', fontWeight: '900', color: '#1e3a8a', marginBottom: '8px'}}>
          Create Your Account
        </h2>
        <p style={{fontSize: '16px', color: '#6b7280', fontWeight: '600'}}>
          Join SkillWise and start learning today!
        </p>
      </div>

      {submitSuccess && (
        <div style={{
          marginBottom: '24px',
          padding: '20px',
          background: 'linear-gradient(135deg, #d1fae5 0%, #34d399 100%)',
          border: '3px solid #059669',
          borderRadius: '20px',
          color: '#065f46',
          fontSize: '15px',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          ✅ Account created successfully! You can now log in.
        </div>
      )}

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
        {/* First Name */}
        <div style={{marginBottom: '20px'}}>
          <label htmlFor="firstName" style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: '700',
            color: '#374151',
            marginBottom: '8px'
          }}>
            👤 First Name
          </label>
          <input
            id="firstName"
            type="text"
            {...register('firstName')}
            style={{
              width: '100%',
              padding: '14px 18px',
              fontSize: '15px',
              border: errors.firstName ? '3px solid #ef4444' : '3px solid #e5e7eb',
              borderRadius: '14px',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              if (!errors.firstName) {
                e.target.style.border = '3px solid #a78bfa';
                e.target.style.boxShadow = '0 0 0 4px rgba(167, 139, 250, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.firstName) {
                e.target.style.border = '3px solid #e5e7eb';
                e.target.style.boxShadow = 'none';
              }
            }}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p style={{marginTop: '6px', fontSize: '13px', color: '#ef4444', fontWeight: '600'}}>
              ⚠️ {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div style={{marginBottom: '20px'}}>
          <label htmlFor="lastName" style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: '700',
            color: '#374151',
            marginBottom: '8px'
          }}>
            👤 Last Name
          </label>
          <input
            id="lastName"
            type="text"
            {...register('lastName')}
            style={{
              width: '100%',
              padding: '14px 18px',
              fontSize: '15px',
              border: errors.lastName ? '3px solid #ef4444' : '3px solid #e5e7eb',
              borderRadius: '14px',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              if (!errors.lastName) {
                e.target.style.border = '3px solid #a78bfa';
                e.target.style.boxShadow = '0 0 0 4px rgba(167, 139, 250, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.lastName) {
                e.target.style.border = '3px solid #e5e7eb';
                e.target.style.boxShadow = 'none';
              }
            }}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p style={{marginTop: '6px', fontSize: '13px', color: '#ef4444', fontWeight: '600'}}>
              ⚠️ {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div style={{marginBottom: '20px'}}>
          <label htmlFor="email" style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: '700',
            color: '#374151',
            marginBottom: '8px'
          }}>
            📧 Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            style={{
              width: '100%',
              padding: '14px 18px',
              fontSize: '15px',
              border: errors.email ? '3px solid #ef4444' : '3px solid #e5e7eb',
              borderRadius: '14px',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              if (!errors.email) {
                e.target.style.border = '3px solid #a78bfa';
                e.target.style.boxShadow = '0 0 0 4px rgba(167, 139, 250, 0.1)';
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
            <p style={{marginTop: '6px', fontSize: '13px', color: '#ef4444', fontWeight: '600'}}>
              ⚠️ {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div style={{marginBottom: '20px'}}>
          <label htmlFor="password" style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: '700',
            color: '#374151',
            marginBottom: '8px'
          }}>
            🔒 Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            style={{
              width: '100%',
              padding: '14px 18px',
              fontSize: '15px',
              border: errors.password ? '3px solid #ef4444' : '3px solid #e5e7eb',
              borderRadius: '14px',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              if (!errors.password) {
                e.target.style.border = '3px solid #a78bfa';
                e.target.style.boxShadow = '0 0 0 4px rgba(167, 139, 250, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.password) {
                e.target.style.border = '3px solid #e5e7eb';
                e.target.style.boxShadow = 'none';
              }
            }}
            placeholder="Create a strong password"
          />
          {errors.password && (
            <p style={{marginTop: '6px', fontSize: '13px', color: '#ef4444', fontWeight: '600'}}>
              ⚠️ {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div style={{marginBottom: '28px'}}>
          <label htmlFor="confirmPassword" style={{
            display: 'block',
            fontSize: '15px',
            fontWeight: '700',
            color: '#374151',
            marginBottom: '8px'
          }}>
            🔒 Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            style={{
              width: '100%',
              padding: '14px 18px',
              fontSize: '15px',
              border: errors.confirmPassword ? '3px solid #ef4444' : '3px solid #e5e7eb',
              borderRadius: '14px',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              if (!errors.confirmPassword) {
                e.target.style.border = '3px solid #a78bfa';
                e.target.style.boxShadow = '0 0 0 4px rgba(167, 139, 250, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.confirmPassword) {
                e.target.style.border = '3px solid #e5e7eb';
                e.target.style.boxShadow = 'none';
              }
            }}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p style={{marginTop: '6px', fontSize: '13px', color: '#ef4444', fontWeight: '600'}}>
              ⚠️ {errors.confirmPassword.message}
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
              : 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
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
          {isSubmitting ? '⏳ Creating Account...' : '✨ Create Account'}
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
          Already have an account?
        </p>
        <a 
          href="/login" 
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
          🔑 Sign in here
        </a>
      </div>
    </div>
  );
};

export default SignupForm;
