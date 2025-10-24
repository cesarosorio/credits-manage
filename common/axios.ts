/**
 * Common API endpoints
 */
export const API_ENDPOINTS = {
  CREDITS: {
    GET_ALL: '/credits',
    GET_BY_ID: (creditId: string) => `/credits/${creditId}`,
  },
  PAYMENTS: {
    GET_ALL: '/payments',
    GET_ALL_BY_CREDIT_ID: (creditId: string) => `/payments/credit/${creditId}`,
    FIND_BY_ID: (paymentId: string) => `/payments/${paymentId}`,
    CREATE: '/payments',
    UPDATE: (paymentId: string) => `/payments/${paymentId}`,
    UPLOAD_IMAGE: (paymentId: string) => `/payments/${paymentId}/upload-image`,
    URL_GET_IMAGE: (paymentId: string) => `/payments/${paymentId}/image`,
    DELETE: (paymentId: string) => `/payments/${paymentId}`,
  },
};
