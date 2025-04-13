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
    ruby: /def|class|module|require|if|else|for|while|puts|print|end|do|begin|rescue|ensure|yield|attr_accessor|attr_reader|attr_writer|private|public|protected|include|extend|self|true|false|nil|@|@@|$/,
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
    
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock conversion logic instead of calling the API
      let mockConvertedCode = '';
      
      // Define common conversion patterns for all languages
      const commonPatterns = {
        // Function declarations
        functionDecl: {
          javascript: /function\s+(\w+)\s*\((.*?)\)\s*{/g,
          python: /def\s+(\w+)\s*\((.*?)\):/g,
          java: /(?:public|private|protected)?\s*(?:static)?\s*(?:void|\w+)\s+(\w+)\s*\((.*?)\)\s*{/g,
          csharp: /(?:public|private|protected)?\s*(?:static)?\s*(?:void|\w+)\s+(\w+)\s*\((.*?)\)\s*{/g,
          php: /function\s+(\w+)\s*\((.*?)\)\s*{/g,
          ruby: /def\s+(\w+)\s*\((.*?)\)/g,
          swift: /func\s+(\w+)\s*\((.*?)\)\s*{/g,
          rust: /fn\s+(\w+)\s*\((.*?)\)\s*{/g
        },
        
        // Print statements
        print: {
          javascript: /console\.log\((.*?)\)/g,
          python: /print\((.*?)\)/g,
          java: /System\.out\.println\((.*?)\)/g,
          csharp: /Console\.WriteLine\((.*?)\)/g,
          php: /echo\s+(.*?);/g,
          ruby: /puts\s+(.*?)/g,
          swift: /print\s+(.*?)\)/g,
          rust: /println!\((.*?)\)/g
        },
        
        // If statements
        ifStatement: {
          javascript: /if\s*\((.*?)\)\s*{/g,
          python: /if\s+(.*?):/g,
          java: /if\s*\((.*?)\)\s*{/g,
          csharp: /if\s*\((.*?)\)\s*{/g,
          php: /if\s*\((.*?)\)\s*{/g,
          ruby: /if\s+(.*?)/g,
          swift: /if\s+(.*?)\s*{/g,
          rust: /if\s+(.*?)\s*{/g
        },
        
        // For loops
        forLoop: {
          javascript: /for\s*\((\w+)\s*=\s*(\d+);\s*\1\s*<\s*(\d+);\s*\1\+\+\)\s*{/g,
          python: /for\s+(\w+)\s+in\s+range\((\d+),\s*(\d+)\):/g,
          java: /for\s*\(\s*(\w+)\s+(\w+)\s*=\s*(\d+);\s*\2\s*<\s*(\d+);\s*\2\+\+\)\s*{/g,
          csharp: /for\s*\(\s*(\w+)\s+(\w+)\s*=\s*(\d+);\s*\2\s*<\s*(\d+);\s*\2\+\+\)\s*{/g,
          php: /for\s*\(\s*(\w+)\s*=\s*(\d+);\s*\1\s*<\s*(\d+);\s*\1\+\+\)\s*{/g,
          ruby: /(\d+)\.\.(\d+)\s*\.each\s*{\s*\|(\w+)\|/g,
          swift: /for\s+(\w+)\s+in\s+(\d+)\.\.<(\d+)\s*{/g,
          rust: /for\s+(\w+)\s+in\s+(\d+)\.\.(\d+)\s*{/g
        },
        
        // While loops
        whileLoop: {
          javascript: /while\s*\((.*?)\)\s*{/g,
          python: /while\s+(.*?):/g,
          java: /while\s*\((.*?)\)\s*{/g,
          csharp: /while\s*\((.*?)\)\s*{/g,
          php: /while\s*\((.*?)\)\s*{/g,
          ruby: /while\s+(.*?)/g,
          swift: /while\s+(.*?)\s*{/g,
          rust: /while\s+(.*?)\s*{/g
        },
        
        // Class declarations
        classDecl: {
          javascript: /class\s+(\w+)\s*{/g,
          python: /class\s+(\w+):/g,
          java: /(?:public|private|protected)?\s*class\s+(\w+)\s*{/g,
          csharp: /(?:public|private|protected)?\s*class\s+(\w+)\s*{/g,
          php: /class\s+(\w+)\s*{/g,
          ruby: /class\s+(\w+)/g,
          swift: /class\s+(\w+)\s*{/g,
          rust: /struct\s+(\w+)\s*{/g
        },
        
        // Variable declarations
        varDecl: {
          javascript: /(?:const|let|var)\s+(\w+)\s*=/g,
          python: /(\w+)\s*=/g,
          java: /(?:public|private|protected)?\s*(?:static)?\s*(?:final)?\s*(\w+)\s+(\w+)\s*=/g,
          csharp: /(?:public|private|protected)?\s*(?:static)?\s*(?:readonly)?\s*(\w+)\s+(\w+)\s*=/g,
          php: /\$(\w+)\s*=/g,
          ruby: /(\w+)\s*=/g,
          swift: /(?:let|var)\s+(\w+)\s*=/g,
          rust: /let\s+(?:mut\s+)?(\w+)\s*=/g
        }
      };

      // Function to convert between any two languages
      const convertBetweenLanguages = (code, fromLang, toLang) => {
        let result = code;
        
        // Remove language-specific markers first
        if (fromLang === 'php') {
          // Remove PHP tags
          result = result.replace(/<\?php\s*/g, '');
          result = result.replace(/<\?=\s*/g, '');
          result = result.replace(/<\?\s*/g, '');
          result = result.replace(/\?>\s*$/g, '');
        } else if (fromLang === 'python') {
          // Remove Python shebang if present
          result = result.replace(/^#!.*\n/, '');
        } else if (fromLang === 'java') {
          // Remove package and import statements
          result = result.replace(/package\s+[\w\.]+;\s*/g, '');
          result = result.replace(/import\s+[\w\.]+;\s*/g, '');
        } else if (fromLang === 'csharp') {
          // Remove using statements
          result = result.replace(/using\s+[\w\.]+;\s*/g, '');
        } else if (fromLang === 'javascript') {
          // Remove import and export statements
          result = result.replace(/import\s+.*from\s+.*;\s*/g, '');
          result = result.replace(/export\s+.*;\s*/g, '');
        }
        
        // Convert function declarations
        if (commonPatterns.functionDecl[fromLang] && commonPatterns.functionDecl[toLang]) {
          const fromPattern = commonPatterns.functionDecl[fromLang];
          const toPattern = commonPatterns.functionDecl[toLang];
          result = result.replace(fromPattern, (match, name, params) => {
            if (toLang === 'python') return `def ${name}(${params}):`;
            if (toLang === 'javascript') return `function ${name}(${params}) {`;
            if (toLang === 'java') return `public void ${name}(${params}) {`;
            if (toLang === 'csharp') return `public void ${name}(${params}) {`;
            if (toLang === 'php') return `function ${name}(${params}) {`;
            if (toLang === 'ruby') return `def ${name}(${params})`;
            if (toLang === 'swift') return `func ${name}(${params}) {`;
            if (toLang === 'rust') return `fn ${name}(${params}) {`;
            return match;
          });
        }
        
        // Convert print statements
        if (commonPatterns.print[fromLang] && commonPatterns.print[toLang]) {
          const fromPattern = commonPatterns.print[fromLang];
          const toPattern = commonPatterns.print[toLang];
          result = result.replace(fromPattern, (match, content) => {
            if (toLang === 'python') return `print(${content})`;
            if (toLang === 'javascript') return `console.log(${content})`;
            if (toLang === 'java') return `System.out.println(${content})`;
            if (toLang === 'csharp') return `Console.WriteLine(${content})`;
            if (toLang === 'php') return `echo ${content};`;
            if (toLang === 'ruby') return `puts ${content}`;
            if (toLang === 'swift') return `print(${content})`;
            if (toLang === 'rust') return `println!(${content})`;
            return match;
          });
        }
        
        // Convert if statements
        if (commonPatterns.ifStatement[fromLang] && commonPatterns.ifStatement[toLang]) {
          const fromPattern = commonPatterns.ifStatement[fromLang];
          const toPattern = commonPatterns.ifStatement[toLang];
          result = result.replace(fromPattern, (match, condition) => {
            if (toLang === 'python') return `if ${condition}:`;
            if (toLang === 'javascript') return `if (${condition}) {`;
            if (toLang === 'java') return `if (${condition}) {`;
            if (toLang === 'csharp') return `if (${condition}) {`;
            if (toLang === 'php') return `if (${condition}) {`;
            if (toLang === 'ruby') return `if ${condition}`;
            if (toLang === 'swift') return `if ${condition} {`;
            if (toLang === 'rust') return `if ${condition} {`;
            return match;
          });
        }
        
        // Convert for loops
        if (commonPatterns.forLoop[fromLang] && commonPatterns.forLoop[toLang]) {
          const fromPattern = commonPatterns.forLoop[fromLang];
          const toPattern = commonPatterns.forLoop[toLang];
          result = result.replace(fromPattern, (match, var1, var2, var3) => {
            if (toLang === 'python') return `for ${var1} in range(${var2}, ${var3}):`;
            if (toLang === 'javascript') return `for (let ${var1} = ${var2}; ${var1} < ${var3}; ${var1}++) {`;
            if (toLang === 'java') return `for (int ${var1} = ${var2}; ${var1} < ${var3}; ${var1}++) {`;
            if (toLang === 'csharp') return `for (int ${var1} = ${var2}; ${var1} < ${var3}; ${var1}++) {`;
            if (toLang === 'php') return `for ($${var1} = ${var2}; $${var1} < ${var3}; $${var1}++) {`;
            if (toLang === 'ruby') return `${var2}..${var3}.each { |${var1}|`;
            if (toLang === 'swift') return `for ${var1} in ${var2}..<${var3} {`;
            if (toLang === 'rust') return `for ${var1} in ${var2}..${var3} {`;
            return match;
          });
        }
        
        // Convert while loops
        if (commonPatterns.whileLoop[fromLang] && commonPatterns.whileLoop[toLang]) {
          const fromPattern = commonPatterns.whileLoop[fromLang];
          const toPattern = commonPatterns.whileLoop[toLang];
          result = result.replace(fromPattern, (match, condition) => {
            if (toLang === 'python') return `while ${condition}:`;
            if (toLang === 'javascript') return `while (${condition}) {`;
            if (toLang === 'java') return `while (${condition}) {`;
            if (toLang === 'csharp') return `while (${condition}) {`;
            if (toLang === 'php') return `while (${condition}) {`;
            if (toLang === 'ruby') return `while ${condition}`;
            if (toLang === 'swift') return `while ${condition} {`;
            if (toLang === 'rust') return `while ${condition} {`;
            return match;
          });
        }
        
        // Convert class declarations
        if (commonPatterns.classDecl[fromLang] && commonPatterns.classDecl[toLang]) {
          const fromPattern = commonPatterns.classDecl[fromLang];
          const toPattern = commonPatterns.classDecl[toLang];
          result = result.replace(fromPattern, (match, name) => {
            if (toLang === 'python') return `class ${name}:`;
            if (toLang === 'javascript') return `class ${name} {`;
            if (toLang === 'java') return `public class ${name} {`;
            if (toLang === 'csharp') return `public class ${name} {`;
            if (toLang === 'php') return `class ${name} {`;
            if (toLang === 'ruby') return `class ${name}`;
            if (toLang === 'swift') return `class ${name} {`;
            if (toLang === 'rust') return `struct ${name} {`;
            return match;
          });
        }
        
        // Convert variable declarations
        if (commonPatterns.varDecl[fromLang] && commonPatterns.varDecl[toLang]) {
          const fromPattern = commonPatterns.varDecl[fromLang];
          const toPattern = commonPatterns.varDecl[toLang];
          result = result.replace(fromPattern, (match, type, name) => {
            if (toLang === 'python') return `${name} =`;
            if (toLang === 'javascript') return `let ${name} =`;
            if (toLang === 'java') return `${type} ${name} =`;
            if (toLang === 'csharp') return `${type} ${name} =`;
            if (toLang === 'php') return `$${name} =`;
            if (toLang === 'ruby') return `${name} =`;
            if (toLang === 'swift') return `var ${name} =`;
            if (toLang === 'rust') return `let ${name} =`;
            return match;
          });
        }
        
        // Language-specific conversions
        if (fromLang === 'java' && toLang === 'python') {
          // Java to Python specific conversions
          result = result
            .replace(/package\s+[\w\.]+;/g, '')
            .replace(/import\s+[\w\.]+;/g, '')
            .replace(/public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*\w+\s*\)\s*{/g, 'if __name__ == "__main__":')
            .replace(/System\.out\.println\((.*?)\);/g, 'print($1)')
            .replace(/\.length\(\)/g, 'len')
            .replace(/\.substring\((.*?),\s*(.*?)\)/g, '[$1:$2]')
            .replace(/\.toLowerCase\(\)/g, '.lower()')
            .replace(/\.toUpperCase\(\)/g, '.upper()')
            .replace(/\.trim\(\)/g, '.strip()')
            .replace(/\.split\((.*?)\)/g, '.split($1)')
            .replace(/\.equals\((.*?)\)/g, '== $1')
            .replace(/null/g, 'None')
            .replace(/\btrue\b/g, 'True')
            .replace(/\bfalse\b/g, 'False')
            // Fix class method declarations
            .replace(/def\s+(\w+)\s*\(\s*String\s*\[\s*\]\s*(\w+)\s*\):/g, 'def $1(self, $2):')
            .replace(/def\s+(\w+)\s*\(\s*(\w+)\s*\):/g, 'def $1(self, $2):')
            .replace(/def\s+(\w+)\s*\(\):/g, 'def $1(self):')
            // Fix string concatenation
            .replace(/"\s*\+\s*(\w+)\s*\+\s*"/g, 'f"{$1}"')
            .replace(/"\s*\+\s*(\w+)\s*\+\s*"/g, 'f"{$1}"')
            .replace(/"([^"]*)"\s*\+\s*(\w+)\s*\+\s*"([^"]*)"/g, 'f"$1{$2}$3"');
        } else if (fromLang === 'python' && toLang === 'java') {
          // Python to Java specific conversions
          result = result
            .replace(/if\s+__name__\s*==\s*["']__main__["']:/g, 'public static void main(String[] args) {')
            .replace(/print\((.*?)\)/g, 'System.out.println($1);')
            .replace(/len\((.*?)\)/g, '$1.length()')
            .replace(/\[(.*?):(.*?)\]/g, '.substring($1, $2)')
            .replace(/\.lower\(\)/g, '.toLowerCase()')
            .replace(/\.upper\(\)/g, '.toUpperCase()')
            .replace(/\.strip\(\)/g, '.trim()')
            .replace(/\.split\((.*?)\)/g, '.split($1)')
            .replace(/==\s*(.*?)$/gm, '.equals($1);')
            .replace(/None/g, 'null')
            .replace(/\bTrue\b/g, 'true')
            .replace(/\bFalse\b/g, 'false');
        } else if (toLang === 'php') {
          // Add PHP tags for PHP code
          result = '<?php\n' + result + '\n?>';
        }
        
        // Add language-specific imports
        if (toLang === 'python') {
          if (result.includes('math.')) {
            result = 'import math\n' + result;
          }
          if (result.includes('random.')) {
            result = 'import random\n' + result;
          }
          
          // Fix Python class structure
          if (result.includes('class') && !result.includes('def __init__')) {
            // Add proper Python class structure
            result = result.replace(/class\s+(\w+):/g, 'class $1:\n    def __init__(self):\n        pass');
          }
          
          // Fix Python method declarations
          result = result.replace(/def\s+(\w+)\s*\(\s*String\s*\[\s*\]\s*(\w+)\s*\):/g, 'def $1(self, $2):');
          result = result.replace(/def\s+(\w+)\s*\(\s*(\w+)\s*\):/g, 'def $1(self, $2):');
          result = result.replace(/def\s+(\w+)\s*\(\):/g, 'def $1(self):');
          
          // Fix Python string concatenation
          result = result.replace(/"\s*\+\s*(\w+)\s*\+\s*"/g, 'f"{$1}"');
          result = result.replace(/"([^"]*)"\s*\+\s*(\w+)\s*\+\s*"([^"]*)"/g, 'f"$1{$2}$3"');
          
          // Fix Python variable declarations
          result = result.replace(/(\w+)\s*=\s*(\d+);/g, '$1 = $2');
          
          // Fix Python print statements
          result = result.replace(/print\((.*?)\);/g, 'print($1)');
          
          // Fix Python main method
          if (result.includes('def main')) {
            result = result.replace(/def\s+main\s*\(.*?\):/g, 'if __name__ == "__main__":');
          }
        } else if (toLang === 'java') {
          if (result.includes('System.out.println')) {
            result = 'import java.io.*;\n' + result;
          }
          if (result.includes('ArrayList')) {
            result = 'import java.util.ArrayList;\n' + result;
          }
          if (result.includes('HashMap')) {
            result = 'import java.util.HashMap;\n' + result;
          }
        }
        
        // Remove curly braces when converting to Python
        if (toLang === 'python') {
          // Remove standalone closing braces
          result = result.replace(/\s*}\s*$/gm, '');
          
          // Remove braces at the end of lines
          result = result.replace(/\s*{\s*$/gm, '');
          
          // Remove semicolons at the end of lines
          result = result.replace(/;\s*$/gm, '');
          
          // Fix indentation for Python
          const lines = result.split('\n');
          let indentLevel = 0;
          const processedLines = lines.map(line => {
            // Check if line contains a closing brace
            if (line.includes('}')) {
              indentLevel = Math.max(0, indentLevel - 1);
            }
            
            // Create indentation
            const indentation = '    '.repeat(indentLevel);
            
            // Check if line contains an opening brace
            if (line.includes('{')) {
              indentLevel++;
            }
            
            // Remove braces and return indented line
            return indentation + line.replace(/[{}]/g, '');
          });
          
          result = processedLines.join('\n');
          
          // Additional cleanup for Python code
          // Remove any remaining closing braces at the end of the code
          result = result.replace(/\s*}\s*$/g, '');
          
          // Remove any trailing whitespace
          result = result.replace(/\s+$/gm, '');
          
          // Remove any empty lines at the end
          result = result.replace(/\n+$/, '');
          
          // Remove any remaining semicolons
          result = result.replace(/;/g, '');
          
          // Remove any remaining curly braces
          result = result.replace(/[{}]/g, '');
        }
        
        return result;
      };
      
      // Convert the code using the new conversion system
      mockConvertedCode = convertBetweenLanguages(sourceCode, sourceLanguage, targetLanguage);
      
      // Set the converted code
      setConvertedCode(mockConvertedCode);
      setSuccess('Code converted successfully!');
      
      // Store the mock response for debugging
      setRawResponse(JSON.stringify({
        sourceLanguage,
        targetLanguage,
        convertedCode: mockConvertedCode
      }, null, 2));
      
    } catch (error) {
      console.error('Error converting code:', error);
      setError(error.message || 'Failed to convert code. Please try again.');
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
        /if\s+__name__\s*==\s*('|")__main__('|"):/,
        /print\s*\(/,
        /print\s*\(.*\)/
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
        /<\?=/,
        /<\?/,
        /function\s+\w+\s*\(/,
        /class\s+\w+/,
        /namespace\s+\w+/,
        /use\s+\w+/,
        /\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/,
        /echo\s+/,
        /print\s+/,
        /if\s*\(/,
        /for\s*\(/,
        /while\s*\(/,
        /foreach\s*\(/,
        /switch\s*\(/,
        /return\s+/
      ],
      ruby: [
        /def|class|module|require|if|else|for|while|puts|print|end|do|begin|rescue|ensure|yield|attr_accessor|attr_reader|attr_writer|private|public|protected|include|extend|self|true|false|nil|@|@@|$/
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
                    readOnly: false,
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

