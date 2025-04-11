import { createTheme } from '@aws-amplify/ui-react';

export const theme = createTheme({
  name: 'codeconverter-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: '#E6F1FF',
          20: '#BAE0FF',
          30: '#8CCFFF',
          40: '#5EBFFF',
          50: '#30AEFF',
          60: '#009EFF',
          70: '#007ECC',
          80: '#005C99',
          90: '#003A66',
          100: '#001833'
        },
        secondary: {
          10: '#F5F5F5',
          20: '#E0E0E0',
          30: '#CCCCCC',
          40: '#B3B3B3',
          50: '#999999',
          60: '#808080',
          70: '#666666',
          80: '#4D4D4D',
          90: '#333333',
          100: '#1A1A1A'
        }
      },
      font: {
        primary: '#1A1A1A',
        secondary: '#666666'
      },
      background: {
        primary: '#FFFFFF',
        secondary: '#F5F5F5'
      }
    },
    components: {
      button: {
        primary: {
          backgroundColor: '#009EFF',
          color: '#FFFFFF',
          borderColor: '#009EFF',
          _hover: {
            backgroundColor: '#007ECC',
            borderColor: '#007ECC'
          }
        },
        outline: {
          backgroundColor: 'transparent',
          color: '#009EFF',
          borderColor: '#009EFF',
          _hover: {
            backgroundColor: '#E6F1FF',
            borderColor: '#007ECC'
          }
        }
      },
      textField: {
        borderColor: '#E0E0E0',
        _focus: {
          borderColor: '#009EFF'
        }
      }
    }
  }
}); 