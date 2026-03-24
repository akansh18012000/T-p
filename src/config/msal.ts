/**
 * MSAL Configuration for Terumo Entra ID Integration
 * Replace with your actual Azure AD configuration
 */

const getEnvVar = (key: string, defaultValue: string): string => {
  return (import.meta.env as Record<string, any>)[key] || defaultValue;
};

export const msalConfig = {
  auth: {
    clientId: getEnvVar('VITE_MSAL_CLIENT_ID', 'YOUR_CLIENT_ID_HERE'),
    authority: getEnvVar('VITE_MSAL_AUTHORITY', 'https://login.microsoftonline.com/common'),
    redirectUri: getEnvVar('VITE_MSAL_REDIRECT_URI', 'http://localhost:3000'),
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ['user.read'],
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};
