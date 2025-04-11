import { Amplify, post, get } from 'aws-amplify/api';

/**
 * Convert code from one language to another using the API Gateway
 * @param {string} sourceCode - The source code to convert
 * @param {string} targetLanguage - The target language to convert to
 * @returns {Promise<Object>} - The response from the API
 */
export const convertCode = async (sourceCode, targetLanguage) => {
  try {
    const response = await post({
      apiName: 'codeconverterapi',
      path: '/codeconverter',
      options: {
        body: {
          sourceCode,
          targetLanguage,
        },
      },
    });
    return response;
  } catch (error) {
    console.error('Error in convertCode:', error);
    throw error;
  }
};

/**
 * Get a list of supported languages from the API
 * @returns {Promise<Array>} - The list of supported languages
 */
export const getSupportedLanguages = async () => {
  try {
    const response = await get({
      apiName: 'codeconverterapi',
      path: '/languages',
      options: {},
    });
    return response.languages || [];
  } catch (error) {
    console.error('Error in getSupportedLanguages:', error);
    // Return a default list of languages if the API call fails
    return [
      'python', 'javascript', 'java', 'csharp', 'cpp', 
      'go', 'rust', 'php', 'ruby', 'swift'
    ];
  }
};
