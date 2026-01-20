const serverlessExpress = require('@vendia/serverless-express');
const app = require('./serverApp');

// Wrap the Express app for AWS Lambda
exports.handler = serverlessExpress({ app });

