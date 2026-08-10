import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Camera, Trash2 } from 'lucide-react';



const registerValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .trim()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  phone: Yup.string()
    .trim()
    .matches(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number')
    .required('Phone number is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export default function Register({ showToast, setCurrentUser }) {
  const navigate = useNavigate();
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      profilePic: null,
      name: '',
      email: '',
      phone: '',
      password: '',
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('phone', values.phone);
        formData.append('password', values.password);
        if (values.profilePic) {
          formData.append('profile', values.profilePic);
          formData.append('file', values.profilePic);
        }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/users/register`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const userObj = data.Data || {
            name: values.name,
            email: values.email,
            phone: values.phone,
            profile: profilePicPreview || '/logo.png'
          };
          localStorage.setItem('user_session', JSON.stringify(userObj));
          if (setCurrentUser) setCurrentUser(userObj);
          showToast('Account created successfully');
          navigate('/');
        } else {
          showToast(data.message || 'Registration failed. Please try again.');
        }
      } catch (error) {
        console.warn('Backend API connection offline, falling back to local session:', error.message);
        const fallbackUser = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          profile: profilePicPreview || '/logo.png'
        };
        localStorage.setItem('user_session', JSON.stringify(fallbackUser));
        if (setCurrentUser) setCurrentUser(fallbackUser);
        showToast('Account created successfully');
        navigate('/');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue('profilePic', file);
      setProfilePicPreview(URL.createObjectURL(file));
      setSelectedFileName(file.name);
    }
  };

  const handleRemovePhoto = () => {
    formik.setFieldValue('profilePic', null);
    setProfilePicPreview(null);
    setSelectedFileName('');
    const fileInput = document.getElementById('profilePic');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="page-route-animate section-pad">
      <div className="container">
        <div className="auth-card" data-aos="zoom-in">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Join theblissco family for floral updates</p>
          </div>

          <form onSubmit={formik.handleSubmit} noValidate>
            {/* Profile Picture Upload & Remove Option */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ position: 'relative' }}>
                <label
                  htmlFor="profilePic"
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    border: '2px solid var(--border-mid)',
                    background: 'var(--surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 4px 12px rgba(139, 68, 83, 0.12)'
                  }}
                  title="Click to upload profile picture"
                >
                    {profilePicPreview ? (
                    <>
                      <img
                        src={profilePicPreview}
                        alt="Profile Avatar"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        opacity: 0,
                        transition: 'opacity 0.25s ease'
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                      >
                        <Camera size={22} />
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-dim)' }}>
                      <Camera size={26} color="var(--primary)" />
                      <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--primary)' }}>Upload</span>
                    </div>
                  )}
                </label>
              </div>

              <input
                type="file"
                id="profilePic"
                name="profilePic"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                <label htmlFor="profilePic" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', cursor: 'pointer' }}>
                  {profilePicPreview ? 'Change Photo' : 'Upload Photo'}
                </label>

                {profilePicPreview && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#c62828',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                )}
              </div>

              {selectedFileName && (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', maxWidth: '180px', textAlign: 'center', wordBreak: 'break-all' }}>
                  {selectedFileName}
                </span>
              )}

            </div>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                className={`form-input ${formik.touched.name && formik.errors.name ? 'input-error' : ''}`}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <span className="form-error">{formik.errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="user@example.com"
                className={`form-input ${formik.touched.email && formik.errors.email ? 'input-error' : ''}`}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <span className="form-error">{formik.errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter 10-digit mobile number"
                className={`form-input ${formik.touched.phone && formik.errors.phone ? 'input-error' : ''}`}
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phone && formik.errors.phone && (
                <span className="form-error">{formik.errors.phone}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                className={`form-input ${formik.touched.password && formik.errors.password ? 'input-error' : ''}`}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <span className="form-error">{formik.errors.password}</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '12px' }} disabled={isSubmitting}>
              {isSubmitting ? 'Registering Account...' : 'Register Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: 'var(--text-dim)' }}>
            Already have an account?{' '}
            <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }} onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
