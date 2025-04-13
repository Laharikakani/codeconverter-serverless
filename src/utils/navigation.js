import { NavigateFunction } from 'react-router-dom';

/**
 * Utility function to navigate to the verify page after signup
 * @param {NavigateFunction} navigate - The navigate function from useNavigate
 * @param {string} email - The email to pass to the verify page
 */
export const navigateToVerify = (navigate, email) => {
  console.log('Navigating to verify page with email:', email);
  
  // Store email in localStorage as backup
  localStorage.setItem('pendingVerificationEmail', email);
  
  // Force navigation to verify page
  navigate('/verify', { 
    state: { email },
    replace: true // Use replace to prevent back button issues
  });
};

/**
 * Utility function to navigate to the login page after verification
 * @param {NavigateFunction} navigate - The navigate function from useNavigate
 * @param {string} email - The email to pass to the login page
 */
export const navigateToLogin = (navigate, email) => {
  console.log('Navigating to login page with email:', email);
  
  // Store email in localStorage as backup
  localStorage.setItem('pendingLoginEmail', email);
  
  // Force navigation to login page
  navigate('/login', { 
    state: { email },
    replace: true // Use replace to prevent back button issues
  });
}; 