import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Flex,
  Heading,
  Text,
  View,
  TextField,
  Alert
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const colors = {
    background: '#f5f5f5',
    primary: '#0078d4',
    white: '#ffffff',
    text: '#666666',
    error: '#d13212'
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate email format
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Make API call to authenticate
      const response = await fetch('https://7fmhg0usa0.execute-api.us-east-1.amazonaws.com/newstage/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Invalid email or password');
        } else if (response.status === 403) {
          throw new Error('Account is locked. Please contact support.');
        } else if (data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Login failed. Please try again.');
        }
      }

      // Store the token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        // Store user info if provided
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        // Navigate to the welcome page
        navigate('/welcome');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      padding="2rem"
      minHeight="100vh"
      backgroundColor={colors.background}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card
        variation="elevated"
        padding="2rem"
        width="100%"
        maxWidth="400px"
        backgroundColor={colors.white}
        borderRadius="12px"
      >
        <form onSubmit={handleLogin}>
          <Flex direction="column" gap="1.5rem">
            <Heading level={1} color={colors.primary} textAlign="center">
              Login
            </Heading>

            {error && (
              <Alert variation="error">
                {error}
              </Alert>
            )}

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              variation="primary"
              isLoading={isLoading}
              loadingText="Logging in..."
              backgroundColor={colors.primary}
              color={colors.white}
              width="100%"
            >
              Login
            </Button>

            <Flex justifyContent="center" alignItems="center">
              <Button
                variation="link"
                onClick={() => navigate('/signup')}
                color={colors.primary}
              >
                Create Account
              </Button>
            </Flex>
          </Flex>
        </form>
      </Card>
    </View>
  );
};

export default LoginPage; 