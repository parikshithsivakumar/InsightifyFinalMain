import React, { useState } from 'react';
import {
  Container,
  Card,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Assuming you have a CSS file for styles

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-bg">
      <Container
        maxWidth="xs"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card
          className="login-card"
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            boxShadow: 10,
            bgcolor: 'rgba(17,34,64,0.95)',
            border: '2.5px solid var(--cyan)',
            color: 'var(--white)',
            minWidth: { xs: '90vw', sm: 400 },
            maxWidth: 420,
            mx: 'auto',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography
              variant="h4"
              className="logo"
              sx={{
                fontWeight: 900,
                letterSpacing: -1,
                mb: 1,
                fontSize: '2.2rem',
                background: 'linear-gradient(90deg, var(--cyan) 0%, var(--white) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Insightify
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'var(--muted)' }}>
              Welcome back! Please login to your account.
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleLogin} autoComplete="off">
           <TextField
              fullWidth
              placeholder={email ? '' : 'Email'}
              margin="normal"
              required
              variant="filled"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
              style: {
              background: 'rgba(10,25,47,0.92)',
               color: 'var(--white)',
              borderRadius: 10
    }
  }}
/>
            <TextField
              fullWidth
               placeholder={password ? '' : 'Password'}
              margin="normal"
              required
              variant="filled"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                style: {
                  background: 'rgba(10,25,47,0.92)',
                  color: 'var(--white)',
                  borderRadius: 10
                }
              }}
              InputLabelProps={{
                style: { color: 'var(--muted)' }
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              className="login-btn"
              sx={{
                mt: 2,
                py: 1.2,
                fontWeight: 700,
                fontSize: '1.1rem',
                background: 'var(--cyan)',
                color: 'var(--navy)',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(24,255,255,0.12)',
                '&:hover': {
                  background: 'var(--white)',
                  color: 'var(--navy)'
                }
              }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 3, color: 'var(--muted)' }}>
              Don't have an account?{' '}
              <Link href="/signup" underline="hover" sx={{ color: 'var(--cyan)', fontWeight: 700 }}>
                Sign Up
              </Link>
            </Typography>
          </form>
        </Card>
      </Container>
    </Box>
  );
}
