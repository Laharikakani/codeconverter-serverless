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

      // Check if the user has signed up
      try {
        // First, check if we have any registered users in localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        // Find the user with matching email
        const user = registeredUsers.find(u => u.email === email);
        
        if (!user) {
          throw new Error('No account found with this email. Please sign up first.');
        }
        
        // Check if the password matches
        if (user.password !== password) {
          throw new Error('Invalid password. Please try again.');
        }
        
        // If we get here, the credentials are valid
        console.log('Login successful for user:', email);
        
        // Store the token and user info
        localStorage.setItem('token', 'user-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify({
          email: user.email,
          name: user.name,
          role: 'user'
        }));
        
        // Navigate to the welcome page
        navigate('/welcome');
        
      } catch (checkError) {
        // If the error is about no account found or invalid password, show that error
        if (checkError.message.includes('No account found') || 
            checkError.message.includes('Invalid password')) {
          throw checkError;
        }
        
        // For other errors, try the API as a fallback
        console.log('Local check failed, trying API...');
        
        // Try to connect to the API
        const response = await fetch('https://7fmhg0usa0.execute-api.us-east-1.amazonaws.com/newstage/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Invalid email or password. Please sign up first.');
        }
        
        const data = await response.json();
        
        // Store the token and user info from the API
        localStorage.setItem('token', data.token || 'api-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify(data.user || {
          email: email,
          name: email.split('@')[0],
          role: 'user'
        }));
        
        // Navigate to the welcome page
        navigate('/welcome');
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