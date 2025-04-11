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
      // Here you would typically make an API call to authenticate
      // For now, we'll simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store the token in localStorage
      localStorage.setItem('token', 'dummy-token');
      
      // Navigate to the welcome page
      navigate('/welcome');
    } catch (err) {
      setError('Invalid email or password');
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

            <Flex justifyContent="space-between" alignItems="center">
              <Button
                variation="link"
                onClick={() => navigate('/signup')}
                color={colors.primary}
              >
                Create Account
              </Button>
              <Button
                variation="link"
                onClick={() => navigate('/forgot-password')}
                color={colors.primary}
              >
                Forgot Password?
              </Button>
            </Flex>
          </Flex>
        </form>
      </Card>
    </View>
  );
};

export default LoginPage; 