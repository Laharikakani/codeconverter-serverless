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
  Icon,
  Divider
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { FaSignInAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaRobot, FaArrowRight, FaUserCircle } from 'react-icons/fa';
import { signIn, signOut } from 'aws-amplify/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validate input fields
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // Sign out any existing session before signing in
      await signOut();
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');

      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password,
      });

      if (isSignedIn) {
        // Don't show success message, just redirect
        localStorage.setItem('token', 'dummy-token');
        sessionStorage.setItem('user', JSON.stringify({ email }));
        navigate('/welcome');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      if (error.message.includes('User does not exist')) {
        setError('No account found with this email');
      } else if (error.message.includes('Incorrect username or password')) {
        setError('Incorrect email or password');
      } else if (error.message.includes('User is not confirmed')) {
        setError('Please verify your email before signing in');
      } else {
        setError(error.message || 'Error signing in. Please try again.');
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
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      }}
    >
      <Card
        variation="elevated"
        padding="1.5rem"
        width="100%"
        maxWidth="400px"
        style={{
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <Flex direction="column" gap="1.5rem">
          <Flex direction="column" alignItems="center" gap="0.75rem">
            <View
              width="60px"
              height="60px"
              backgroundColor="#0078d4"
              borderRadius="15px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{
                boxShadow: '0 6px 12px rgba(0, 120, 212, 0.3)',
                transform: 'rotate(-5deg)',
              }}
            >
              <FaRobot size={30} color="white" />
            </View>
            <Heading
              level={1}
              style={{
                background: 'linear-gradient(45deg, #0078d4, #00b7ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '2rem',
                fontWeight: '800',
                letterSpacing: '0.5px',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                textAlign: 'center',
              }}
            >
              Welcome Back
            </Heading>
            <Text
              style={{
                color: tokens.colors.font.secondary,
                fontSize: '1rem',
                textAlign: 'center',
                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                maxWidth: '80%',
              }}
            >
              
            </Text>
          </Flex>

          {error && (
            <Alert variation="error" isDismissible={true} style={{ borderRadius: '8px', backgroundColor: 'rgba(211, 47, 47, 0.1)', border: '1px solid rgba(211, 47, 47, 0.3)' }}>
              <Text fontWeight="bold" style={{ color: '#d32f2f' }}>{error}</Text>
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <Flex direction="column" gap="1.25rem">
              <View>
                <Text
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#0078d4',
                    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                    marginBottom: '0.4rem',
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
                  borderColor={isFocused ? "#0078d4" : "#e0e0e0"}
                  borderRadius="8px"
                  padding="0.6rem"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
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
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#0078d4',
                    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                    marginBottom: '0.4rem',
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
                  placeholder="Enter your password"
                  size="default"
                  backgroundColor="white"
                  borderColor={isFocused ? "#0078d4" : "#e0e0e0"}
                  borderRadius="8px"
                  padding="0.6rem"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
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
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#0078d4',
                    padding: '0.5rem',
                  }}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </Button>
              </View>

              <Button
                type="submit"
                variation="primary"
                isLoading={isLoading}
                loadingText="Signing In..."
                backgroundColor="#0078d4"
                color="white"
                size="large"
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 4px 8px rgba(0, 120, 212, 0.3)',
                  transition: 'all 0.3s ease',
                  marginTop: '0.5rem',
                  ':hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px rgba(0, 120, 212, 0.4)',
                  },
                }}
              >
                <FaSignInAlt size={18} /> Sign In <FaArrowRight size={16} />
              </Button>
            </Flex>
          </form>

          <Divider size="small" />

          <Flex justifyContent="center" alignItems="center" gap="0.5rem">
            <Text style={{ 
              color: tokens.colors.font.secondary, 
              fontFamily: "'Poppins', 'Segoe UI', sans-serif",
              fontSize: '1rem',
            }}>
              Don't have an account?
            </Text>
            <Button
              variation="link"
              onClick={() => navigate('/signup')}
              style={{
                color: '#0078d4',
                fontWeight: 'bold',
                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                fontSize: '1rem',
                ':hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Sign Up
            </Button>
          </Flex>
        </Flex>
      </Card>
    </View>
  );
};

export default LoginPage; 