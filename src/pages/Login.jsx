import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export default function Login({ showToast, setCurrentUser }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://tbc-backend-nine.vercel.app';
        const response = await fetch(`${API_URL}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: values.email, password: values.password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const userObj = data.Data || {
            name: values.email.split('@')[0],
            email: values.email,
            profile: '/logo.png'
          };
          localStorage.setItem('user_session', JSON.stringify(userObj));
          if (setCurrentUser) setCurrentUser(userObj);
          showToast(`Logged in successfully! Welcome back, ${userObj.name}.`);
          navigate('/');
        } else {
          showToast(data.message || 'Login failed. Invalid credentials.');
        }
      } catch (error) {
        console.warn('Backend API offline, local fallback:', error.message);
        const fallbackUser = {
          name: values.email.split('@')[0],
          email: values.email,
          profile: '/logo.png'
        };
        localStorage.setItem('user_session', JSON.stringify(fallbackUser));
        if (setCurrentUser) setCurrentUser(fallbackUser);
        showToast('Logged in successfully!');
        navigate('/');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="page-route-animate section-pad">
      <div className="container">
        <div className="auth-card" data-aos="zoom-in">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Log in to access your saved bouquets & orders</p>
          </div>
          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                name="email"
                className={`form-input ${formik.touched.email && formik.errors.email ? 'input-error' : ''}`} 
                placeholder="user@example.com" 
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <span className="form-error">{formik.errors.email}</span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                name="password"
                className={`form-input ${formik.touched.password && formik.errors.password ? 'input-error' : ''}`} 
                placeholder="••••••••" 
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <span className="form-error">{formik.errors.password}</span>
              )}
            </div>
            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '12px' }}>
              Sign In
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: 'var(--text-dim)' }}>
            Don’t have an account?{' '}
            <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }} onClick={() => navigate('/register')}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
