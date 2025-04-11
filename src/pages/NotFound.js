import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Flex,
  Heading,
  Text,
  View,
  useTheme
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const NotFound = () => {
  const navigate = useNavigate();
  const { tokens } = useTheme();

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
        <Flex direction="column" gap="1.5rem" alignItems="center">
          <Heading level={1} textAlign="center">
            404 - Page Not Found
          </Heading>
          
          <Text fontSize="1.2rem" textAlign="center">
            The page you are looking for does not exist or has been moved.
          </Text>
          
          <Button
            variation="primary"
            size="large"
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>
        </Flex>
      </Card>
    </View>
  );
};

export default NotFound;
