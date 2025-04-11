import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
  View,
  useTheme,
  Alert
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { tokens } = useTheme();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('https://7fmhg0usa0.execute-api.us-east-1.amazonaws.com/newstage/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Check if the error is due to user already existing
        if (data.message && (
          data.message.toLowerCase().includes('already exists') || 
          data.message.toLowerCase().includes('already registered') ||
          data.message.toLowerCase().includes('user exists')
        )) {
          throw new Error('An account with this email already exists. Please login instead.');
        }
        throw new Error(data.message || 'Signup failed');
      }
      
      setSuccess('Account created successfully! A verification code has been sent to your email.');
      
      // Redirect to the verify page with the email after a short delay
      setTimeout(() => {
        navigate('/verify', { state: { email } });
      }, 2000);
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      padding="2rem"
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      backgroundColor={tokens.colors.background.secondary}
    >
      <Card variation="elevated" padding="2rem" width="100%" maxWidth="500px">
        <Flex direction="column" gap="1.5rem">
          <Heading level={1} textAlign="center">
            Sign Up
          </Heading>
          
          {error && (
            <Alert variation="error" isDismissible={true}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variation="success" isDismissible={true}>
              {success}
            </Alert>
          )}
          
          <form onSubmit={handleSignup}>
            <Flex direction="column" gap="1rem">
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
              
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
              
              <Button
                type="submit"
                variation="primary"
                size="large"
                isLoading={isLoading}
                loadingText="Signing up..."
                width="100%"
              >
                Sign Up
              </Button>
            </Flex>
          </form>
          
          <Flex justifyContent="center" gap="0.5rem">
            <Text>Already have an account?</Text>
            <Link to="/login" style={{ color: '#0078d4' }}>
              Login
            </Link>
          </Flex>
        </Flex>
      </Card>
    </View>
  );
};

export default SignupPage; 