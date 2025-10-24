/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ENV_CONFIG } from '@/config/env.config';

/**
 * API configuration constants
 */
export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API.BASE_URL,
  TIMEOUT: ENV_CONFIG.API.TIMEOUT,
  CONTENT_TYPE: 'application/json',
};

export interface Response<T> {
  data: T;
  statusCode: number;
  error: string | null;
  message: string | null;
  time: string | null;
  path: string | null;
}

/**
 * API Service Configuration
 */
class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;

  private constructor() {
    // Create axios instance with default config
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Get singleton instance of ApiService
   */
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }

    return ApiService.instance;
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        try {
          // Lista de rutas que no necesitan token de autorización
          const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];

          // Verificar si la URL actual es una ruta de autenticación
          const isAuthRoute = authRoutes.some((route) => config.url?.includes(route));

          if (!isAuthRoute) {
            const token = localStorage.getItem(ENV_CONFIG.AUTH.TOKEN_KEY);

            if (token && config.headers) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          }
        } catch (error) {
          console.error('Error setting auth token in request:', error);
        }

        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      },
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized errors (token expired)
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Intentar refrescar el token
            const refreshToken = localStorage.getItem(ENV_CONFIG.AUTH.REFRESH_TOKEN_KEY);

            if (!refreshToken) {
              // No hay refresh token, redirigir al login
              localStorage.removeItem(ENV_CONFIG.AUTH.TOKEN_KEY);
              localStorage.removeItem(ENV_CONFIG.AUTH.REFRESH_TOKEN_KEY);
              window.location.href = '/auth/login';
              return Promise.reject(error);
            }

            // Intentar obtener un nuevo token
            const refreshResponse = await this.api.post('/auth/refresh-token', {
              refreshToken: refreshToken,
            });

            const newToken = refreshResponse.data.data.accessToken;

            if (newToken) {
              localStorage.setItem(ENV_CONFIG.AUTH.TOKEN_KEY, newToken);

              // Retry the original request with new token
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              return this.api(originalRequest);
            }
          } catch (authError) {
            console.error('Authentication error:', authError);
            // Error al refrescar token, limpiar storage y redirigir
            localStorage.removeItem(ENV_CONFIG.AUTH.TOKEN_KEY);
            localStorage.removeItem(ENV_CONFIG.AUTH.REFRESH_TOKEN_KEY);
            window.location.href = '/auth/login';
            return Promise.reject(authError);
          }
        }

        // Handle other errors
        this.handleApiError(error);
        return Promise.reject(error);
      },
    );
  }

  /**
   * Handle and log API errors
   */
  private handleApiError(error: AxiosError): void {
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('API No Response:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('API Request Error:', error.message);
    }
  }

  /**
   * HTTP GET request
   */
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<Response<T>> {
    const response: AxiosResponse<Response<T>> = await this.api.get(url, config);
    return response.data;
  }

  /**
   * HTTP POST request
   */
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Response<T>> {
    const response: AxiosResponse<Response<T>> = await this.api.post(url, data, config);
    return response.data;
  }

  /**
   * HTTP PUT request
   */
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Response<T>> {
    const response: AxiosResponse<Response<T>> = await this.api.put(url, data, config);
    return response.data;
  }

  /**
   * HTTP PATCH request
   */
  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Response<T>> {
    const response: AxiosResponse<Response<T>> = await this.api.patch(url, data, config);
    return response.data;
  }

  /**
   * HTTP DELETE request
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<Response<T>> {
    const response: AxiosResponse<Response<T>> = await this.api.delete(url, config);
    return response.data;
  }

  /**
   * Get the axios instance for custom requests
   */
  public getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

// Create a singleton instance
const apiService = ApiService.getInstance();

export default apiService;
