/**
 * Get the authentication token from local storage
 */
export const getToken = (): string | null => {
  return localStorage.getItem('wiselearning_auth_token');
};

/**
 * Set the authentication token in local storage
 */
export const setToken = (token: string): void => {
  localStorage.setItem('wiselearning_auth_token', token);
};

/**
 * Remove the authentication token from local storage
 */
export const removeToken = (): void => {
  localStorage.removeItem('wiselearning_auth_token');
};

/**
 * Check if the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
}; 