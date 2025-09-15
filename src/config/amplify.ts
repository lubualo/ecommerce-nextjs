import { Amplify } from 'aws-amplify';

export function configureAmplify() {
  // Validate required environment variables
  const requiredEnvVars = {
    NEXT_PUBLIC_AWS_USER_POOL_ID: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
    NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID,
    NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all AWS Cognito variables are set.'
    );
  }

  const config = {
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID as string,
        userPoolClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID as string,
        region: process.env.NEXT_PUBLIC_AWS_REGION as string,
        loginWith: {
          email: true,
          username: false,
          phone: false,
        },
        signUpVerificationMethod: 'code' as const, // Use email verification
      }
    }
  };
  
  try {
    Amplify.configure(config, { ssr: true });
    console.log('✅ AWS Amplify configured successfully');
  } catch (error) {
    console.error('❌ Failed to configure AWS Amplify:', error);
    throw error;
  }
}