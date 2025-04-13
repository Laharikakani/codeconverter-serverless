import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Icon
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { FaUserPlus, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import { signUp, signOut } from 'aws-amplify/auth';
import { navigateToVerify } from '../utils/navigation';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { tokens } = useTheme();

  useEffect(() => {
    // Sign out any existing session
    const checkUser = async () => {
      try {
        await signOut();
        localStorage.removeItem('token');
        sessionStorage.removeItem('user');
      } catch (error) {
        console.log('No user signed in');
      }
    };
    checkUser();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validate input fields
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      // Clear all cached data first
      await signOut();
      localStorage.clear();
      sessionStorage.clear();
      
      // Force a clean state
      setError('');
      setSuccess('');
      
      console.log('Attempting to sign up with email:', email);
      
      // Try to sign up the user
      const { isSignUpComplete, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            name,
            email,
          },
        },
      });
      
      console.log('Sign up response:', { isSignUpComplete, nextStep });

      // Store email in localStorage
      localStorage.setItem('pendingVerificationEmail', email);
      
      // Set success message
      setSuccess('Account created successfully! Please check your email for verification code.');
      
      // Force navigation to verify page after a short delay
      setTimeout(() => {
        console.log('Forcing navigation to verify page');
        navigate('/verify', { 
          state: { email },
          replace: true // Use replace to prevent back button issues
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error signing up:', error);
      
      if (error.message.includes('User already exists')) {
        console.log('User already exists error detected');
        
        // Instead of modifying the email, show a clear error message
        setError('An account with this email already exists. Please use a different email or try logging in.');
        
        // Clear the email field to make it easy to change
        setEmail('');
      } else if (error.message.includes('Password did not conform with policy')) {
        setError('Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters');
      } else {
        setError(error.message || 'Error signing up. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      padding="1rem"
      minHeight="100vh"
      backgroundColor={tokens.colors.background.secondary}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card
        variation="elevated"
        padding="2rem"
        width="100%"
        maxWidth="600px"
        style={{
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
        }}
      >
        <Flex direction="column" gap="1.5rem">
          <Flex direction="column" alignItems="center" gap="0.5rem">
            <View
              width="64px"
              height="64px"
              backgroundColor="#0078d4"
              borderRadius="16px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{
                boxShadow: '0 4px 8px rgba(0, 120, 212, 0.3)',
              }}
            >
              <FaUserPlus size={32} color="white" />
            </View>
            <Heading
              level={1}
              style={{
                background: 'linear-gradient(45deg, #0078d4, #00b7ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '2.2rem',
                fontWeight: '800',
                letterSpacing: '0.5px',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                textAlign: 'center',
              }}
            >
              Create Account
            </Heading>
            <Text
              style={{
                color: tokens.colors.font.secondary,
                fontSize: '1rem',
                textAlign: 'center',
                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
              }}
            >
              Join our code conversion platform
            </Text>
          </Flex>

          {error && (
            <Alert variation="error" isDismissible={true} style={{ borderRadius: '8px' }}>
              <Text fontWeight="bold">{error}</Text>
            </Alert>
          )}

          {success && (
            <Alert variation="success" isDismissible={true} style={{ borderRadius: '8px' }}>
              <Text fontWeight="bold">{success}</Text>
            </Alert>
          )}

          <form onSubmit={handleSignup}>
            <Flex direction="column" gap="0.75rem">
              <View>
                <Text
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#0078d4',
                    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                    marginBottom: '0.25rem',
                    display: 'block',
                    letterSpacing: '0.5px',
                  }}
                >
                  Full Name
                </Text>
                <TextField
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  size="default"
                  backgroundColor="white"
                  borderColor="#0078d4"
                  borderRadius="8px"
                  padding="0.5rem"
                  style={{ 
                    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease',
                    ':focus': {
                      borderColor: '#005a9e',
                      boxShadow: '0 0 0 2px rgba(0, 120, 212, 0.2)',
                    }
                  }}
                  startIcon={<FaUser color="#0078d4" size={16} />}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#0078d4',
                    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                    marginBottom: '0.25rem',
                    display: 'block',
                    letterSpacing: '0.5px',
                  }}
                >
                  Email Address
                </Text>
                <TextField
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  size="default"
                  backgroundColor="white"
                  borderColor="#0078d4"
                  borderRadius="8px"
                  padding="0.5rem"
                  style={{ 
                    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease',
                    ':focus': {
                      borderColor: '#005a9e',
                      boxShadow: '0 0 0 2px rgba(0, 120, 212, 0.2)',
                    }
                  }}
                  startIcon={<FaEnvelope color="#0078d4" size={16} />}
                />
              </View>

              <View position="relative">
                <Text
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#0078d4',
                    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                    marginBottom: '0.25rem',
                    display: 'block',
                    letterSpacing: '0.5px',
                  }}
                >
                  Password
                </Text>
                <TextField
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  size="default"
                  backgroundColor="white"
                  borderColor="#0078d4"
                  borderRadius="8px"
                  padding="0.5rem"
                  style={{ 
                    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease',
                    ':focus': {
                      borderColor: '#005a9e',
                      boxShadow: '0 0 0 2px rgba(0, 120, 212, 0.2)',
                    }
                  }}
                  startIcon={<FaLock color="#0078d4" size={16} />}
                />
                <Button
                  variation="link"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#0078d4',
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </View>

              <View position="relative">
                <Text
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#0078d4',
                    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                    marginBottom: '0.25rem',
                    display: 'block',
                    letterSpacing: '0.5px',
                  }}
                >
                  Confirm Password
                </Text>
                <TextField
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  size="default"
                  backgroundColor="white"
                  borderColor="#0078d4"
                  borderRadius="8px"
                  padding="0.5rem"
                  style={{ 
                    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease',
                    ':focus': {
                      borderColor: '#005a9e',
                      boxShadow: '0 0 0 2px rgba(0, 120, 212, 0.2)',
                    }
                  }}
                  startIcon={<FaLock color="#0078d4" size={16} />}
                />
              </View>

              <Button
                type="submit"
                variation="primary"
                isLoading={isLoading}
                loadingText="Creating Account..."
                backgroundColor="#0078d4"
                color="white"
                size="default"
                style={{
                  padding: '0.5rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 8px rgba(0, 120, 212, 0.3)',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px rgba(0, 120, 212, 0.4)',
                  },
                }}
              >
                <FaUserPlus /> Create Account
              </Button>
            </Flex>
          </form>

          <Flex justifyContent="center" alignItems="center" gap="0.5rem">
            <Text style={{ color: tokens.colors.font.secondary, fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}>
              Already have an account?
            </Text>
            <Button
              variation="link"
              onClick={() => navigate('/login')}
              style={{
                color: '#0078d4',
                fontWeight: 'bold',
                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                ':hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Sign In
            </Button>
          </Flex>
        </Flex>
      </Card>
    </View>
  );
};

export default SignupPage; 