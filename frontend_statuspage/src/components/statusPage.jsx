import { useState, useEffect } from 'react';
import { fetchStatusHistory } from '../lib/api';
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { CheckCircle, AlertTriangle, AlertCircle, XCircle, InfoIcon } from "lucide-react";
import { Separator } from "./ui/separator";

const StatusPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusData, setStatusData] = useState(null);

  useEffect(() => {
    const loadStatusData = async () => {
      try {
        setLoading(true);
        const result = await fetchStatusHistory();
        if (result.success) {
          setStatusData(result.data);
        } else {
          setError(result.message || 'Failed to load status data');
        }
      } catch (err) {
        setError('Error loading status information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStatusData();
    
    // Set up a polling interval for real-time updates
    const intervalId = setInterval(loadStatusData, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId);
  }, []);

  const getStatusIcon = (status) => {
    // Normalize the status string by removing underscores and converting to lowercase
    const normalizedStatus = status.toLowerCase().replace(/_/g, ' ');
    
    switch (normalizedStatus) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
      case 'degraded performance':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'partial outage':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'major outage':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <InfoIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status) => {
    // Normalize the status string by removing underscores and converting to title case
    const normalizedStatus = status.toLowerCase().replace(/_/g, ' ');
    return normalizedStatus
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStatusColor = (status) => {
    // Normalize the status string by removing underscores and converting to lowercase
    const normalizedStatus = status.toLowerCase().replace(/_/g, ' ');
    
    switch (normalizedStatus) {
      case 'operational':
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          progress: "bg-green-500"
        };
      case 'degraded':
      case 'degraded performance':
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          border: "border-yellow-200",
          progress: "bg-yellow-500"
        };
      case 'partial outage':
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          border: "border-orange-200",
          progress: "bg-orange-500"
        };
      case 'major outage':
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          progress: "bg-red-500"
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          progress: "bg-gray-500"
        };
    }
  };

  const calculateOverallStatus = (services) => {
    if (!services || services.length === 0) return 'Unknown';
    
    // Normalize status strings
    const normalizedStatuses = services.map(svc => {
      return svc.currentStatus.toLowerCase().replace(/_/g, ' ');
    });
    
    if (normalizedStatuses.some(status => status === 'major outage')) {
      return 'major outage';
    } else if (normalizedStatuses.some(status => status === 'partial outage')) {
      return 'partial outage';
    } else if (normalizedStatuses.some(status => status.includes('degraded'))) {
      return 'degraded performance';
    } else {
      return 'operational';
    }
  };

  const calculateUptimePercentage = (service) => {
    if (!service.statusDurations || service.statusDurations.length === 0) {
      return 100;
    }

    const totalHours = service.statusDurations.reduce(
      (acc, duration) => acc + duration.durationHours, 
      0
    );
    
    const operationalHours = service.statusDurations.find(
      d => d.status.toLowerCase().replace(/_/g, ' ') === 'operational'
    )?.durationHours || 0;
    
    return totalHours > 0 ? Math.round((operationalHours / totalHours) * 100) : 100;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-20 w-full mb-8 rounded-lg" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive" className="rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!statusData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert className="rounded-lg">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>No status information is available</AlertDescription>
        </Alert>
      </div>
    );
  }

  const { organization, services } = statusData;
  const overallStatus = calculateOverallStatus(services);
  const overallStatusColors = getStatusColor(overallStatus);
  const operationalCount = services.filter(
    s => s.currentStatus.toLowerCase().replace(/_/g, ' ') === 'operational'
  ).length;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Organization Header */}
        <div className="flex flex-col items-center text-center py-8">
          {organization.logo ? (
            <img 
              src={organization.logo} 
              alt={`${organization.name} logo`} 
              className="h-10 w-auto mb-4"
            />
          ) : (
            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-gray-700">{organization.name.charAt(0)}</span>
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{organization.name} Status</h1>
          <p className="text-gray-500 text-sm">
            Last updated: {formatDate(new Date().toISOString())}
          </p>
        </div>

        {/* Overall Status Card */}
        <Card className={`${overallStatusColors.bg} border ${overallStatusColors.border} rounded-lg shadow-sm overflow-hidden`}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {getStatusIcon(overallStatus)}
                <div>
                  <h2 className={`text-2xl font-semibold ${overallStatusColors.text}`}>
                    {overallStatus === 'operational' ? 'All Systems Operational' : getStatusLabel(overallStatus)}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {operationalCount} of {services.length} systems operational
                  </p>
                </div>
              </div>
              <Badge variant="outline" className={`${overallStatusColors.bg} ${overallStatusColors.text} border-none text-sm py-1 px-3`}>
                {getStatusLabel(overallStatus)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Services Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Services</h2>
            <div className="space-y-6">
              {services.map((service, index) => {
                const uptimePercentage = calculateUptimePercentage(service);
                const statusColors = getStatusColor(service.currentStatus);
                const isLast = index === services.length - 1;
                
                return (
                  <div key={service.id}>
                    <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(service.currentStatus)}
                          <h3 className="font-medium text-gray-900">{service.name}</h3>
                        </div>
                        {service.description && (
                          <p className="text-sm text-gray-500 ml-7">{service.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex-1 md:flex-none">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">
                              Uptime
                            </span>
                            <span className="text-xs font-medium">
                              {uptimePercentage}%
                            </span>
                          </div>
                          <div className="w-32 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`${statusColors.progress} h-1.5 rounded-full`} 
                              style={{ width: `${uptimePercentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <Badge variant="outline" className={`${statusColors.bg} ${statusColors.text} border-none whitespace-nowrap`}>
                          {getStatusLabel(service.currentStatus)}
                        </Badge>
                      </div>
                    </div>
                    {!isLast && <Separator className="my-6" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-xs mt-8 pb-6">
          <p>© {new Date().getFullYear()} {organization.name} • All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;