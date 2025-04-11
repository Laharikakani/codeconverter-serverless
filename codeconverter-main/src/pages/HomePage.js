import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Flex,
  Heading,
  Text,
  View,
  Badge,
  useTheme
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { tokens } = useTheme();

  // Fallback colors in case tokens are undefined
  const colors = {
    background: '#f5f5f5',
    primary: '#0078d4',
    white: '#ffffff',
    text: '#666666'
  };

  const features = [
    {
      icon: '⚡',
      title: 'Fast Conversion',
      description: 'Get instant code translations with our optimized AI models'
    },
    {
      icon: '🔒',
      title: 'Privacy Focused',
      description: 'Your code never leaves your browser during processing'
    },
    {
      icon: '🔄',
      title: 'Multi-language',
      description: 'Support for all major programming languages and frameworks'
    }
  ];

  const supportedLanguages = [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C#', 
    'C++', 'Go', 'Rust', 'PHP', 'Ruby', 
    'Swift', 'Kotlin', 'Dart', 'Scala', 'R'
  ];

  const handleLogin = () => {
    navigate('/login');
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
            <Text fontSize="3rem" color={colors.white}>💻</Text>
          </View>
          
          <Heading level={1} color={colors.primary} textAlign="center">
            AI Code Converter
          </Heading>
          
          <Text fontSize="1.2rem" textAlign="center" color={colors.text}>
            Transform your code between different programming languages with the power of AI
          </Text>
          
          <Button 
            variation="primary" 
            size="large" 
            onClick={handleLogin}
            backgroundColor={colors.primary}
            color={colors.white}
            width="200px"
            style={{ 
              padding: '0.75rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            Login to Start
          </Button>
          
          <Text fontSize="1rem" color={colors.text}>
            Don't have an account? {' '}
            <Button
              variation="link"
              onClick={() => navigate('/signup')}
              style={{ padding: 0 }}
            >
              Sign up
            </Button>
          </Text>
        </Flex>
      </Card>
    </View>
  );
};

export default HomePage;