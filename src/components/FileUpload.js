import React, { useState } from 'react';
import { Button, View, Text, Alert, Flex } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { FaUpload, FaFileCode, FaFileAlt, FaFileUpload } from 'react-icons/fa';
import './FileUpload.css';

const FileUpload = ({ onFileContent, onLanguageDetected, isLoading: externalIsLoading }) => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    // List of supported file extensions with their corresponding languages
    const supportedExtensions = {
        '.py': 'python',
        '.java': 'java',
        '.js': 'javascript',
        '.jsx': 'javascript',
        '.ts': 'javascript',
        '.tsx': 'javascript',
        '.cs': 'csharp',
        '.rs': 'rust',
        '.php': 'php',
        '.rb': 'ruby',
        '.swift': 'swift',
        '.cpp': 'csharp',
        '.c': 'csharp',
        '.h': 'csharp',
        '.hpp': 'csharp',
        '.kt': 'javascript',
        '.go': 'javascript'
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Get file extension
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        // Check if file extension is supported
        if (!Object.keys(supportedExtensions).includes(fileExtension)) {
            setError(`Unsupported file type. Please upload a code file with one of these extensions: ${Object.keys(supportedExtensions).join(', ')}`);
            return;
        }

        setFileName(file.name);
        setIsLoading(true);
        setError('');

        try {
            // First, read the file content
            const fileContent = await file.text();
            
            // Get the token from localStorage
            const token = localStorage.getItem('token');

            // Create a JSON request body
            const requestBody = {
                fileName: file.name,
                fileContent: fileContent,
                fileType: fileExtension.substring(1) // Remove the dot from extension
            };

            // Upload the file to the API
            const response = await fetch('https://emm58pr9b4.execute-api.us-east-1.amazonaws.com/newstage/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.message || 'Failed to upload file');
                } catch (parseError) {
                    throw new Error(`Failed to upload file: ${errorText.substring(0, 100)}...`);
                }
            }

            const responseText = await response.text();
            console.log('API Response:', responseText);
            
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('JSON Parse Error:', parseError);
                throw new Error('Invalid response format from server');
            }
            
            // Check if we have the file content in the response
            if (data.fileContent) {
                // If the API returns the file content directly
                onFileContent(data.fileContent);
            } else if (data.s3Url) {
                // If the API returns an S3 URL, fetch the content
                const fileContentResponse = await fetch(data.s3Url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!fileContentResponse.ok) {
                    throw new Error('Failed to fetch file content from S3');
                }
                
                const fileContent = await fileContentResponse.text();
                onFileContent(fileContent);
            } else {
                // If we don't have file content or S3 URL, use the original file content
                onFileContent(fileContent);
            }

            // Detect language based on file extension and notify parent component
            const detectedLanguage = supportedExtensions[fileExtension];
            if (detectedLanguage && onLanguageDetected) {
                onLanguageDetected(detectedLanguage);
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(`Error uploading file: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleButtonClick = () => {
        setIsAnimating(true);
        document.getElementById('file-upload').click();
        setTimeout(() => setIsAnimating(false), 500);
    };

    return (
        <View>
            <input
                type="file"
                accept={Object.keys(supportedExtensions).join(',')}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="file-upload"
            />
            <Flex direction="column" gap="0.5rem">
                <Button
                    isLoading={isLoading || externalIsLoading}
                    onClick={handleButtonClick}
                    variation="primary"
                    size="small"
                    className={`upload-button ${isAnimating ? 'animate' : ''}`}
                >
                    <FaFileUpload className="upload-icon" />
                    <Text fontSize="small">Upload</Text>
                </Button>
                {fileName && (
                    <Text fontSize="small" color="gray">
                        {fileName}
                    </Text>
                )}
                {error && <Alert variation="error">{error}</Alert>}
            </Flex>
        </View>
    );
};

export default FileUpload;