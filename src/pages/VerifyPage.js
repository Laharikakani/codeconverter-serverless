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
  Divider
} from '@aws-amplify/ui-react';
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
      const response = await fetch('https://1m1rplv9ze.execute-api.us-east-1.amazonaws.com/newstage/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }
      
      setSuccess('Email verified successfully! Redirecting to login...');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
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
          email,
          resend: true,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend code');
      }
      
      setSuccess('Verification code resent successfully! Please check your email.');
      
      // Disable resend button for 60 seconds
      setResendDisabled(true);
      setCountdown(60);
    } catch (error) {
      console.error('Resend code error:', error);
      setError(error.message || 'Failed to resend code. Please try again.');
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
            Verify Your Email
          </Heading>
          
          <Text textAlign="center">
            We've sent a verification code to <strong>{email}</strong>. Please enter it below to verify your account.
          </Text>
          
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
          
          <form onSubmit={handleVerify}>
            <Flex direction="column" gap="1rem">
              <TextField
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter the verification code"
                required
              />
              
              <Button
                type="submit"
                variation="primary"
                size="large"
                isLoading={isLoading}
                loadingText="Verifying..."
                width="100%"
              >
                Verify
              </Button>
            </Flex>
          </form>
          
          <Divider />
          
          <Flex direction="column" gap="0.5rem" alignItems="center">
            <Text>Didn't receive a code?</Text>
            <Button
              variation="link"
              onClick={handleResendCode}
              isLoading={isLoading}
              loadingText="Resending..."
              isDisabled={resendDisabled}
            >
              {resendDisabled 
                ? `Resend code in ${countdown} seconds` 
                : "Resend verification code"}
            </Button>
          </Flex>
          
          <Button
            variation="link"
            onClick={() => navigate('/signup')}
          >
            Back to Sign Up
          </Button>
        </Flex>
      </Card>
    </View>
  );
};

export default VerifyPage; 