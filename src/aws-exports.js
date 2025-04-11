const awsConfig = {
  Auth: {
    Cognito: {
      region: "us-east-1",
      userPoolId: "us-east-1_1hPPoOl39",
      userPoolClientId: "6si6e78askvrgskj0d7g6h5oh",
    }
  },
  API: {
    REST: {
      codeconverterapi: {
        endpoint: "https://96z52auad8.execute-api.us-east-1.amazonaws.com/newstage",
        region: "us-east-1"
      }
    }
  }
};

export default awsConfig;
  