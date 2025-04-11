# AI Code Converter

A React application that allows users to convert code from one programming language to another using AWS API Gateway.

## Features

- Convert code between multiple programming languages
- Modern UI with AWS Amplify UI components
- Real-time code conversion
- Error handling and user feedback

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- AWS account with API Gateway set up

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-code-converter
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure AWS Amplify:
   - Make sure your `aws-exports.js` file is properly configured with your API Gateway endpoint
   - The file should be located at `src/aws-exports.js`

## Usage

1. Start the development server:
```bash
npm start
# or
yarn start
```

2. Open your browser and navigate to `http://localhost:3000`

3. Enter your source code in the text area

4. Select the target language from the dropdown

5. Click "Convert Code" to convert your code

## API Configuration

The application uses AWS API Gateway for code conversion. The API endpoint is configured in the `aws-exports.js` file:

```javascript
const awsConfig = {
  API: {
    endpoints: [
      {
        name: "codeconverterapi",
        endpoint: "https://your-api-gateway-url.amazonaws.com/stage/path",
      },
    ],
  },
};
```

Make sure to replace the endpoint URL with your actual API Gateway URL.

## Project Structure

```
ai-code-converter/
├── public/
├── src/
│   ├── components/
│   │   └── CodeConverter.js
│   ├── utils/
│   │   └── api.js
│   ├── styles/
│   │   └── App.css
│   ├── App.js
│   ├── index.js
│   └── aws-exports.js
├── package.json
└── README.md
```

## License

MIT
