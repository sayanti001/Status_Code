import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

export const EmailVerification = () => {
  const { user, logout } = useAuth0();
  console.log(user);

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const handleDashboardRedirect = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Email Verification Required</CardTitle>
          <CardDescription>Please verify your email to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We've sent a verification email to <strong>{user?.email}</strong>. Please check your inbox and click the verification link.
          </p>
          <p className="text-sm text-muted-foreground">
            If you don't receive the email, check your spam folder or request a new verification email from your Auth0 profile.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
          <Button onClick={handleDashboardRedirect}>
            I've Verified My Email
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
