import { triggerResolutionCall } from '../lib/retell';
import * as dotenv from 'dotenv';
dotenv.config();

async function runTest() {
  console.log('--- Retell AI Integration Test ---');
  
  // Test with a mock phone number (use a real one to test actual calling)
  const testPhone = '+1234567890'; 
  const testName = 'Test User';
  const testIssue = 'Pothole on Main Street';

  console.log(`Sending test call to ${testPhone}...`);
  
  const result = await triggerResolutionCall(testPhone, testName, testIssue);
  
  if (result.success) {
    console.log('✅ Test successful! Check Retell dashboard for call ID:', result.callId);
  } else {
    console.log('❌ Test failed (Expected if API keys are missing/invalid):', result.error);
  }
}

runTest();
