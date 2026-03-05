/**
 * Check if user is authenticated.
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('admin_token');
};

/**
 * Get stored token.
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
};
