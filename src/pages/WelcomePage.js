import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Flex,
  Heading,
  Text,
  View
} from '@aws-amplify/ui-react';
import { signOut } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  const colors = {
    background: '#f5f5f5',
    primary: '#0078d4',
    white: '#ffffff',
    text: '#666666'
  };

  const handleStartConverting = () => {
    navigate('/editor');
  };

  const handleLogout = async () => {
    try {
      // Sign out from Cognito
      await signOut();
      
      // Clear all local storage and session storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Navigate to home page
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if there's an error, clear local data and redirect
      localStorage.clear();
      sessionStorage.clear();
      navigate('/', { replace: true });
    }
  };

  return (
    <View
      padding="2rem"
      minHeight="100vh"
      backgroundColor={colors.background}
    >
      <Flex direction="column" alignItems="center" gap="2rem">
        {/* Header with Logout */}
        <Flex width="100%" maxWidth="1200px" justifyContent="flex-end">
          <Button
            variation="link"
            onClick={handleLogout}
            color={colors.primary}
          >
            Logout
          </Button>
        </Flex>

        {/* Welcome Card */}
        <Card
          variation="elevated"
          padding="3rem"
          width="100%"
          maxWidth="600px"
          backgroundColor={colors.white}
          borderRadius="12px"
        >
          <Flex direction="column" alignItems="center" gap="2rem">
            <View
              width="100px"
              height="100px"
              borderRadius="50%"
              backgroundColor={colors.primary}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="3rem" color={colors.white}>👋</Text>
            </View>

            <Heading level={1} color={colors.primary} textAlign="center">
              Welcome to AI Code Converter
            </Heading>

            <Text fontSize="1.2rem" textAlign="center" color={colors.text}>
              You're all set! Ready to start converting code between different programming languages?
            </Text>

            <Button
              variation="primary"
              size="large"
              onClick={handleStartConverting}
              backgroundColor={colors.primary}
              color={colors.white}
              width="200px"
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              Start Converting
            </Button>
          </Flex>
        </Card>
      </Flex>
    </View>
  );
};

export default WelcomePage; 