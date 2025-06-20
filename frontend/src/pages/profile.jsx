import { useAuth0 } from '@auth0/auth0-react';
import { Navbar } from '../components/navbar';
import { Button } from '../components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../components/ui/card';
import { Loader2, Mail, User, Calendar, Key } from 'lucide-react';

export const Profile = () => {
  const { user, isAuthenticated, isLoading,logout } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="rounded-full h-24 w-24 object-cover border-4 border-primary/10"
                    />
                  ) : (
                    <div className="rounded-full h-24 w-24 bg-primary/10 flex items-center justify-center">
                      <User size={32} className="text-primary" />
                    </div>
                  )}
                </div>
                <CardTitle>{user.name===user.email ? 'User' : user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => logout({ returnTo: window.location.origin })} className="w-full">Logout</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your personal information from your Auth0 profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-muted-foreground mr-2" />
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">{user.name===user.email ? 'User' : user.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="mt-1">
                      {user.email_verified ? (
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                          Not Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {user.updated_at && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Key className="h-5 w-5 text-muted-foreground mr-2" />
                  <div>
                    <p className="text-sm font-medium">User ID</p>
                    <p className="text-sm text-muted-foreground truncate max-w-md">
                      {user.sub}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};