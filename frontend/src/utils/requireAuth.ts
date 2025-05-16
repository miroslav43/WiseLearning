import { getToken } from "@/lib/auth";

/**
 * Higher-order function to wrap API calls to ensure authentication
 * @param apiCall - The API function to call
 * @param onUnauthenticated - Callback to handle unauthenticated users (e.g., redirect to login)
 */
export const requireAuth = <T extends (...args: any[]) => Promise<any>>(
  apiCall: T,
  onUnauthenticated?: () => void
): T => {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const token = getToken();
    
    if (!token && onUnauthenticated) {
      onUnauthenticated();
      throw new Error('Authentication required');
    }
    
    try {
      // Execute the API call with the provided arguments
      const result = await apiCall(...args);
      return result as ReturnType<T>;
    } catch (error: any) {
      // If we get a 401/403 error, the token might be invalid
      if (
        error?.statusCode === 401 || 
        error?.statusCode === 403 ||
        error?.message?.includes('Authentication')
      ) {
        if (onUnauthenticated) {
          onUnauthenticated();
        }
      }
      throw error;
    }
  }) as T;
};

export default requireAuth; 