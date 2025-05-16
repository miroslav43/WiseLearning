import { getToken } from '@/lib/auth';

// Define environment variable type
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * Create an API client for making authenticated requests to the backend
 */
export const apiClient = {
  /**
   * Make a GET request to the API
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    // Add query parameters if provided
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });
    }
    
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        await handleErrorResponse(response);
      }
    
      return await response.json();
    } catch (error) {
      console.error(`GET request to ${endpoint} failed:`, error);
      throw error;
    }
  },
  
  /**
   * Make a POST request to the API
   */
  async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined
      });
      
      if (!response.ok) {
        await handleErrorResponse(response);
      }
    
      return await response.json();
    } catch (error) {
      console.error(`POST request to ${endpoint} failed:`, error);
      throw error;
    }
  },
  
  /**
   * Make a PUT request to the API
   */
  async put<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: data ? JSON.stringify(data) : undefined
      });
      
      if (!response.ok) {
        await handleErrorResponse(response);
      }
    
      return await response.json();
    } catch (error) {
      console.error(`PUT request to ${endpoint} failed:`, error);
      throw error;
    }
  },
  
  /**
   * Make a DELETE request to the API
   */
  async delete<T>(endpoint: string): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) {
        await handleErrorResponse(response);
      }
    
      return await response.json();
    } catch (error) {
      console.error(`DELETE request to ${endpoint} failed:`, error);
      throw error;
    }
  },
  
  /**
   * Make a PATCH request to the API
   */
  async patch<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers,
        body: data ? JSON.stringify(data) : undefined
      });
      
      if (!response.ok) {
        await handleErrorResponse(response);
      }
    
      return await response.json();
    } catch (error) {
      console.error(`PATCH request to ${endpoint} failed:`, error);
      throw error;
    }
  }
};

/**
 * Handle error responses from the API
 */
async function handleErrorResponse(response: Response): Promise<never> {
  let errorData: ApiError = { message: 'Unknown error occurred' };

  try {
    errorData = await response.json();
  } catch (e) {
    // If parsing JSON fails, use the status text
    errorData.message = response.statusText;
  }

  const error = new Error(errorData.message || `API Error: ${response.status}`);
  (error as any).statusCode = response.status;
  (error as any).errors = errorData.errors;

  throw error;
} 