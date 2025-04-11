import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  Flex, 
  Grid, 
  Heading, 
  SelectField, 
  TextAreaField, 
  Text,
  View
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { convertCode, getSupportedLanguages } from '../utils/api';

const CodeConverter = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('python');
  const [convertedCode, setConvertedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languages = await getSupportedLanguages();
        setSupportedLanguages(languages);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchLanguages();
  }, []);

  const handleConvert = async () => {
    if (!sourceCode.trim()) {
      setError('Please enter some code to convert');
      setSuccess('');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await convertCode(sourceCode, targetLanguage);
      setConvertedCode(response.convertedCode);
      setSuccess('Code converted successfully!');
    } catch (error) {
      console.error('Error converting code:', error);
      setError('Failed to convert code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View padding="2rem" maxWidth="1200px" margin="0 auto">
      <Flex direction="column" gap="1.5rem">
        <Heading level={1} textAlign="center">
          AI Code Converter
        </Heading>
        
        <Card variation="elevated" padding="1.5rem">
          <Flex direction="column" gap="1rem">
            <TextAreaField
              label="Source Code"
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              placeholder="Enter your code here..."
              size="large"
              rows={10}
              fontFamily="monospace"
            />
            
            <SelectField
              label="Target Language"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
            >
              {supportedLanguages.length > 0 ? (
                supportedLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))
              ) : (
                <>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="cpp">C++</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                  <option value="swift">Swift</option>
                </>
              )}
            </SelectField>
            
            {error && (
              <Text color="red.500" fontWeight="bold">
                {error}
              </Text>
            )}
            
            {success && (
              <Text color="green.500" fontWeight="bold">
                {success}
              </Text>
            )}
            
            <Button
              variation="primary"
              size="large"
              onClick={handleConvert}
              isLoading={isLoading}
              loadingText="Converting..."
              width="100%"
            >
              Convert Code
            </Button>
          </Flex>
        </Card>
        
        {convertedCode && (
          <Card variation="elevated" padding="1.5rem">
            <Flex direction="column" gap="1rem">
              <Heading level={2}>
                Converted Code
              </Heading>
              <View
                padding="1rem"
                backgroundColor="gray.50"
                borderRadius="medium"
                fontFamily="monospace"
                whiteSpace="pre-wrap"
                overflowX="auto"
              >
                <Text>{convertedCode}</Text>
              </View>
            </Flex>
          </Card>
        )}
      </Flex>
    </View>
  );
};

export default CodeConverter; 