import { removeToken, setToken } from '@/lib/auth';
import { AuthResponse, LoginCredentials, RegistrationData, User } from '@/types/user';
import { apiClient } from '@/utils/apiClient';

// Get the API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Service for handling authentication-related API calls
 */

/**
 * Login a user with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials as unknown as Record<string, unknown>);
    
    // Store the token in localStorage
    setToken(response.token);
    
    return response.user;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

/**
 * Register a new user
 */
export const register = async (userData: RegistrationData): Promise<User> => {
  try {
    // Convert from frontend's firstName/lastName format to backend's name format
    const backendData = {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      password: userData.password,
      role: userData.role
    };
    
    console.log('Sending registration data:', JSON.stringify(backendData, null, 2));
    
    const response = await apiClient.post<AuthResponse>('/auth/register', backendData as unknown as Record<string, unknown>);
    
    console.log('Registration response:', JSON.stringify(response, null, 2));
    
    // Store the token in localStorage
    if (response.token) {
      setToken(response.token);
      return response.user;
    } else {
      throw new Error('No authentication token received');
    }
  } catch (error: any) {
    console.error('Registration failed:', error);
    // Try to extract more meaningful error messages from the response
    if (error.message && typeof error.message === 'string') {
      throw new Error(error.message);
    } else {
      throw new Error('Registration failed. Please try again.');
    }
  }
};

/**
 * Logout the current user
 */
export const logout = (): void => {
  // Remove the token from localStorage
  removeToken();
};

/**
 * Get the current logged in user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    return await apiClient.get<User>('/auth/me');
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw error;
  }
};

/**
 * Update the current user's profile
 */
export const updateUserProfile = async (updates: Partial<User>): Promise<User> => {
  try {
    return await apiClient.put<User>('/auth/profile', updates);
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }
};

/**
 * Request a password reset email
 */
export const requestPasswordReset = async (email: string): Promise<{ message: string }> => {
  try {
    return await apiClient.post<{ message: string }>('/auth/reset-password', { email });
  } catch (error) {
    console.error('Failed to request password reset:', error);
    throw error;
  }
};

/**
 * Reset a password with token
 */
export const resetPassword = async (token: string, newPassword: string): Promise<{ message: string }> => {
  try {
    return await apiClient.post<{ message: string }>('/auth/reset-password/confirm', { 
      token,
      newPassword
    });
  } catch (error) {
    console.error('Failed to reset password:', error);
    throw error;
  }
}; 