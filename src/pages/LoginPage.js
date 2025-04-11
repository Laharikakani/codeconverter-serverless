import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Button,
  Card,
  Flex,
  Heading,
  Text,
  View,
  TextField,
  Alert,
  useTheme,
  Icon
} from '@aws-amplify/ui-react';
import { MdEmail, MdLock, MdArrowForward } from 'react-icons/md';
import { signIn, getCurrentUser, signOut } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { tokens } = useTheme();

  // Check if user is already signed in and get email from location state
  useEffect(() => {
    const checkUser = async () => {
      try {
        // First, try to sign out any existing session
        try {
          await signOut();
          // Clear any stored tokens or user data
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          sessionStorage.clear();
        } catch (signOutError) {
          console.log('Sign out error (can be ignored):', signOutError);
        }

        // Get email from location state if available
        if (location.state && location.state.email) {
          setEmail(location.state.email);
        }
      } catch (err) {
        console.error('Error checking user:', err);
      }
    };
    
    checkUser();
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
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

      // Sign in with Cognito
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password
      });
      
      if (isSignedIn) {
        setSuccess('Login successful! Redirecting...');
        
        // Get the current user and store token
        try {
          const user = await getCurrentUser();
          if (user) {
            // Store token in localStorage for protected routes
            localStorage.setItem('token', 'authenticated');
            
            // Navigate to welcome page
            navigate('/welcome', { replace: true });
          } else {
            throw new Error('Authentication failed');
          }
        } catch (authError) {
          console.error('Auth verification error:', authError);
          setError('Authentication failed. Please try again.');
        }
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_CODE') {
        // Handle MFA if needed
        navigate('/confirm-signin', { state: { email } });
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle specific Cognito errors
      if (err.name === 'UserNotConfirmedException') {
        setError('Your account is not verified. Please check your email for the verification code.');
        // Redirect to verify page
        navigate('/verify', { state: { email } });
      } else if (err.name === 'NotAuthorizedException') {
        setError('Incorrect username or password.');
      } else if (err.name === 'UserNotFoundException') {
        setError('No account found with this email. Please sign up first.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      padding="2rem"
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
        maxWidth="400px"
        backgroundColor={tokens.colors.background.primary}
        borderRadius="12px"
      >
        <form onSubmit={handleLogin}>
          <Flex direction="column" gap="1.5rem">
            <Heading level={1} color={tokens.colors.brand.primary[100]} textAlign="center">
              Login
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

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              leftIcon={<Icon as={MdEmail} />}
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              leftIcon={<Icon as={MdLock} />}
            />

            <Button
              type="submit"
              variation="primary"
              isLoading={isLoading}
              loadingText="Logging in..."
              width="100%"
              rightIcon={<Icon as={MdArrowForward} />}
            >
              Login
            </Button>

            <Flex justifyContent="center" alignItems="center">
              <Button
                variation="link"
                onClick={() => navigate('/signup')}
                color={tokens.colors.brand.primary[100]}
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