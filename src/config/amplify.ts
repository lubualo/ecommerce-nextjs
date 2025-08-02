import { Amplify } from 'aws-amplify';

export function configureAmplify() {
  const config = {
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID as string,
        userPoolClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID as string,
        region: process.env.NEXT_PUBLIC_AWS_REGION as string,
      }
    }
  };
  
  Amplify.configure(config, { ssr: true });
}