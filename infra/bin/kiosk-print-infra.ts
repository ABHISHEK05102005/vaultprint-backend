#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { KioskPrintStack } from '../lib/kiosk-print-stack';

const app = new cdk.App();

const stackName = app.node.tryGetContext('stackName') || 'KioskPrintStack';

new KioskPrintStack(app, stackName, {
  env: {
    // Set your AWS account and region here or via CDK default env
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});

