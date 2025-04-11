import React, { useState } from 'react';
import { FaFileUpload } from 'react-icons/fa';

const FileUpload = ({ onFileContent, onLanguageDetected, isLoading: externalIsLoading }) => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('');

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
            // Read the file content
            const fileContent = await file.text();
            
            // Pass the file content to the parent component
            onFileContent(fileContent);

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

    return (
        <div style={{ 
            display: 'block', 
            width: '100%',
            marginBottom: '10px'
        }}>
            <input
                type="file"
                accept={Object.keys(supportedExtensions).join(',')}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="file-upload"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                    onClick={() => document.getElementById('file-upload').click()}
                    disabled={isLoading || externalIsLoading}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: '#0078d4',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                        position: 'relative',
                        overflow: 'hidden',
                        userSelect: 'none',
                        zIndex: 10,
                        transition: 'all 0.2s ease',
                        opacity: isLoading || externalIsLoading ? 0.7 : 1
                    }}
                >
                    <FaFileUpload style={{ fontSize: '16px' }} />
                    <span>Upload</span>
                </button>
                {fileName && (
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        {fileName}
                    </div>
                )}
                {error && (
                    <div style={{ 
                        padding: '8px 12px', 
                        backgroundColor: '#ffebee', 
                        color: '#d32f2f', 
                        borderRadius: '4px',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;