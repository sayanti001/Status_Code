import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    // If authentication is complete (not loading) and user is not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: window.location.pathname },
      });
    }

    // If user is authenticated but email is not verified, redirect to verification page
    if (isAuthenticated && user && !user.email_verified) {
      navigate('/email-verification');
    }
  }, [isLoading, isAuthenticated, user, loginWithRedirect, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  // Only render children if user is authenticated and email is verified
  if (isAuthenticated && user?.email_verified) {
    return <>{children}</>;
  }

  return null;
};
