import React, { useState } from 'react';
import {
  Container,
  Card,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Alert
} from '@mui/material';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = '/login';
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
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
              Create your account to get started
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" sx={{ mt: 3 }} onSubmit={handleSignup} autoComplete="off">
            <TextField
              fullWidth
              label="Name"
              placeholder={name ? '' : 'Name'}
              margin="normal"
              required
              variant="filled"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <TextField
              fullWidth
              label="Email"
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
              InputLabelProps={{
                style: { color: 'var(--muted)' }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
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
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              placeholder={confirmPassword ? '' : 'Confirm Password'}
              margin="normal"
              required
              variant="filled"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 3, color: 'var(--muted)' }}>
              Already have an account?{' '}
              <Link href="/login" underline="hover" sx={{ color: 'var(--cyan)', fontWeight: 700 }}>
                Login
              </Link>
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
