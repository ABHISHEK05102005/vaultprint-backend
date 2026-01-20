import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';

export interface KioskPrintStackProps extends cdk.StackProps {}

export class KioskPrintStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: KioskPrintStackProps) {
    super(scope, id, props);

    // Lambda function wrapping the Express app using @vendia/serverless-express
    // Using NodejsFunction for automatic bundling and dependency management
    const kioskLambda = new lambdaNodejs.NodejsFunction(this, 'KioskPrintLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '..', '..', 'src', 'lambdaHandler.js'),
      handler: 'handler',
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      environment: {
        NODE_ENV: 'production',
        // Fill these in with your actual Supabase settings (or via CDK context/SSM/Secrets Manager)
        SUPABASE_URL: process.env.SUPABASE_URL ?? '',
        SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ?? '',
        // Existing kiosk storage settings if you want them on Lambda too
        KIOSK_DATA_ROOT: '/tmp/kiosks',
        SERVER_KEY: process.env.SERVER_KEY ?? ''
      },
      bundling: {
        minify: true,
        sourceMap: true,
        externalModules: []
      }
    });

    // HTTP API Gateway v2
    const httpApi = new apigwv2.HttpApi(this, 'KioskPrintHttpApi', {
      apiName: 'kiosk-print-api',
      description: 'HTTP API for kiosk print Express backend'
    });

    // Add root route
    httpApi.addRoutes({
      path: '/',
      methods: [apigwv2.HttpMethod.ANY],
      integration: new integrations.HttpLambdaIntegration(
        'KioskLambdaRootIntegration',
        kioskLambda
      )
    });

    // Add proxy route for all other paths
    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [apigwv2.HttpMethod.ANY],
      integration: new integrations.HttpLambdaIntegration(
        'KioskLambdaIntegration',
        kioskLambda
      )
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: httpApi.apiEndpoint,
      description: 'Base URL of the kiosk print API'
    });
  }
}

