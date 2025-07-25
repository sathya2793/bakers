import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { jwtDecode } from 'jwt-decode';
import { 
  showSuccess, 
  showError,
} from '../utils/notifications';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Allow only these emails to access the admin dashboard
  const allowedEmails = ['sathya2793@gmail.com', 'vaniseatsllp@gmail.com'];

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div class="navigation">
            <a href="/" class="home-link">← Go to Home</a>
        </div>
        <h2>Admin Login</h2>
        <p>Please login to access the dashboard</p>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const idToken = credentialResponse.credential;
            try {
              setLoading(true);
              const payload = jwtDecode(idToken);
              const userEmail = payload.email;

              // Admin whitelist check
              if (!allowedEmails.includes(userEmail)) {
                showError('Access denied: You are not an authorized admin');
                setLoading(false);
                return;
              }
              showSuccess('Login successful!');
              // Store the ID token for later use (for your backend)
              localStorage.setItem('googleToken', idToken);
              navigate('/dashboard');
            } catch (err) {
              console.error('Error during login:', err);
              showError('Something went wrong while logging in.');
            } finally {
              setLoading(false);
            }
          }}
          onError={() => {
            console.log('Login Failed');
            showError('Login failed, please try again.');
            setLoading(false);
          }}
          render={({ onClick, disabled }) => (
            <button
              onClick={onClick}
              disabled={disabled || loading}
            >
              {loading ? 'Redirecting...' : 'Login with Google'}
            </button>
          )}
        />
      </div>
    </div>
  );
};

export default Login;
