import { Navbar } from '../components/navbar';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { AlertCircle, CheckCircle, Clock, Server, Shield, Zap } from "lucide-react";

export const HomePage = () => {
 
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Status Code</h1>
            <p className="text-xl text-gray-600 mb-6">Monitor the status and performance of our services in real-time.</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        {/* Service Features */}
        <div className="py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Why Choose Our Status Page</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="pb-2">
                <Zap className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>Real-Time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Get instant notifications about service disruptions and maintenance schedules.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <Shield className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Service Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Clear communication about service health and incident resolution progress.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle>Historical Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Track performance over time with detailed uptime and incident history.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">© 2025 StatusPage. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};