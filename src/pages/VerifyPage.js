import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Divider,
  Icon
} from '@aws-amplify/ui-react';
import { MdEmail, MdLock, MdArrowForward, MdRefresh } from 'react-icons/md';
import { confirmSignUp, resendSignUpCode, signOut } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';

const VerifyPage = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { tokens } = useTheme();

  useEffect(() => {
    // Get the email from the location state
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      // If no email in state, redirect to signup
      navigate('/signup');
    }
  }, [location, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Confirm sign up with Cognito
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: verificationCode
      });
      
      // Sign out any existing session
      try {
        await signOut();
        // Clear any stored tokens or user data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.clear();
      } catch (signOutError) {
        console.log('Sign out error (can be ignored):', signOutError);
      }
      
      setSuccess('Email verified successfully! Redirecting to login...');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login', { state: { email } });
      }, 2000);
    } catch (error) {
      console.error('Verification error:', error);
      
      // Handle specific Cognito errors
      if (error.name === 'CodeMismatchException') {
        setError('Invalid verification code. Please check and try again.');
      } else if (error.name === 'ExpiredCodeException') {
        setError('Verification code has expired. Please request a new one.');
      } else {
        setError(error.message || 'Verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Resend confirmation code with Cognito
      const { isSignUpComplete } = await resendSignUpCode({
        username: email
      });
      
      setSuccess('Verification code resent successfully! Please check your email.');
      
      // Disable resend button for 60 seconds
      setResendDisabled(true);
      setCountdown(60);
    } catch (error) {
      console.error('Resend code error:', error);
      
      // Handle specific Cognito errors
      if (error.name === 'LimitExceededException') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError(error.message || 'Failed to resend code. Please try again.');
      }
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
              Verify Your Email
            </Heading>
            <Text textAlign="center" color={tokens.colors.font.secondary}>
              We've sent a verification code to <strong>{email}</strong>
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
          
          <form onSubmit={handleVerify}>
            <Flex direction="column" gap="1.5rem">
              <TextField
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter the verification code"
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
                loadingText="Verifying..."
                width="100%"
                borderRadius="8px"
                height="48px"
                fontSize="1.1rem"
                fontWeight="600"
                rightIcon={<Icon as={MdArrowForward} />}
              >
                Verify Email
              </Button>
            </Flex>
          </form>
          
          <Divider />
          
          <Flex direction="column" gap="1rem" alignItems="center">
            <Text color={tokens.colors.font.secondary}>
              Didn't receive a code?
            </Text>
            <Button
              variation="outline"
              onClick={handleResendCode}
              isLoading={isLoading}
              loadingText="Resending..."
              isDisabled={resendDisabled}
              borderRadius="8px"
              height="48px"
              leftIcon={<Icon as={MdRefresh} />}
              width="100%"
              maxWidth="300px"
            >
              {resendDisabled 
                ? `Resend code in ${countdown}s` 
                : "Resend verification code"}
            </Button>
          </Flex>
        </Flex>
      </Card>
    </View>
  );
};

export default VerifyPage; 