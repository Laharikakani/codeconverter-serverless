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
  Alert,
  Icon,
  Divider
} from '@aws-amplify/ui-react';
import { MdPerson, MdEmail, MdLock, MdArrowForward } from 'react-icons/md';
import { FaGoogle, FaGithub } from 'react-icons/fa';
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
      // First try to connect to the API
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
        throw new Error(data.message || 'Signup failed. Please try again.');
      }
      
      // Only store in localStorage if API call succeeds
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Check if user already exists
      if (registeredUsers.some(user => user.email === email)) {
        throw new Error('An account with this email already exists. Please login instead.');
      }
      
      // Add the new user to the list
      registeredUsers.push({
        name,
        email,
        password,
        createdAt: new Date().toISOString()
      });
      
      // Save the updated list
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
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
      <Card 
        variation="elevated" 
        padding="2.5rem" 
        width="100%" 
        maxWidth="500px"
        borderRadius="16px"
        boxShadow="0 8px 24px rgba(0, 0, 0, 0.12)"
      >
        <Flex direction="column" gap="2rem">
          <Flex direction="column" alignItems="center" gap="0.5rem">
            <Heading level={1} textAlign="center" fontSize="2.5rem" fontWeight="700">
              Create Account
            </Heading>
            <Text textAlign="center" color={tokens.colors.font.secondary}>
              Join our community of developers
            </Text>
          </Flex>
          
          {error && (
            <Alert variation="error" isDismissible={true} borderRadius="8px">
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variation="success" isDismissible={true} borderRadius="8px">
              {success}
            </Alert>
          )}
          
          <form onSubmit={handleSignup}>
            <Flex direction="column" gap="1.5rem">
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                size="large"
                borderRadius="8px"
                leftIcon={<Icon as={MdPerson} />}
              />
              
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                size="large"
                borderRadius="8px"
                leftIcon={<Icon as={MdEmail} />}
              />
              
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                size="large"
                borderRadius="8px"
                leftIcon={<Icon as={MdLock} />}
              />
              
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                size="large"
                borderRadius="8px"
                leftIcon={<Icon as={MdLock} />}
              />
              
              <Button
                type="submit"
                variation="primary"
                size="large"
                isLoading={isLoading}
                loadingText="Creating account..."
                width="100%"
                borderRadius="8px"
                height="48px"
                fontSize="1.1rem"
                fontWeight="600"
                rightIcon={<Icon as={MdArrowForward} />}
              >
                Sign Up
              </Button>
            </Flex>
          </form>
          
          <Divider />
          
          <Flex direction="column" gap="1rem">
            <Text textAlign="center" color={tokens.colors.font.secondary}>
              Or sign up with
            </Text>
            <Flex gap="1rem" justifyContent="center">
              <Button
                variation="outline"
                size="large"
                borderRadius="8px"
                leftIcon={<Icon as={FaGoogle} />}
                width="100%"
                height="48px"
              >
                Google
              </Button>
              <Button
                variation="outline"
                size="large"
                borderRadius="8px"
                leftIcon={<Icon as={FaGithub} />}
                width="100%"
                height="48px"
              >
                GitHub
              </Button>
            </Flex>
          </Flex>
          
          <Flex justifyContent="center" gap="0.5rem">
            <Text color={tokens.colors.font.secondary}>Already have an account?</Text>
            <Link 
              to="/login" 
              style={{ 
                color: tokens.colors.brand.primary[100],
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Login
            </Link>
          </Flex>
        </Flex>
      </Card>
    </View>
  );
};

export default SignupPage; 