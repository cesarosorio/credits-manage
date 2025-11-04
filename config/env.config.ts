/**
 * Environment configuration constants
 */
export const ENV_CONFIG = {
  // API Configuration
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '20000'),
  },
  
  // Authentication
  AUTH: {
    TOKEN_KEY: process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY || 'token',
    REFRESH_TOKEN_KEY: process.env.NEXT_PUBLIC_REFRESH_TOKEN_STORAGE_KEY || 'refreshToken',
  },
  
  // Application
  APP: {
    NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Administración Créditos',
    VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  },
  
  // Environment
  ENV: process.env.NODE_ENV || 'development',
  
  // Helper functions
  isDevelopment: () => process.env.NODE_ENV === 'development',
  isProduction: () => process.env.NODE_ENV === 'production',
  isTest: () => process.env.NODE_ENV === 'test',
} as const;

export default ENV_CONFIG;