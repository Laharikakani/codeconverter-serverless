import React, { useState } from 'react';
import { FaFileUpload } from 'react-icons/fa';
import { Button, Text, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const FileUpload = ({ onFileContent, onLanguageDetected, isLoading }) => {
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');

    const supportedExtensions = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'cs': 'csharp',
        'php': 'php',
        'rb': 'ruby',
        'go': 'go',
        'rs': 'rust',
        'swift': 'swift',
        'kt': 'kotlin',
        'scala': 'scala',
        'html': 'html',
        'css': 'css',
        'sql': 'sql'
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const extension = file.name.split('.').pop().toLowerCase();
        if (!supportedExtensions[extension]) {
            setError('Unsupported file type. Please upload a supported programming language file.');
            return;
        }

        setFileName(file.name);
        setError('');

        try {
            const content = await file.text();
            onFileContent(content);
            onLanguageDetected(supportedExtensions[extension]);
        } catch (err) {
            setError('Error reading file. Please try again.');
        }
    };

    return (
        <View style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
                type="file"
                onChange={handleFileUpload}
                accept={Object.keys(supportedExtensions).map(ext => `.${ext}`).join(',')}
                style={{ display: 'none' }}
                id="file-upload"
                disabled={isLoading}
            />
            <label htmlFor="file-upload">
                <Button
                    as="span"
                    size="small"
                    variation="primary"
                    isLoading={isLoading}
                    style={{
                        backgroundColor: '#0078d4',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        ':hover': {
                            backgroundColor: '#106ebe'
                        }
                    }}
                >
                    <FaFileUpload size={16} />
                    <Text style={{ 
                        fontFamily: "'Space Grotesk', 'Poppins', sans-serif",
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        Upload File
                    </Text>
                </Button>
            </label>
            {error && (
                <Text style={{ 
                    color: '#d13438',
                    fontSize: '14px',
                    marginTop: '4px'
                }}>
                    {error}
                </Text>
            )}
            {fileName && !error && (
                <Text style={{ 
                    color: '#107c10',
                    fontSize: '14px',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <FaFileUpload size={14} />
                    {fileName}
                </Text>
            )}
        </View>
    );
};

export default FileUpload; 