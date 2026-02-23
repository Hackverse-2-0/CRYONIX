import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavigationGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    // Only guard back navigation when user is authenticated AND on protected routes
    const protectedRoutes = ['/dashboard', '/tasks', '/notes', '/analytics'];
    const isProtectedRoute = protectedRoutes.includes(location.pathname);
    
    if (user && isProtectedRoute) {
      // Prevent browser back button from going to login/signup
      window.history.pushState(null, '', window.location.href);
      
      const handlePopState = (event) => {
        event.preventDefault();
        
        // Show confirmation dialog only when trying to leave protected routes
        const confirmExit = window.confirm(
          '⚠️ Are you sure you want to exit?\n\nYou will be logged out of SprintOS.'
        );
        
        if (confirmExit) {
          // User confirmed - logout and go to landing page
          signOut().then(() => {
            navigate('/', { replace: true });
          });
        } else {
          // User cancelled - stay on current page
          window.history.pushState(null, '', window.location.href);
        }
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
    // If not authenticated or not on protected route, allow normal navigation
  }, [user, location, navigate, signOut]);

  return children;
};

export default NavigationGuard;
