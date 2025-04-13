import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Flex,
  Heading,
  Text,
  View,
  Badge,
  useTheme,
  Divider,
  Icon
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { FaCode, FaRobot, FaArrowRight, FaLock, FaBolt, FaGlobe, FaShieldAlt, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  const { tokens } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Fallback colors in case tokens are undefined
  const colors = {
    background: '#f5f7fa',
    primary: '#0078d4',
    secondary: '#00b7ff',
    white: '#ffffff',
    text: '#333333',
    lightText: '#666666',
    border: '#e0e0e0'
  };

  const features = [
    {
      icon: <FaBolt size={10} />,
      title: ''
    },
    {
      icon: <FaShieldAlt size={10} />,
      title: ''
    },
    {
      icon: <FaGlobe size={10} />,
      title: ''
    }
  ];

  const supportedLanguages = [
    'Python', 'JavaScript', 'Java', 'C#', 
     'Go', 'Rust', 'PHP', 
    'Swift'
  ];

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <View 
      padding="1.5rem" 
      minHeight="100vh" 
      backgroundColor={colors.background}
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      }}
    >
      <Card 
        variation="elevated" 
        padding="2rem" 
        width="100%" 
        maxWidth="800px"
        backgroundColor={colors.white}
        borderRadius="16px"
        style={{
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
        }}
      >
        <Flex direction="column" alignItems="center" gap="1.5rem">
          <View 
            width="100px" 
            height="100px" 
            borderRadius="25px" 
            backgroundColor={colors.primary}
            display="flex" 
            justifyContent="center" 
            alignItems="center"
            style={{
              boxShadow: '0 8px 16px rgba(0, 120, 212, 0.3)',
              transform: 'rotate(-5deg)',
            }}
          >
            <FaRobot size={40} color={colors.white} />
          </View>
          
          <Flex direction="column" alignItems="center" gap="0.5rem">
            <Heading 
              level={1} 
              textAlign="center"
              style={{
                background: 'linear-gradient(45deg, #0078d4, #00b7ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '2.5rem',
                fontWeight: '800',
                letterSpacing: '0.5px',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
              }}
            >
              AI Code Converter
            </Heading>
            
            <Text 
              fontSize="1.1rem" 
              textAlign="center" 
              color={colors.lightText}
              style={{
                maxWidth: '80%',
                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                lineHeight: '1.4',
              }}
            >
              Transform your code between different programming languages with the power of AI
            </Text>
          </Flex>
          
          <Flex 
            direction="row" 
            justifyContent="center" 
            gap="0.5rem"
            wrap="wrap"
            width="100%"
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                variation="elevated"
                padding="0.5rem"
                width="100%"
                maxWidth="50px"
                backgroundColor={colors.white}
                borderRadius="8px"
                style={{
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(0, 120, 212, 0.1)',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 8px rgba(0, 120, 212, 0.15)',
                  }
                }}
              >
                <Flex direction="column" alignItems="center" justifyContent="center">
                  <View
                    width="25px"
                    height="25px"
                    borderRadius="6px"
                    backgroundColor="rgba(0, 120, 212, 0.1)"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    color={colors.primary}
                  >
                    {feature.icon}
                  </View>
                </Flex>
              </Card>
            ))}
          </Flex>
          
          <Flex 
            wrap="wrap" 
            justifyContent="center" 
            gap="0.5rem"
            maxWidth="600px"
          >
            {supportedLanguages.map((lang, index) => (
              <Badge 
                key={index} 
                variation="info" 
                backgroundColor="rgba(0, 120, 212, 0.1)"
                color={colors.primary}
                borderRadius="20px"
                padding="0.4rem 0.8rem"
                fontSize="0.85rem"
              >
                {lang}
              </Badge>
            ))}
          </Flex>
          
          <Flex 
            direction="column" 
            alignItems="center" 
            gap="1rem"
            width="100%"
          >
            <Button 
              variation="primary" 
              size="large" 
              onClick={handleLogin}
              backgroundColor={colors.primary}
              color={colors.white}
              width="200px"
              style={{ 
                padding: '0.5rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 3px 6px rgba(0, 120, 212, 0.3)',
                transition: 'all 0.3s ease',
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0, 120, 212, 0.4)',
                }
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <FaSignInAlt size={14} /> Login to Start {isHovered && <FaArrowRight size={12} />}
            </Button>
            
            <Text 
              fontSize="1rem" 
              color={colors.lightText}
              style={{
                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
              }}
            >
              Don't have an account? {' '}
              <Button
                variation="link"
                onClick={() => navigate('/signup')}
                style={{ 
                  padding: 0,
                  color: colors.primary,
                  fontWeight: 'bold',
                  fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                  fontSize: '1rem',
                  ':hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign up
              </Button>
            </Text>
          </Flex>
        </Flex>
      </Card>
    </View>
  );
};

export default HomePage;