import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  SelectField,
  Text,
  View,
  useTheme,
  Alert,
  TextAreaField,
  Badge,
  Input,
  TextArea,
  Icon
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Editor from '@monaco-editor/react';
import { FaCode, FaExchangeAlt, FaCopy, FaMicrophone, FaStop, FaPlay, FaPause, FaSignOutAlt, FaRobot, FaLanguage, FaCog, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import FileUpload from '../components/FileUpload';

const CodeEditorPage = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('javascript');
  const [targetLanguage, setTargetLanguage] = useState('python');
  const [convertedCode, setConvertedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [rawResponse, setRawResponse] = useState(null);
  const [showRawResponse, setShowRawResponse] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState([
    'python', 'javascript', 'java', 'csharp', 
    'rust', 'php', 'ruby', 'swift'
  ]);
  const navigate = useNavigate();
  const { tokens } = useTheme();

  // Add language validation patterns
  const languagePatterns = {
    javascript: /function|const|let|var|if|else|for|while|return|class|import|export|console\.log/,
    python: /def|class|import|from|if|else|for|while|return|print|try|except/,
    java: /public|private|class|void|int|String|System\.out\.println|import/,
    cpp: /#include|using namespace|int main|cout|cin|class|struct/,
    csharp: /using|namespace|class|public|private|Console\.WriteLine|void|int/,
    php: /<?php|echo|function|class|if|else|for|while|return/,
    ruby: /def|class|module|require|if|else|for|while|puts/,
    swift: /import|class|struct|func|var|let|if|else|for|while|print/,
    kotlin: /fun|class|import|if|else|for|while|println|val|var/,
    go: /package|import|func|if|else|for|range|fmt\.Println/,
    rust: /fn|pub|struct|impl|if|else|for|while|println!/,
    typescript: /interface|type|function|const|let|var|if|else|for|while|return|class|import|export/,
    sql: /SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN|GROUP BY|ORDER BY/,
    html: /<html|<head|<body|<div|<span|<p|<h1|<a|<img/,
    css: /{.*}|@media|@keyframes|:hover|:active|:focus|margin|padding|color|background/
  };

  // Add function to validate code against selected language
  const validateCodeLanguage = (code, language) => {
    if (!code.trim()) return true; // Empty code is considered valid
    const pattern = languagePatterns[language];
    if (!pattern) return true; // If no pattern exists for language, consider valid
    return pattern.test(code);
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleConvert = async () => {
    try {
      setError('');
      setSuccess('');
      setRawResponse(null);
      setIsLoading(true);

      // Validate code language
      if (!validateCodeLanguage(sourceCode, sourceLanguage)) {
        setError(`The code doesn't appear to be valid ${sourceLanguage.toUpperCase()} code. Please check your code or select the correct language.`);
        setIsLoading(false);
        return;
      }

      // Check if source and target languages are the same
      if (sourceLanguage === targetLanguage) {
        setError('Source and target languages are the same. No conversion needed.');
        setSuccess('');
        setIsLoading(false);
        return;
      }

      // Check if the code matches the selected source language
      if (!isCodeMatchingLanguage(sourceCode, sourceLanguage)) {
        setError(`The code you provided doesn't appear to be valid ${sourceLanguage} code. Please either change the source language or provide code in the selected language.`);
        setSuccess('');
        setIsLoading(false);
        return;
      }

      setCopySuccess('');
      setShowRawResponse(false);
      
      const token = localStorage.getItem('token');
      console.log('Sending request to API with:', {
        sourceCode: sourceCode.substring(0, 100) + (sourceCode.length > 100 ? '...' : ''),
        sourceLanguage,
        targetLanguage
      });
      
      // Create a request body with a body property as a string
      const requestBody = {
        body: JSON.stringify({
          sourceCode,
          sourceLanguage,
          targetLanguage,
        })
      };
      
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      // Create an AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // Increase timeout to 60 seconds
      
      const response = await fetch('https://96z52auad8.execute-api.us-east-1.amazonaws.com/newstage/codeconverter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      
      // Clear the timeout since the request completed
      clearTimeout(timeoutId);
      
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error response:', errorData);
        setRawResponse(JSON.stringify(errorData, null, 2));
        setShowRawResponse(true);
        
        // Handle the specific error about 'body'
        if (errorData.error === "'body'") {
          throw new Error('API Error: The request body format is incorrect. Please try again.');
        }
        
        throw new Error(errorData.message || 'Failed to convert code');
      }
      
      const data = await response.json();
      
      // Log the full response data to see what we're getting
      console.log('API Response data:', JSON.stringify(data, null, 2));
      
      // Store the raw response for debugging
      setRawResponse(JSON.stringify(data, null, 2));
      
      // Check if the converted code exists in the response
      if (data.convertedCode) {
        console.log('Found convertedCode in response');
        // Ensure the code is properly formatted with line breaks
        const formattedCode = formatCodeWithLineBreaks(data.convertedCode);
        setConvertedCode(formattedCode);
        setSuccess('Code converted successfully!');
      } else if (data.code) {
        console.log('Found code in response');
        const formattedCode = formatCodeWithLineBreaks(data.code);
        setConvertedCode(formattedCode);
        setSuccess('Code converted successfully!');
      } else if (data.result) {
        console.log('Found result in response');
        const formattedCode = formatCodeWithLineBreaks(data.result);
        setConvertedCode(formattedCode);
        setSuccess('Code converted successfully!');
      } else if (data.body && typeof data.body === 'string') {
        // Some APIs might wrap the response in a body field
        console.log('Found body string in response');
        const formattedCode = formatCodeWithLineBreaks(data.body);
        setConvertedCode(formattedCode);
        setSuccess('Code converted successfully!');
      } else if (data.body && typeof data.body === 'object') {
        // Some APIs might wrap the response in a body object
        console.log('Found body object in response');
        if (data.body.convertedCode) {
          const formattedCode = formatCodeWithLineBreaks(data.body.convertedCode);
          setConvertedCode(formattedCode);
          setSuccess('Code converted successfully!');
        } else if (data.body.code) {
          const formattedCode = formatCodeWithLineBreaks(data.body.code);
          setConvertedCode(formattedCode);
          setSuccess('Code converted successfully!');
        } else if (data.body.result) {
          const formattedCode = formatCodeWithLineBreaks(data.body.result);
          setConvertedCode(formattedCode);
          setSuccess('Code converted successfully!');
        } else {
          // If we can't find the converted code in the body object
          console.error('Unexpected API response format in body object:', data.body);
          setShowRawResponse(true);
          throw new Error('Failed to get converted code from API response');
        }
      } else {
        // If we can't find the converted code in the response
        console.error('Unexpected API response format:', data);
        
        // Try to extract any text content that might be the code
        const responseText = JSON.stringify(data);
        
        // First try to extract code from markdown code blocks
        if (responseText.includes('```')) {
          const codeMatch = responseText.match(/```[\s\S]*?```/g);
          if (codeMatch && codeMatch.length > 0) {
            // Extract the code from the first code block
            const extractedCode = codeMatch[0].replace(/```[\w]*\n/, '').replace(/\n```$/, '');
            console.log('Extracted code from markdown code block');
            const formattedCode = formatCodeWithLineBreaks(extractedCode);
            setConvertedCode(formattedCode);
            setSuccess('Code converted successfully!');
            return; // Exit the function after setting the code
          }
        }
        
        // Try to extract any code-like content from the response
        const codePattern = /"([^"]*)"|'([^']*)'/g;
        const matches = [...responseText.matchAll(codePattern)];
        
        if (matches.length > 0) {
          // Find the longest match that looks like code
          let longestMatch = '';
          for (const match of matches) {
            const content = match[1] || match[2] || '';
            if (content.length > longestMatch.length && 
                (content.includes('function') || 
                 content.includes('class') || 
                 content.includes('import') || 
                 content.includes('export') || 
                 content.includes('return') || 
                 content.includes('const') || 
                 content.includes('let') || 
                 content.includes('var') ||
                 content.includes('namespace') ||
                 content.includes('using') ||
                 content.includes('public') ||
                 content.includes('private') ||
                 content.includes('static') ||
                 content.includes('void') ||
                 content.includes('int') ||
                 content.includes('string') ||
                 content.includes('def') ||
                 content.includes('print') ||
                 content.includes('import') ||
                 content.includes('from'))) {
              longestMatch = content;
            }
          }
          
          if (longestMatch) {
            console.log('Extracted code from response text');
            const formattedCode = formatCodeWithLineBreaks(longestMatch);
            setConvertedCode(formattedCode);
            setSuccess('Code converted successfully!');
            return; // Exit the function after setting the code
          }
        }
        
        // If we still can't find code, try to extract any string that looks like code
        const stringPattern = /"([^"]{50,})"|'([^']{50,})'/g;
        const stringMatches = [...responseText.matchAll(stringPattern)];
        
        if (stringMatches.length > 0) {
          // Find the longest match
          let longestMatch = '';
          for (const match of stringMatches) {
            const content = match[1] || match[2] || '';
            if (content.length > longestMatch.length) {
              longestMatch = content;
            }
          }
          
          if (longestMatch) {
            console.log('Extracted potential code from response text');
            const formattedCode = formatCodeWithLineBreaks(longestMatch);
            setConvertedCode(formattedCode);
            setSuccess('Code converted successfully!');
            return; // Exit the function after setting the code
          }
        }
        
        // If all extraction attempts fail, show the raw response
        setShowRawResponse(true);
        throw new Error('Failed to get converted code from API response');
      }
    } catch (error) {
      console.error('Error converting code:', error);
      // Handle timeout errors specifically
      if (error.name === 'AbortError') {
        setError('Request timed out. The server is taking too long to respond. This is common for complex code conversions like Java to JavaScript. Please try again with a smaller code snippet or split your code into smaller parts.');
      } else {
        setError(error.message || 'Failed to convert code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (convertedCode) {
      navigator.clipboard.writeText(convertedCode)
        .then(() => {
          setCopySuccess('Code copied to clipboard!');
          setTimeout(() => setCopySuccess(''), 3000);
        })
        .catch(err => {
          console.error('Failed to copy code: ', err);
          setError('Failed to copy code to clipboard');
        });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleFileContent = (content) => {
    setSourceCode(content);
  };

  const handleLanguageDetected = (language) => {
    setSourceLanguage(language);
  };

  // Helper function to format code with proper line breaks
  const formatCodeWithLineBreaks = (code) => {
    if (!code) return '';
    
    // If the code is a JSON string with convertedCode property
    if (typeof code === 'string' && code.includes('{"convertedCode":')) {
      try {
        // Parse the JSON string
        const jsonData = JSON.parse(code);
        // Extract the convertedCode property
        if (jsonData.convertedCode) {
          return formatCodeWithLineBreaks(jsonData.convertedCode);
        }
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    }
    
    // If the code is already a string with line breaks, return it as is
    if (typeof code === 'string' && code.includes('\n')) {
      // Remove language name if it appears at the beginning of the code
      return removeLanguageName(code);
    }
    
    // If the code is a string with \n characters, replace them with actual line breaks
    if (typeof code === 'string' && code.includes('\\n')) {
      return removeLanguageName(code.replace(/\\n/g, '\n'));
    }
    
    // If the code is a string with backslashes at the end of each line
    if (typeof code === 'string' && code.includes('\\')) {
      // First, replace backslash followed by newline with just newline
      let formattedCode = code.replace(/\\\n/g, '\n');
      
      // Then, replace any remaining backslashes at the end of lines
      formattedCode = formattedCode.replace(/\\$/gm, '');
      
      // If there are still backslashes followed by spaces, remove them too
      formattedCode = formattedCode.replace(/\\\s+$/gm, '');
      
      // Handle the specific case where backslashes are at the end of each line
      formattedCode = formattedCode.replace(/\\\s*\n/g, '\n');
      
      // Remove the <|code_end|> marker if it exists
      formattedCode = formattedCode.replace(/<\|code_end\|>.*$/, '');
      
      return removeLanguageName(formattedCode);
    }
    
    // If the code is a string with tab characters, replace them with spaces
    if (typeof code === 'string') {
      // First replace \n with actual line breaks if they exist
      let formattedCode = code.replace(/\\n/g, '\n');
      
      // Then replace tab characters with spaces
      formattedCode = formattedCode.replace(/\t/g, '    ');
      
      // Special handling for C# code
      if (formattedCode.includes('namespace') || formattedCode.includes('using System;')) {
        // Ensure proper line breaks after semicolons
        formattedCode = formattedCode.replace(/;(?!\s*\n)/g, ';\n');
        
        // Ensure proper line breaks after curly braces
        formattedCode = formattedCode.replace(/{/g, '{\n');
        formattedCode = formattedCode.replace(/}/g, '\n}');
        
        // Ensure proper line breaks after namespace declarations
        formattedCode = formattedCode.replace(/namespace\s+([^{]+){/g, 'namespace $1\n{');
        
        // Ensure proper line breaks after class declarations
        formattedCode = formattedCode.replace(/class\s+([^{]+){/g, 'class $1\n{');
        
        // Ensure proper line breaks after method declarations
        formattedCode = formattedCode.replace(/(public|private|protected|internal|static)\s+([^{]+){/g, '$1 $2\n{');
        
        // Ensure proper line breaks after if/else/for/while statements
        formattedCode = formattedCode.replace(/(if|else|for|while|foreach)\s*\(([^)]+)\)\s*{/g, '$1 ($2)\n{');
        
        // Remove any double line breaks
        formattedCode = formattedCode.replace(/\n\s*\n/g, '\n');
      } else {
        // If there are no line breaks but there are semicolons, add line breaks after semicolons
        if (!formattedCode.includes('\n') && formattedCode.includes(';')) {
          formattedCode = formattedCode.split(';').map(line => line.trim()).join(';\n');
        }
        
        // If there are no line breaks but there are curly braces, add line breaks after curly braces
        if (!formattedCode.includes('\n') && (formattedCode.includes('{') || formattedCode.includes('}'))) {
          formattedCode = formattedCode
            .replace(/{/g, '{\n')
            .replace(/}/g, '\n}')
            .replace(/\n\s*\n/g, '\n'); // Remove empty lines
        }
      }
      
      // Remove the <|code_end|> marker if it exists
      formattedCode = formattedCode.replace(/<\|code_end\|>.*$/, '');
      
      // Remove any trailing blank lines at the end of the code
      formattedCode = formattedCode.replace(/\n+$/, '');
      
      return removeLanguageName(formattedCode);
    }
    
    // If the code is an array of lines, join them with line breaks
    if (Array.isArray(code)) {
      return removeLanguageName(code.join('\n'));
    }
    
    // If the code is an object, try to extract the code from it
    if (typeof code === 'object') {
      // Try to find a property that might contain the code
      const possibleCodeProperties = ['code', 'content', 'text', 'result', 'output', 'convertedCode'];
      for (const prop of possibleCodeProperties) {
        if (code[prop]) {
          return formatCodeWithLineBreaks(code[prop]);
        }
      }
      
      // If we can't find a property with the code, stringify the object
      return JSON.stringify(code, null, 2);
    }
    
    // If all else fails, convert to string
    return removeLanguageName(String(code));
  };
  
  // Helper function to remove language name from the beginning of the code
  const removeLanguageName = (code) => {
    if (!code) return '';
    
    // List of supported languages to check for
    const languages = [
      'python', 'javascript', 'java', 'csharp', 
      'rust', 'php', 'ruby', 'swift'
    ];
    
    // Check if the first line is just a language name
    const lines = code.split('\n');
    if (lines.length > 0) {
      const firstLine = lines[0].trim().toLowerCase();
      
      // If the first line is just a language name, remove it
      if (languages.includes(firstLine)) {
        return lines.slice(1).join('\n');
      }
      
      // Check for language name with backticks (markdown code block)
      if (firstLine.startsWith('```') && languages.includes(firstLine.slice(3).trim().toLowerCase())) {
        return lines.slice(1).join('\n');
      }
    }
    
    return code;
  };

  // Helper function to check if code matches the selected language
  const isCodeMatchingLanguage = (code, language) => {
    const languagePatterns = {
      python: [
        /def\s+\w+\s*\(/,
        /import\s+\w+/,
        /from\s+\w+\s+import/,
        /class\s+\w+:/,
        /if\s+__name__\s*==\s*('|")__main__('|"):/
      ],
      javascript: [
        /function\s+\w+\s*\(/,
        /const\s+\w+\s*=/,
        /let\s+\w+\s*=/,
        /var\s+\w+\s*=/,
        /class\s+\w+\s*{/,
        /import\s+.*from/,
        /export\s+/
      ],
      java: [
        /public\s+class/,
        /private\s+class/,
        /protected\s+class/,
        /class\s+\w+/,
        /public\s+static\s+void\s+main/
      ],
      csharp: [
        /namespace\s+\w+/,
        /using\s+\w+(\.\w+)*;/,
        /public\s+class/,
        /private\s+class/,
        /protected\s+class/
      ],
      rust: [
        /fn\s+\w+/,
        /use\s+\w+/,
        /pub\s+fn/,
        /impl\s+\w+/,
        /struct\s+\w+/
      ],
      php: [
        /<\?php/,
        /function\s+\w+\s*\(/,
        /class\s+\w+/,
        /namespace\s+\w+/,
        /use\s+\w+/
      ],
      ruby: [
        /def\s+\w+/,
        /class\s+\w+/,
        /module\s+\w+/,
        /require\s+('|")\w+('|")/,
        /include\s+\w+/
      ],
      swift: [
        /func\s+\w+/,
        /class\s+\w+/,
        /struct\s+\w+/,
        /import\s+\w+/,
        /var\s+\w+\s*:/,
        /let\s+\w+\s*:/,
        /guard\s+let/
      ]
    };
    // If we don't have patterns for this language, return true
    if (!languagePatterns[language]) {
      return true;
    }

    // Check if any of the patterns match
    const patterns = languagePatterns[language];
    for (const pattern of patterns) {
      if (pattern.test(code)) {
        return true;
      }
    }

    // If no patterns match, the code might not be in the selected language
    return false;
  };

  return (
    <View padding="1rem" minHeight="100vh" backgroundColor={tokens.colors.background.secondary}>
      <Flex direction="column" gap="1rem">
        {/* Enhanced Navigation Bar with Better Icons */}
        <Card
          variation="elevated"
          padding="1rem 2rem"
          backgroundColor="#ffffff"
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            marginBottom: '1rem'
          }}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center" gap="1rem">
              <View
                width="48px"
                height="48px"
                backgroundColor="#0078d4"
                borderRadius="12px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                style={{
                  boxShadow: '0 4px 8px rgba(0, 120, 212, 0.3)',
                  transition: 'transform 0.3s ease',
                  ':hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <FaRobot size={28} color="white" />
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
                  fontFamily: "'Poppins', 'Segoe UI', sans-serif"
                }}
              >
                AI Code Converter
              </Heading>
            </Flex>
            <Button
              variation="primary"
              onClick={handleLogout}
              backgroundColor="#f0f0f0"
              color="#333333"
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                ':hover': {
                  backgroundColor: '#e0e0e0',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <FaSignOutAlt /> Logout
            </Button>
          </Flex>
        </Card>
        
        {error && (
          <Alert variation="error" isDismissible={true} style={{ borderRadius: '8px' }}>
            <Flex alignItems="center" gap="0.5rem">
              <FaExclamationTriangle color="#d32f2f" />
              <Text fontWeight="bold">{error}</Text>
            </Flex>
          </Alert>
        )}
        
        {success && (
          <Alert variation="success" isDismissible={true} style={{ borderRadius: '8px' }}>
            <Flex alignItems="center" gap="0.5rem">
              <FaCheckCircle color="#4caf50" />
              <Text fontWeight="bold">{success}</Text>
            </Flex>
          </Alert>
        )}
        
        {copySuccess && (
          <Alert variation="success" isDismissible={true} style={{ borderRadius: '8px' }}>
            <Flex alignItems="center" gap="0.5rem">
              <FaCheckCircle color="#4caf50" />
              <Text fontWeight="bold">{copySuccess}</Text>
            </Flex>
          </Alert>
        )}
        
        <Card variation="elevated" padding="1.5rem" style={{ borderRadius: '12px' }}>
          <Flex direction="column" gap="1rem">
            <Heading level={3} style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif", color: '#0078d4' }}>
              <Flex alignItems="center" gap="0.5rem">
                <FaLanguage size={20} />
                <span>Select Languages</span>
              </Flex>
            </Heading>
            <Grid
              columnGap="1rem"
              rowGap="1rem"
              templateColumns={{ base: "1fr", medium: "1fr 1fr" }}
            >
              <SelectField
                label="Source Language"
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                size="small"
                width="150px"
                backgroundColor="#f0f0f0"
                borderColor="#0078d4"
                borderRadius="8px"
                padding="0.5rem"
                fontWeight="bold"
                style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </SelectField>
              
              <SelectField
                label="Target Language"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                size="small"
                width="150px"
                backgroundColor="#f0f0f0"
                borderColor="#0078d4"
                borderRadius="8px"
                padding="0.5rem"
                fontWeight="bold"
                style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </SelectField>
            </Grid>
          </Flex>
        </Card>
        
        <Grid
          columnGap="1rem"
          rowGap="1rem"
          templateColumns={{ base: "1fr", medium: "1fr 1fr" }}
        >
          <Card variation="elevated" padding="1.5rem" style={{ borderRadius: '12px' }}>
            <Flex direction="column" gap="1rem">
              <Heading level={2} style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif", color: '#0078d4' }}>
                <Flex alignItems="center" gap="0.5rem">
                  <FaCode size={20} />
                  <span>Source Code</span>
                </Flex>
              </Heading>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                marginBottom: '15px',
                padding: '5px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <FileUpload 
                  onFileContent={handleFileContent} 
                  onLanguageDetected={handleLanguageDetected}
                />
              </div>
              <Editor
                height="400px"
                defaultLanguage={sourceLanguage}
                value={sourceCode}
                onChange={setSourceCode}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  automaticLayout: true,
                }}
              />
            </Flex>
          </Card>
          
          <Card variation="elevated" padding="1.5rem" style={{ borderRadius: '12px' }}>
            <Flex direction="column" gap="1rem">
              <Flex justifyContent="space-between" alignItems="center">
                <Heading level={2} style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif", color: '#0078d4' }}>
                  <Flex alignItems="center" gap="0.5rem">
                    <FaCode size={20} />
                    <span>Converted Code</span>
                  </Flex>
                </Heading>
                {convertedCode && (
                  <Button
                    size="small"
                    onClick={handleCopyCode}
                    isDisabled={!convertedCode}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      borderRadius: '8px',
                      backgroundColor: '#f0f0f0',
                      color: '#333333',
                      fontWeight: 'bold'
                    }}
                  >
                    <FaCopy /> Copy
                  </Button>
                )}
              </Flex>
              <View height="300px" border="1px solid" borderColor="#d1d1d1" borderRadius="8px" overflow="hidden">
                <Editor
                  height="100%"
                  language={targetLanguage}
                  value={convertedCode}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: true,
                    automaticLayout: true,
                    scrollbar: {
                      vertical: 'visible',
                      horizontal: 'visible',
                      verticalScrollbarSize: 10,
                      horizontalScrollbarSize: 10,
                      useShadows: false,
                      verticalHasArrows: false,
                      horizontalHasArrows: false,
                      arrowSize: 0,
                    }
                  }}
                />
              </View>
            </Flex>
          </Card>
        </Grid>

        {/* Convert Code Button Box - Now at the bottom */}
        <Card variation="elevated" padding="1.5rem" backgroundColor="#f8f9fa" style={{ borderRadius: '12px' }}>
          <Flex justifyContent="center" alignItems="center" gap="1rem">
            <Button
              variation="primary"
              onClick={handleConvert}
              isLoading={isLoading}
              loadingText="Converting..."
              backgroundColor="#0078d4"
              color="white"
              size="large"
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 8px rgba(0, 120, 212, 0.3)',
                transition: 'all 0.3s ease',
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(0, 120, 212, 0.4)'
                }
              }}
            >
              <FaExchangeAlt /> Convert Code
            </Button>
            {isLoading && (
              <Text color="#666666" style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}>
                Converting your code... This may take a few moments.
              </Text>
            )}
          </Flex>
        </Card>
        
        {showRawResponse && (
          <Card variation="elevated" padding="1.5rem" style={{ borderRadius: '12px' }}>
            <Flex direction="column" gap="1rem">
              <Flex justifyContent="space-between" alignItems="center">
                <Heading level={3} style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif", color: '#0078d4' }}>
                  <Flex alignItems="center" gap="0.5rem">
                    <FaCog size={20} />
                    <span>API Response (for debugging)</span>
                  </Flex>
                </Heading>
                <Button
                  size="small"
                  onClick={() => setShowRawResponse(!showRawResponse)}
                  style={{ borderRadius: '8px' }}
                >
                  {showRawResponse ? 'Hide' : 'Show'}
                </Button>
              </Flex>
              {showRawResponse && (
                <TextAreaField
                  label="Raw API Response"
                  value={rawResponse}
                  isReadOnly={true}
                  rows={5}
                  style={{ fontFamily: "'Poppins', 'Segoe UI', sans-serif" }}
                />
              )}
            </Flex>
          </Card>
        )}
      </Flex>
    </View>
  );
};

export default CodeEditorPage;

